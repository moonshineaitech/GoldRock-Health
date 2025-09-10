import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { elevenLabsService } from "./services/elevenlabs";
import { medicalCasesService } from "./services/medicalCases";
import { openAIService } from "./services/openai";
import { diagnosticEngine } from "./services/diagnosticEngine";
import { voiceCacheService } from "./services/voiceCache";
import { aiCaseGenerator, type CaseGenerationRequest } from "./services/aiCaseGenerator";
import { insertUserProgressSchema } from "@shared/schema";
import { setupAuth, isAuthenticated, requiresSubscription } from "./replitAuth";
import { AchievementService } from "./services/achievementService";
import Stripe from "stripe";
import { z } from "zod";
import multer from "multer";
// We'll import pdfParse dynamically when needed to avoid loading issues

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

// Store Stripe price IDs
let MONTHLY_PRICE_ID: string;
let ANNUAL_PRICE_ID: string;

// Setup Stripe prices on startup
async function setupStripe() {
  try {
    console.log('Setting up Stripe prices...');
    
    // Create or retrieve monthly price ($20)
    const existingPrices = await stripe.prices.list({ limit: 100 });
    
    let monthlyPrice = existingPrices.data.find(
      price => price.metadata?.plan === 'monthly' && price.unit_amount === 2000
    );
    
    if (!monthlyPrice) {
      console.log('Creating monthly price...');
      const product = await stripe.products.create({
        name: 'MedTrainer Premium Monthly',
        description: 'Monthly subscription for MedTrainer Premium features including medical bill AI analysis and unlimited medical training',
      });
      
      monthlyPrice = await stripe.prices.create({
        unit_amount: 2000, // $20.00
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        product: product.id,
        metadata: {
          plan: 'monthly',
        },
      });
    }
    
    let annualPrice = existingPrices.data.find(
      price => price.metadata?.plan === 'annual' && price.unit_amount === 18900
    );
    
    if (!annualPrice) {
      console.log('Creating annual price...');
      const product = await stripe.products.create({
        name: 'MedTrainer Premium Annual',
        description: 'Annual subscription for MedTrainer Premium features including medical bill AI analysis and unlimited medical training (Save 21%)',
      });
      
      annualPrice = await stripe.prices.create({
        unit_amount: 18900, // $189.00
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
        product: product.id,
        metadata: {
          plan: 'annual',
        },
      });
    }
    
    MONTHLY_PRICE_ID = monthlyPrice.id;
    ANNUAL_PRICE_ID = annualPrice.id;
    
    console.log(`Stripe setup complete:
    - Monthly Price ID: ${MONTHLY_PRICE_ID}
    - Annual Price ID: ${ANNUAL_PRICE_ID}`);
    
  } catch (error) {
    console.error('Failed to setup Stripe prices:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit per file
      files: 5, // Maximum 5 files
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and WebP image files are allowed."));
      }
    },
  });

  // Initialize Stripe prices first
  await setupStripe();
  
  // Initialize medical cases on startup
  await medicalCasesService.initializeCases();
  
  // Initialize medical images on startup
  const { MedicalImageService } = await import("./services/medicalImageData");
  await MedicalImageService.initializeImages();
  
  // Initialize board exams on startup
  const { BoardExamService } = await import("./services/boardExamData");
  await BoardExamService.initializeExams();
  
  // Initialize clinical decision trees on startup
  const { ClinicalDecisionTreeService } = await import("./services/clinicalDecisionTreeData");
  await ClinicalDecisionTreeService.initializeTrees();

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Subscription management
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { priceId, planType } = req.body;
      
      let user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If user already has a subscription, return existing
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
          expand: ['latest_invoice.payment_intent'],
        });
        const invoice = subscription.latest_invoice as any;
        return res.json({
          subscriptionId: subscription.id,
          clientSecret: invoice?.payment_intent?.client_secret,
        });
      }

      if (!user.email) {
        return res.status(400).json({ message: 'No user email on file' });
      }

      // Create Stripe customer if doesn't exist
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        });
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        await storage.upsertUser({
          ...user,
          stripeCustomerId: customerId,
        });
      }

      // Create subscription
      const selectedPriceId = priceId || (planType === 'annual' ? ANNUAL_PRICE_ID : MONTHLY_PRICE_ID);
      
      console.log(`Creating subscription for user ${userId} with plan ${planType}, priceId: ${selectedPriceId}`);
      
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: selectedPriceId,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription info
      await storage.upsertUser({
        ...user,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: 'active',
        subscriptionPlan: planType || 'monthly',
      });

      const invoice = subscription.latest_invoice as any;
      res.json({
        subscriptionId: subscription.id,
        clientSecret: invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      res.status(500).json({ message: 'Failed to create subscription: ' + error.message });
    }
  });

  // Check subscription status
  app.get('/api/subscription-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const subscriptionStatus = {
        isSubscribed: user.subscriptionStatus === 'active',
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus,
        endsAt: user.subscriptionEndsAt,
      };

      res.json(subscriptionStatus);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      res.status(500).json({ message: 'Failed to check subscription status' });
    }
  });

  // Medical Cases Routes
  app.get('/api/cases', async (req, res) => {
    try {
      const { specialty, difficulty, search } = req.query;
      const filters = {
        specialty: specialty as string,
        difficulty: difficulty ? parseInt(difficulty as string) : undefined,
        search: search as string,
      };
      
      const cases = await storage.getMedicalCases(filters);
      res.json(cases);
    } catch (error) {
      console.error('Error fetching cases:', error);
      res.status(500).json({ message: 'Failed to fetch medical cases' });
    }
  });

  app.get('/api/cases/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const medicalCase = await storage.getMedicalCase(id);
      
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }
      
      res.json(medicalCase);
    } catch (error) {
      console.error('Error fetching case:', error);
      res.status(500).json({ message: 'Failed to fetch medical case' });
    }
  });

  // User Progress Routes
  app.get('/api/progress/:caseId', async (req, res) => {
    try {
      const { caseId } = req.params;
      const progress = await storage.getUserProgress(caseId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ message: 'Failed to fetch progress' });
    }
  });

  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId
      });
      
      const progress = await storage.createUserProgress(progressData);
      
      // If the case was completed, update stats and check achievements
      if (progress.completed && progress.accuracy && progress.timeElapsed) {
        await AchievementService.updateStatsAfterCaseCompletion(
          userId,
          progress.caseId,
          parseFloat(progress.accuracy),
          progress.timeElapsed
        );
        
        // Check for newly unlocked achievements
        const newAchievements = await AchievementService.checkAndUnlockAchievements(userId);
        
        // Return progress along with any new achievements
        res.status(201).json({
          progress,
          newAchievements: newAchievements.map(na => ({
            achievement: na.achievement,
            points: na.achievement.points
          }))
        });
      } else {
        res.status(201).json({ progress, newAchievements: [] });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid progress data', errors: error.errors });
      }
      console.error('Error creating progress:', error);
      res.status(500).json({ message: 'Failed to create progress record' });
    }
  });

  app.patch('/api/progress/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const progress = await storage.updateUserProgress(id, updates);
      
      if (!progress) {
        return res.status(404).json({ message: 'Progress record not found' });
      }
      
      res.json(progress);
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ message: 'Failed to update progress' });
    }
  });

  // Voice Synthesis Routes
  app.post('/api/voice/synthesize', async (req, res) => {
    try {
      const { text, patientProfile } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: 'Text is required for synthesis' });
      }

      let result;
      if (patientProfile) {
        result = await elevenLabsService.synthesizePatientResponse(text, patientProfile);
      } else {
        result = await elevenLabsService.synthesizeText({ text });
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error synthesizing voice:', error);
      res.status(500).json({ message: 'Failed to synthesize voice' });
    }
  });

  app.get('/api/voice/voices', async (req, res) => {
    try {
      const voices = await elevenLabsService.getAvailableVoices();
      res.json(voices);
    } catch (error) {
      console.error('Error fetching voices:', error);
      res.status(500).json({ message: 'Failed to fetch available voices' });
    }
  });

  // Serve cached voice files
  app.get('/api/voice-cache/:filename', async (req, res) => {
    try {
      const { filename } = req.params;
      
      if (!filename.endsWith('.mp3')) {
        return res.status(400).json({ message: 'Invalid file format' });
      }

      const audioBuffer = await voiceCacheService.getCachedAudioFile(filename);
      
      if (!audioBuffer) {
        return res.status(404).json({ message: 'Audio file not found' });
      }

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      });
      
      res.send(audioBuffer);
    } catch (error) {
      console.error('Error serving cached audio:', error);
      res.status(500).json({ message: 'Failed to serve audio file' });
    }
  });

  // Platform Statistics Route
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      if (!stats) {
        // Create initial stats if none exist
        const newStats = await storage.updatePlatformStats();
        return res.json(newStats);
      }
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Failed to fetch platform statistics' });
    }
  });

  // Achievements Routes
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ message: 'Failed to fetch achievements' });
    }
  });

  app.get('/api/user-achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      res.status(500).json({ message: 'Failed to fetch user achievements' });
    }
  });

  app.post('/api/achievements/:id/unlock', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.claims?.sub;
      const achievement = await storage.unlockAchievement(id, userId);
      res.status(201).json(achievement);
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      res.status(500).json({ message: 'Failed to unlock achievement' });
    }
  });

  // Update achievement progress
  app.post('/api/achievements/:id/progress', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      const userId = req.user?.claims?.sub;
      const achievement = await storage.updateAchievementProgress(userId, id, progress);
      res.json(achievement);
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      res.status(500).json({ message: 'Failed to update achievement progress' });
    }
  });

  // Check and unlock achievements automatically
  app.post('/api/achievements/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const unlockedAchievements = await AchievementService.checkAndUnlockAchievements(userId);
      res.json(unlockedAchievements);
    } catch (error) {
      console.error('Error checking achievements:', error);
      res.status(500).json({ message: 'Failed to check achievements' });
    }
  });

  // User Statistics Routes
  app.get('/api/user-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      let userStats = await storage.getUserStats(userId);
      
      if (!userStats) {
        userStats = await storage.initializeUserStats(userId);
      }
      
      res.json(userStats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ message: 'Failed to fetch user statistics' });
    }
  });

  app.put('/api/user-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const updates = req.body;
      const userStats = await storage.updateUserStats(userId, updates);
      res.json(userStats);
    } catch (error) {
      console.error('Error updating user stats:', error);
      res.status(500).json({ message: 'Failed to update user statistics' });
    }
  });

  app.get('/api/user-progress-summary', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      // Get user basic info
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get all user progress records
      const allProgress = await storage.getUserProgress('', userId);
      
      // Get user achievements
      const userAchievements = await storage.getUserAchievements(userId);
      
      // Calculate summary statistics
      const completedCases = allProgress.filter(p => p.completed).length;
      const totalAccuracy = allProgress.length > 0 
        ? allProgress.reduce((sum, p) => sum + (parseFloat(p.accuracy || '0')), 0) / allProgress.length 
        : 0;
      const totalScore = allProgress.reduce((sum, p) => sum + (p.score || 0), 0);
      const totalPoints = userAchievements.reduce((sum: number, ua: any) => sum + (ua.points || 0), 0);
      
      // Calculate specialty progress
      const specialtyProgress: Record<string, { completed: number; accuracy: number }> = {};
      for (const progress of allProgress.filter(p => p.completed)) {
        // This would ideally get specialty from the medical case
        // For now, we'll use a placeholder approach
        const specialty = 'General'; // You'd need to join with medical cases to get actual specialty
        if (!specialtyProgress[specialty]) {
          specialtyProgress[specialty] = { completed: 0, accuracy: 0 };
        }
        specialtyProgress[specialty].completed++;
        specialtyProgress[specialty].accuracy += parseFloat(progress.accuracy || '0');
      }
      
      // Calculate average accuracy per specialty
      Object.keys(specialtyProgress).forEach(specialty => {
        if (specialtyProgress[specialty].completed > 0) {
          specialtyProgress[specialty].accuracy /= specialtyProgress[specialty].completed;
        }
      });

      const summary = {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl
        },
        stats: {
          casesCompleted: completedCases,
          accuracy: Math.round(totalAccuracy * 100) / 100,
          totalScore,
          totalPoints,
          achievementsUnlocked: userAchievements.length,
          currentStreak: 0, // Would need additional logic to calculate streaks
          timeSpent: allProgress.reduce((sum, p) => sum + (p.timeElapsed || 0), 0)
        },
        specialtyProgress,
        recentAchievements: userAchievements.slice(0, 5),
        recentActivity: allProgress.slice(0, 10)
      };

      res.json(summary);
    } catch (error) {
      console.error('Error fetching user progress summary:', error);
      res.status(500).json({ message: 'Failed to fetch user progress summary' });
    }
  });

  // Case Question/Response System with AI Integration
  app.post('/api/cases/:id/ask', async (req, res) => {
    try {
      const { id } = req.params;
      const { question, conversationHistory = [] } = req.body;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      let response = "I'm not sure I understand that question. Could you ask it differently?";
      let medicalAccuracy = 5;
      let suggestionForDoctor = undefined;

      // Try OpenAI first for intelligent responses
      if (process.env.OPENAI_API_KEY) {
        try {
          const aiResponse = await openAIService.generatePatientResponse(
            question, 
            medicalCase, 
            conversationHistory
          );
          response = aiResponse.response;
          medicalAccuracy = aiResponse.medicalAccuracy;
          suggestionForDoctor = aiResponse.suggestionForDoctor;
        } catch (aiError) {
          console.warn('AI response failed, falling back to predefined responses:', aiError);
          
          // Fallback to predefined responses
          const responses = medicalCase.responses || {};
          const questionLower = question.toLowerCase();
          
          for (const [key, value] of Object.entries(responses)) {
            if (questionLower.includes(key.toLowerCase()) || 
                key.toLowerCase().includes(questionLower)) {
              response = value;
              break;
            }
          }
        }
      } else {
        // Fallback to predefined responses if no OpenAI key
        const responses = medicalCase.responses || {};
        const questionLower = question.toLowerCase();
        
        for (const [key, value] of Object.entries(responses)) {
          if (questionLower.includes(key.toLowerCase()) || 
              key.toLowerCase().includes(questionLower)) {
            response = value;
            break;
          }
        }
      }

      // Synthesize voice response if ElevenLabs is available
      let audioUrl = null;
      try {
        const voiceResult = await elevenLabsService.synthesizePatientResponse(response, {
          age: medicalCase.age,
          gender: medicalCase.gender,
        });
        audioUrl = voiceResult.audioUrl;
      } catch (voiceError) {
        console.warn('Voice synthesis failed, continuing without audio:', voiceError);
      }

      res.json({
        question,
        response,
        audioUrl,
        medicalAccuracy,
        suggestionForDoctor,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error processing question:', error);
      res.status(500).json({ message: 'Failed to process question' });
    }
  });

  // Diagnosis Submission with AI Feedback
  app.post('/api/cases/:id/diagnose', async (req, res) => {
    try {
      const { id } = req.params;
      const { diagnosis, confidence, questionsAsked = [], timeElapsed } = req.body;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      let accuracy = 0;
      let feedback = "";
      let recommendations: string[] = [];
      let missedFindings: string[] = [];

      // Use OpenAI for intelligent feedback if available
      if (process.env.OPENAI_API_KEY) {
        try {
          const aiFeedback = await openAIService.provideDiagnosticFeedback(
            diagnosis,
            medicalCase.correctDiagnosis,
            medicalCase,
            questionsAsked,
            timeElapsed
          );
          accuracy = aiFeedback.accuracy;
          feedback = aiFeedback.feedback;
          recommendations = aiFeedback.recommendations || [];
          missedFindings = aiFeedback.missedFindings || [];
        } catch (aiError) {
          console.warn('AI feedback failed, using fallback logic:', aiError);
          
          // Fallback logic
          const isCorrect = diagnosis.toLowerCase().includes(medicalCase.correctDiagnosis.toLowerCase()) ||
                           medicalCase.correctDiagnosis.toLowerCase().includes(diagnosis.toLowerCase());
          accuracy = isCorrect ? 85 : 25;
          feedback = isCorrect ? 
            "Excellent diagnosis! You correctly identified the condition." :
            `The correct diagnosis is ${medicalCase.correctDiagnosis}. Review the key symptoms and clinical findings.`;
        }
      } else {
        // Fallback logic without OpenAI
        const isCorrect = diagnosis.toLowerCase().includes(medicalCase.correctDiagnosis.toLowerCase()) ||
                         medicalCase.correctDiagnosis.toLowerCase().includes(diagnosis.toLowerCase());
        accuracy = isCorrect ? 85 : 25;
        feedback = isCorrect ? 
          "Excellent diagnosis! You correctly identified the condition." :
          `The correct diagnosis is ${medicalCase.correctDiagnosis}. Review the key symptoms and clinical findings.`;
      }

      const score = Math.round((accuracy + (confidence * 10) - (questionsAsked.length * 2) - (timeElapsed * 0.1)) * 10) / 10;

      // Create progress record
      const progress = await storage.createUserProgress({
        caseId: id,
        questionsAsked: questionsAsked.length,
        timeElapsed,
        diagnosis,
        confidence,
        accuracy: accuracy.toString(),
        completed: true,
        score: Math.max(0, score),
        feedback
      });

      res.json({
        correct: accuracy >= 70,
        correctDiagnosis: medicalCase.correctDiagnosis,
        accuracy,
        score: progress.score,
        feedback,
        recommendations,
        missedFindings,
        learningObjectives: medicalCase.learningObjectives,
        treatment: medicalCase.correctTreatment,
      });
    } catch (error) {
      console.error('Error processing diagnosis:', error);
      res.status(500).json({ message: 'Failed to process diagnosis' });
    }
  });

  // Simple AI Diagnosis Checking for Pixel Game
  app.post('/api/cases/check-diagnosis', async (req, res) => {
    try {
      const { userDiagnosis, correctDiagnosis, symptoms = [], questionsAsked = [], orderedTests = [] } = req.body;
      
      if (!userDiagnosis || !correctDiagnosis) {
        return res.status(400).json({ message: 'User diagnosis and correct diagnosis are required' });
      }

      let isCorrect = false;

      // Use OpenAI for intelligent diagnosis matching if available
      if (process.env.OPENAI_API_KEY) {
        try {
          const prompt = `You are a medical education AI that needs to determine if a student's diagnosis is medically equivalent to the correct diagnosis.

Student's diagnosis: "${userDiagnosis}"
Correct diagnosis: "${correctDiagnosis}"
Patient symptoms: ${symptoms.join(', ')}
Questions asked: ${questionsAsked.join(', ')}
Tests ordered: ${orderedTests.join(', ')}

Determine if the student's diagnosis is medically equivalent, close enough, or refers to the same condition as the correct diagnosis. Consider:
- Synonyms (e.g., "heart attack" vs "myocardial infarction")
- Abbreviated forms (e.g., "MI" vs "myocardial infarction")
- Related conditions that would be clinically acceptable
- Different levels of specificity (e.g., "pneumonia" vs "bacterial pneumonia")

Respond with ONLY a JSON object:
{
  "isCorrect": true/false,
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}`;

          const response = await openAIService.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an expert medical educator evaluating student diagnoses for accuracy."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_tokens: 200
          });

          const result = JSON.parse(response.choices[0].message.content || '{}');
          isCorrect = result.isCorrect || false;
          
          res.json({ 
            isCorrect, 
            confidence: result.confidence || 0.5,
            reasoning: result.reasoning || 'AI evaluation completed',
            method: 'ai'
          });
          return;
        } catch (aiError) {
          console.warn('AI diagnosis check failed, using fallback logic:', aiError);
        }
      }

      // Fallback to simple text matching
      const userDiagLower = userDiagnosis.toLowerCase().trim();
      const correctDiagLower = correctDiagnosis.toLowerCase().trim();
      
      isCorrect = userDiagLower.includes(correctDiagLower) || 
                  correctDiagLower.includes(userDiagLower) ||
                  userDiagLower === correctDiagLower;

      res.json({ 
        isCorrect, 
        confidence: isCorrect ? 0.8 : 0.2,
        reasoning: isCorrect ? 'Text matching successful' : 'No text match found',
        method: 'fallback'
      });
    } catch (error) {
      console.error('Error checking diagnosis:', error);
      res.status(500).json({ message: 'Failed to check diagnosis' });
    }
  });

  // AI Learning Recommendations Route
  app.post('/api/learning-recommendations', async (req, res) => {
    try {
      const { userPerformance } = req.body;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ message: 'AI recommendations not available' });
      }

      const recommendations = await openAIService.generateLearningRecommendations(userPerformance);
      res.json(recommendations);
    } catch (error) {
      console.error('Error generating learning recommendations:', error);
      res.status(500).json({ message: 'Failed to generate recommendations' });
    }
  });

  // Advanced Diagnostic Features
  app.post('/api/cases/:id/differential-diagnosis', async (req, res) => {
    try {
      const { id } = req.params;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const differentials = await diagnosticEngine.generateDifferentialDiagnosis(
        medicalCase.chiefComplaint,
        medicalCase.symptoms,
        medicalCase.physicalExam,
        medicalCase.medicalHistory
      );

      res.json({ differentials });
    } catch (error) {
      console.error('Error generating differential diagnosis:', error);
      res.status(500).json({ message: 'Failed to generate differential diagnosis' });
    }
  });

  app.post('/api/cases/:id/clinical-reasoning', async (req, res) => {
    try {
      const { id } = req.params;
      const { questionsAsked = [] } = req.body;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const reasoning = await diagnosticEngine.generateClinicalReasoning(medicalCase, questionsAsked);
      res.json(reasoning);
    } catch (error) {
      console.error('Error generating clinical reasoning:', error);
      res.status(500).json({ message: 'Failed to generate clinical reasoning' });
    }
  });

  app.post('/api/cases/:id/physical-exam/:system', async (req, res) => {
    try {
      const { id, system } = req.params;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const findings = await diagnosticEngine.simulatePhysicalExam(system, medicalCase);
      res.json({ system, findings });
    } catch (error) {
      console.error('Error simulating physical exam:', error);
      res.status(500).json({ message: 'Failed to simulate physical exam' });
    }
  });

  app.post('/api/cases/:id/learning-objectives', async (req, res) => {
    try {
      const { id } = req.params;
      const { userPerformance } = req.body;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const objectives = await diagnosticEngine.generateLearningObjectives(medicalCase, userPerformance);
      res.json({ objectives });
    } catch (error) {
      console.error('Error generating learning objectives:', error);
      res.status(500).json({ message: 'Failed to generate learning objectives' });
    }
  });

  // Diagnostic Test Ordering Routes
  app.get('/api/cases/:id/available-tests', async (req, res) => {
    try {
      const { id } = req.params;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      // If case doesn't have diagnostic tests, generate them on-demand
      let diagnosticTests = medicalCase.diagnosticTests?.available;
      if (!diagnosticTests || !diagnosticTests.laboratory || !diagnosticTests.imaging || !diagnosticTests.procedures) {
        console.log(`Generating diagnostic tests for case: ${medicalCase.name}`);
        const safeCase = {
          name: medicalCase.name,
          age: medicalCase.age,
          gender: medicalCase.gender,
          specialty: medicalCase.specialty,
          difficulty: medicalCase.difficulty,
          chiefComplaint: medicalCase.chiefComplaint,
          symptoms: medicalCase.symptoms || [],
          medicalHistory: medicalCase.medicalHistory || {},
          physicalExam: medicalCase.physicalExam || {},
          correctDiagnosis: medicalCase.correctDiagnosis,
          correctTreatment: medicalCase.correctTreatment,
          learningObjectives: medicalCase.learningObjectives || [],
          estimatedDuration: medicalCase.estimatedDuration,
          rating: medicalCase.rating,
          responses: medicalCase.responses || {}
        };
        const comprehensiveCase = medicalCasesService.generateComprehensiveCase(safeCase);
        diagnosticTests = comprehensiveCase.diagnosticTests?.available || {
          laboratory: [],
          imaging: [],
          procedures: []
        };
        
        // Update the case in storage with generated data
        await storage.updateMedicalCase(id, { 
          diagnosticTests: comprehensiveCase.diagnosticTests,
          physicalExam: comprehensiveCase.physicalExam
        });
      }

      res.json(diagnosticTests);
    } catch (error) {
      console.error('Error fetching available tests:', error);
      res.status(500).json({ message: 'Failed to fetch available tests' });
    }
  });

  app.post('/api/cases/:id/order-test', async (req, res) => {
    try {
      const { id } = req.params;
      const { testName, testType } = req.body;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const diagnosticTests = medicalCase.diagnosticTests || { available: { laboratory: [], imaging: [], procedures: [] }, ordered: [], completed: [] };
      
      // Add test to ordered list if not already ordered
      if (!diagnosticTests.ordered.includes(testName)) {
        diagnosticTests.ordered.push(testName);
        diagnosticTests.completed.push(testName); // For simulation, tests complete immediately
      }

      // Update the case with ordered tests
      await storage.updateMedicalCase(id, { diagnosticTests });

      // Find the specific test results
      const allTests = [
        ...diagnosticTests.available.laboratory,
        ...diagnosticTests.available.imaging,
        ...diagnosticTests.available.procedures
      ];
      
      const orderedTest = allTests.find(test => test.name === testName);
      
      res.json({
        success: true,
        testName,
        testType,
        result: orderedTest,
        message: `${testName} has been ordered and results are available`
      });
    } catch (error) {
      console.error('Error ordering test:', error);
      res.status(500).json({ message: 'Failed to order test' });
    }
  });

  app.get('/api/cases/:id/test-results', async (req, res) => {
    try {
      const { id } = req.params;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      const diagnosticTests = medicalCase.diagnosticTests || { 
        available: { laboratory: [], imaging: [], procedures: [] }, 
        ordered: [], 
        completed: [] 
      };
      
      // Get results for completed tests - ensure available tests exist
      const allTests = [
        ...(diagnosticTests.available?.laboratory || []),
        ...(diagnosticTests.available?.imaging || []),
        ...(diagnosticTests.available?.procedures || [])
      ];
      
      const completedTests = (diagnosticTests.completed || []).map(testName => 
        allTests.find(test => test && test.name === testName)
      ).filter(Boolean);

      res.json({
        ordered: diagnosticTests.ordered || [],
        completed: diagnosticTests.completed || [],
        results: completedTests
      });
    } catch (error) {
      console.error('Error fetching test results:', error);
      res.status(500).json({ message: 'Failed to fetch test results' });
    }
  });

  // Enhanced Physical Exam Route (case-specific)
  app.get('/api/cases/:id/physical-exam-complete', async (req, res) => {
    try {
      const { id } = req.params;
      
      const medicalCase = await storage.getMedicalCase(id);
      if (!medicalCase) {
        return res.status(404).json({ message: 'Medical case not found' });
      }

      // If case doesn't have physical exam data, generate it on-demand
      let physicalExam = medicalCase.physicalExam;
      if (!physicalExam || Object.keys(physicalExam).length === 0) {
        console.log(`Generating physical exam for case: ${medicalCase.name}`);
        const safeCase = {
          name: medicalCase.name,
          age: medicalCase.age,
          gender: medicalCase.gender,
          specialty: medicalCase.specialty,
          difficulty: medicalCase.difficulty,
          chiefComplaint: medicalCase.chiefComplaint,
          symptoms: medicalCase.symptoms || [],
          medicalHistory: medicalCase.medicalHistory || {},
          physicalExam: medicalCase.physicalExam || {},
          correctDiagnosis: medicalCase.correctDiagnosis,
          correctTreatment: medicalCase.correctTreatment,
          learningObjectives: medicalCase.learningObjectives || [],
          estimatedDuration: medicalCase.estimatedDuration,
          rating: medicalCase.rating,
          responses: medicalCase.responses || {}
        };
        const comprehensiveCase = medicalCasesService.generateComprehensiveCase(safeCase);
        physicalExam = comprehensiveCase.physicalExam || {};
        
        
        // Update the case in storage with generated data
        await storage.updateMedicalCase(id, { 
          diagnosticTests: comprehensiveCase.diagnosticTests,
          physicalExam: comprehensiveCase.physicalExam
        });
      }
      
      res.json({
        patientInfo: {
          name: medicalCase.name,
          age: medicalCase.age,
          gender: medicalCase.gender,
          chiefComplaint: medicalCase.chiefComplaint
        },
        physicalExam
      });
    } catch (error) {
      console.error('Error fetching complete physical exam:', error);
      res.status(500).json({ message: 'Failed to fetch physical exam' });
    }
  });

  // AI Case Generation Routes
  app.post('/api/ai/generate-case', async (req, res) => {
    try {
      const request: CaseGenerationRequest = req.body;
      
      // Validate request
      if (!request.specialty || !request.difficulty) {
        return res.status(400).json({ 
          message: 'Specialty and difficulty are required' 
        });
      }

      console.log(`Generating AI case for ${request.specialty}, difficulty ${request.difficulty}`);
      const generatedCase = await aiCaseGenerator.generateMedicalCase(request);
      
      // Save the generated case to database
      const savedCase = await storage.createMedicalCase(generatedCase);
      
      res.json({
        success: true,
        case: savedCase,
        message: `Successfully generated ${request.specialty} case with AI`
      });
    } catch (error) {
      console.error('Error generating AI case:', error);
      res.status(500).json({ 
        message: 'Failed to generate AI case',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/api/ai/generate-multiple-cases', async (req, res) => {
    try {
      const { request, count = 3 }: { request: CaseGenerationRequest, count?: number } = req.body;
      
      if (!request.specialty || !request.difficulty) {
        return res.status(400).json({ 
          message: 'Specialty and difficulty are required' 
        });
      }

      if (count > 5) {
        return res.status(400).json({ 
          message: 'Maximum 5 cases can be generated at once' 
        });
      }

      console.log(`Generating ${count} AI cases for ${request.specialty}`);
      const generatedCases = await aiCaseGenerator.generateMultipleCases(request, count);
      
      // Save all generated cases to database
      const savedCases = [];
      for (const caseData of generatedCases) {
        const savedCase = await storage.createMedicalCase(caseData);
        savedCases.push(savedCase);
      }
      
      res.json({
        success: true,
        cases: savedCases,
        count: savedCases.length,
        message: `Successfully generated ${savedCases.length} ${request.specialty} cases with AI`
      });
    } catch (error) {
      console.error('Error generating multiple AI cases:', error);
      res.status(500).json({ 
        message: 'Failed to generate AI cases',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get('/api/ai/specialties', async (req, res) => {
    try {
      const specialties = aiCaseGenerator.getAvailableSpecialties();
      res.json(specialties);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      res.status(500).json({ message: 'Failed to fetch specialties' });
    }
  });

  app.get('/api/ai/difficulty-levels', async (req, res) => {
    try {
      const levels = aiCaseGenerator.getDifficultyLevels();
      res.json(levels);
    } catch (error) {
      console.error('Error fetching difficulty levels:', error);
      res.status(500).json({ message: 'Failed to fetch difficulty levels' });
    }
  });

  // Medical Images routes
  app.get('/api/medical-images', async (req, res) => {
    try {
      const { imageType, difficulty, bodyRegion, search } = req.query;
      const filters = {
        imageType: imageType as string,
        difficulty: difficulty ? parseInt(difficulty as string) : undefined,
        bodyRegion: bodyRegion as string,
        search: search as string,
      };
      
      const images = await storage.getMedicalImages(filters);
      res.json(images);
    } catch (error) {
      console.error('Error fetching medical images:', error);
      res.status(500).json({ message: 'Failed to fetch medical images' });
    }
  });

  // Medical Images with path parameters (for frontend compatibility)
  app.get('/api/medical-images/:imageType/:difficulty', async (req, res) => {
    try {
      const { imageType, difficulty } = req.params;
      const { bodyRegion, search } = req.query;
      const filters = {
        imageType: imageType !== 'all' ? imageType : undefined,
        difficulty: difficulty !== 'all' ? parseInt(difficulty) : undefined,
        bodyRegion: bodyRegion as string,
        search: search as string,
      };
      
      const images = await storage.getMedicalImages(filters);
      res.json(images);
    } catch (error) {
      console.error('Error fetching medical images:', error);
      res.status(500).json({ message: 'Failed to fetch medical images' });
    }
  });

  app.get('/api/medical-images/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const image = await storage.getMedicalImage(id);
      
      if (!image) {
        return res.status(404).json({ message: 'Medical image not found' });
      }
      
      res.json(image);
    } catch (error) {
      console.error('Error fetching medical image:', error);
      res.status(500).json({ message: 'Failed to fetch medical image' });
    }
  });

  // Image Analysis Progress routes
  app.get('/api/image-analysis-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getImageAnalysisProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching image analysis progress:', error);
      res.status(500).json({ message: 'Failed to fetch image analysis progress' });
    }
  });

  app.post('/api/image-analysis-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { imageId, findings, diagnosis, confidence } = req.body;

      // Calculate accuracy based on findings
      const image = await storage.getMedicalImage(imageId);
      if (!image) {
        return res.status(404).json({ message: 'Medical image not found' });
      }

      const keyFindings = image.keyFindings || [];
      const correctFindings = findings.filter((f: any) => 
        keyFindings.some((kf: any) => 
          Math.abs(f.x - kf.x) < 10 && 
          Math.abs(f.y - kf.y) < 10
        )
      );
      
      const accuracy = keyFindings.length > 0 
        ? (correctFindings.length / keyFindings.length) * 100 
        : 0;

      // Calculate score based on accuracy, confidence, and findings
      const baseScore = Math.round(accuracy * 0.6 + confidence * 10 * 0.3 + findings.length * 5 * 0.1);
      const score = Math.min(100, Math.max(0, baseScore));

      const progressData = {
        userId,
        imageId,
        findingsIdentified: findings,
        diagnosis,
        confidence,
        accuracy: parseFloat(accuracy.toFixed(2)),
        score,
        completed: true,
        completedAt: new Date(),
      };

      const progress = await storage.createImageAnalysisProgress(progressData);
      
      // Check for achievements
      await checkImageAnalysisAchievements(userId, progress, accuracy);
      
      res.json(progress);
    } catch (error) {
      console.error('Error creating image analysis progress:', error);
      res.status(500).json({ message: 'Failed to save image analysis progress' });
    }
  });

  // Study Groups routes
  app.get('/api/study-groups', isAuthenticated, async (req: any, res) => {
    try {
      const { specialty, search } = req.query;
      const filters = {
        specialty: specialty as string,
        search: search as string,
      };
      
      const groups = await storage.getStudyGroups(filters);
      res.json(groups);
    } catch (error) {
      console.error('Error fetching study groups:', error);
      res.status(500).json({ message: 'Failed to fetch study groups' });
    }
  });

  app.post('/api/study-groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groupData = { ...req.body, creatorId: userId };
      
      const group = await storage.createStudyGroup(groupData);
      
      // Add creator as admin member
      await storage.addStudyGroupMember({
        groupId: group.id,
        userId,
        role: 'admin',
      });
      
      res.json(group);
    } catch (error) {
      console.error('Error creating study group:', error);
      res.status(500).json({ message: 'Failed to create study group' });
    }
  });

  app.post('/api/study-groups/:groupId/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { groupId } = req.params;
      const { inviteCode } = req.body;
      
      const group = await storage.getStudyGroup(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Study group not found' });
      }
      
      // Check if group is private and requires invite code
      if (group.isPrivate && group.inviteCode !== inviteCode) {
        return res.status(403).json({ message: 'Invalid invite code' });
      }
      
      // Check if group is full
      if (group.currentMembers >= group.maxMembers) {
        return res.status(400).json({ message: 'Study group is full' });
      }
      
      const member = await storage.addStudyGroupMember({
        groupId,
        userId,
        role: 'member',
      });
      
      res.json(member);
    } catch (error) {
      console.error('Error joining study group:', error);
      res.status(500).json({ message: 'Failed to join study group' });
    }
  });

  // Board Exams routes
  app.get('/api/board-exams', async (req, res) => {
    try {
      const { examType, specialty, difficulty } = req.query;
      const filters = {
        examType: examType as string,
        specialty: specialty as string,
        difficulty: difficulty ? parseInt(difficulty as string) : undefined,
      };
      
      const exams = await storage.getBoardExams(filters);
      res.json(exams);
    } catch (error) {
      console.error('Error fetching board exams:', error);
      res.status(500).json({ message: 'Failed to fetch board exams' });
    }
  });

  // Board Exams with path parameters (for frontend compatibility)
  app.get('/api/board-exams/:examType/:specialty/:difficulty', async (req, res) => {
    try {
      const { examType, specialty, difficulty } = req.params;
      const filters = {
        examType: examType !== 'all' ? examType : undefined,
        specialty: specialty !== 'all' ? specialty : undefined,
        difficulty: difficulty !== 'all' ? parseInt(difficulty) : undefined,
      };
      
      const exams = await storage.getBoardExams(filters);
      res.json(exams);
    } catch (error) {
      console.error('Error fetching board exams:', error);
      res.status(500).json({ message: 'Failed to fetch board exams' });
    }
  });

  app.get('/api/board-exams/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const exam = await storage.getBoardExam(id);
      
      if (!exam) {
        return res.status(404).json({ message: 'Board exam not found' });
      }
      
      res.json(exam);
    } catch (error) {
      console.error('Error fetching board exam:', error);
      res.status(500).json({ message: 'Failed to fetch board exam' });
    }
  });

  app.post('/api/board-exam-attempts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attemptData = { ...req.body, userId };
      
      const attempt = await storage.createBoardExamAttempt(attemptData);
      res.json(attempt);
    } catch (error) {
      console.error('Error creating board exam attempt:', error);
      res.status(500).json({ message: 'Failed to create board exam attempt' });
    }
  });

  // Clinical Decision Trees routes
  app.get('/api/clinical-decision-trees', async (req, res) => {
    try {
      const { specialty, difficulty, category } = req.query;
      const filters = {
        specialty: specialty as string,
        difficulty: difficulty ? parseInt(difficulty as string) : undefined,
        category: category as string,
      };
      
      const trees = await storage.getClinicalDecisionTrees(filters);
      res.json(trees);
    } catch (error) {
      console.error('Error fetching clinical decision trees:', error);
      res.status(500).json({ message: 'Failed to fetch clinical decision trees' });
    }
  });

  // Clinical Decision Trees with path parameters (for frontend compatibility)
  app.get('/api/clinical-decision-trees/:specialty/:difficulty/:category', async (req, res) => {
    try {
      const { specialty, difficulty, category } = req.params;
      const filters = {
        specialty: specialty !== 'all' ? specialty : undefined,
        difficulty: difficulty !== 'all' ? parseInt(difficulty) : undefined,
        category: category !== 'all' ? category : undefined,
      };
      
      const trees = await storage.getClinicalDecisionTrees(filters);
      res.json(trees);
    } catch (error) {
      console.error('Error fetching clinical decision trees:', error);
      res.status(500).json({ message: 'Failed to fetch clinical decision trees' });
    }
  });

  app.get('/api/clinical-decision-trees/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const tree = await storage.getClinicalDecisionTree(id);
      
      if (!tree) {
        return res.status(404).json({ message: 'Clinical decision tree not found' });
      }
      
      res.json(tree);
    } catch (error) {
      console.error('Error fetching clinical decision tree:', error);
      res.status(500).json({ message: 'Failed to fetch clinical decision tree' });
    }
  });

  app.get('/api/decision-tree-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getDecisionTreeProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching decision tree progress:', error);
      res.status(500).json({ message: 'Failed to fetch decision tree progress' });
    }
  });

  app.post('/api/decision-tree-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = { ...req.body, userId };
      
      const progress = await storage.createDecisionTreeProgress(progressData);
      
      // Check for achievements
      await checkDecisionTreeAchievements(userId, progress);
      
      res.json(progress);
    } catch (error) {
      console.error('Error creating decision tree progress:', error);
      res.status(500).json({ message: 'Failed to save decision tree progress' });
    }
  });

  // Helper function to check for achievements
  async function checkImageAnalysisAchievements(userId: string, progress: any, accuracy: number) {
    try {
      const userProgress = await storage.getImageAnalysisProgress(userId);
      const completedCount = userProgress.filter((p: any) => p.completed).length;
      
      // Check for various achievement criteria
      const achievementChecks = [
        { id: 'first_image_analysis', criteria: () => completedCount === 1 },
        { id: 'image_analysis_streak_5', criteria: () => completedCount === 5 },
        { id: 'image_analysis_streak_10', criteria: () => completedCount === 10 },
        { id: 'radiology_expert', criteria: () => completedCount === 25 },
        { id: 'perfect_image_analysis', criteria: () => accuracy === 100 },
        { id: 'image_analysis_master', criteria: () => {
          const recentProgress = userProgress.slice(-10);
          return recentProgress.length === 10 && 
                 recentProgress.every((p: any) => (p.accuracy || 0) >= 90);
        }},
      ];
      
      for (const check of achievementChecks) {
        if (check.criteria()) {
          await storage.unlockAchievement(userId, check.id);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Helper function to check for decision tree achievements
  async function checkDecisionTreeAchievements(userId: string, progress: any) {
    try {
      const userProgress = await storage.getDecisionTreeProgress(userId);
      const completedCount = userProgress.filter((p: any) => p.completed).length;
      const optimalPaths = userProgress.filter((p: any) => p.isOptimalPath).length;
      
      // Check for various achievement criteria
      const achievementChecks = [
        { id: 'first_decision_tree', criteria: () => completedCount === 1 },
        { id: 'decision_tree_streak_5', criteria: () => completedCount === 5 },
        { id: 'clinical_reasoning_expert', criteria: () => completedCount === 15 },
        { id: 'optimal_path_master', criteria: () => optimalPaths >= 10 },
        { id: 'perfect_clinical_reasoning', criteria: () => progress.isOptimalPath && progress.score >= 90 },
        { id: 'emergency_protocols_master', criteria: () => {
          const emergencyTrees = userProgress.filter((p: any) => 
            p.specialty === 'Emergency Medicine' && p.isOptimalPath
          );
          return emergencyTrees.length >= 3;
        }},
      ];
      
      for (const check of achievementChecks) {
        if (check.criteria()) {
          await storage.unlockAchievement(userId, check.id);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Chat Sessions API
  app.get('/api/chat-sessions/current', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Try to find existing session first
      let session = await storage.getCurrentChatSession(userId);
      
      // If no session exists, create a new one
      if (!session) {
        session = await storage.createChatSession({
          userId,
          title: "Medical Bill Analysis",
          sessionType: "bill_analysis"
        });
      }
      
      res.json(session);
    } catch (error) {
      console.error('Error getting current chat session:', error);
      res.status(500).json({ message: 'Failed to get chat session' });
    }
  });

  // Chat Messages API
  app.get('/api/chat-messages', isAuthenticated, async (req: any, res) => {
    try {
      const sessionId = req.query.sessionId;
      const userId = req.user.claims.sub;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'sessionId query parameter is required' });
      }
      
      // Verify session belongs to user
      const session = await storage.getChatSession(sessionId as string);
      if (!session || session.userId !== userId) {
        return res.json([]); // Return empty array instead of error
      }
      
      const messages = await storage.getChatMessages(sessionId as string);
      res.json(Array.isArray(messages) ? messages : []);
    } catch (error) {
      console.error('Error getting chat messages:', error);
      res.json([]); // Return empty array on error instead of error response
    }
  });

  app.post('/api/chat-messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, content, role, messageType = 'text' } = req.body;
      
      if (!sessionId || !content || !role) {
        return res.status(400).json({ message: 'sessionId, content, and role are required' });
      }
      
      // Verify session belongs to user
      const session = await storage.getChatSession(sessionId);
      if (!session || session.userId !== userId) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
      
      const message = await storage.createChatMessage({
        sessionId,
        role,
        content,
        messageType
      });
      
      res.json(message);
    } catch (error) {
      console.error('Error creating chat message:', error);
      res.status(500).json({ message: 'Failed to create chat message' });
    }
  });

  // Bill AI Chat API - OpenAI powered medical bill reduction expert
  app.post('/api/bill-ai-chat', requiresSubscription, async (req: any, res) => {
    try {
      const { message } = req.body;
      const userId = req.user.claims.sub;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: 'Message is required' });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ message: 'AI chat service is currently unavailable' });
      }

      try {
        const systemPrompt = `You are a world-class medical bill reduction specialist and expert advocate with 20+ years of experience helping patients save money on medical bills. Your expertise includes:

CORE EXPERTISE:
- Identifying billing errors, overcharges, upcoding, duplicate charges, and phantom billing
- Negotiating with hospital billing departments and insurance companies
- Finding charity care programs and financial assistance opportunities
- Writing professional dispute letters and appeals
- Understanding medical coding (CPT, ICD-10), insurance policies, and billing regulations
- Using fair market pricing data and price transparency laws as negotiation leverage

COMMUNICATION STYLE:
- Provide specific, actionable advice with exact scripts and step-by-step instructions
- Use professional language but make complex medical billing concepts easy to understand
- Give precise dollar amounts and percentage ranges based on real industry data
- Reference specific laws, regulations, and patient rights when relevant
- Always prioritize the patient's financial interests and provide aggressive but legal strategies

RESPONSE FORMAT:
- Start with the most important action item or strategy
- Use clear headings and bullet points for easy reading
- Include specific phone scripts, email templates, or letter formats when applicable
- Provide realistic timelines and success rate expectations
- End with a follow-up question to gather more information if needed

You help patients save thousands of dollars through expert guidance on medical bill reduction strategies.`;

        const response = await openAIService.openai.chat.completions.create({
          model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        });

        const aiResponse = response.choices[0].message.content || "I apologize, but I'm having trouble processing your request right now. Please try asking your question again.";
        
        res.json({ response: aiResponse });
      } catch (aiError) {
        console.error('OpenAI API error:', aiError);
        res.status(500).json({ message: 'AI service temporarily unavailable. Please try again.' });
      }
    } catch (error) {
      console.error('Error in bill AI chat:', error);
      res.status(500).json({ message: 'Failed to process your message' });
    }
  });

  // Bill Upload and Analysis API - AI-powered bill analysis for specific errors and opportunities
  app.post('/api/upload-bill', isAuthenticated, upload.single('bill'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      const sessionId = req.body.sessionId;

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      let billText = '';
      let analysisData: any = {};

      // Only process image files - PDFs are not supported
      if (file.mimetype === 'application/pdf') {
        return res.status(400).json({ 
          message: 'PDF files are not supported. Please convert your bill to an image format (JPG, PNG, WebP) and upload that instead for accurate analysis.' 
        });
      }
      
      // Process image files with OpenAI Vision
      else if (file.mimetype.startsWith('image/')) {
        if (!process.env.OPENAI_API_KEY) {
          return res.status(500).json({ message: 'AI analysis service unavailable. Please try again later.' });
        }

        try {
          const base64Image = file.buffer.toString('base64');
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                {
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text: 'Extract all text from this medical bill image. Provide the complete text content, including all charges, dates, procedure codes, patient information, and billing details. Be thorough and accurate.'
                    },
                    {
                      type: 'image_url',
                      image_url: {
                        url: `data:${file.mimetype};base64,${base64Image}`
                      }
                    }
                  ]
                }
              ],
              max_tokens: 2000
            })
          });

          const visionData = await response.json();
          billText = visionData.choices?.[0]?.message?.content || 'Unable to extract text from image';
        } catch (visionError) {
          console.error('Vision API error:', visionError);
          return res.status(500).json({ message: 'Unable to analyze image. Please try again or upload a clearer image.' });
        }
      }

      // Analyze the bill with expert AI prompting
      if (process.env.OPENAI_API_KEY && billText) {
        try {
          const analysisPrompt = `You are the world's leading medical bill reduction expert with 25+ years of experience saving patients millions. Analyze this medical bill with forensic precision to find every possible error and savings opportunity.

**MEDICAL BILL CONTENT:**
${billText}

**COMPREHENSIVE EXPERT ANALYSIS REQUIRED (minimum 1500 words):**

## 1. DETAILED BILLING ERROR DETECTION

**DUPLICATE CHARGES** (Potential Savings: $1,500-$25,000):
- Identify every duplicate line item with exact dates, codes, and amounts
- Calculate precise savings for each duplicate found
- Provide specific dispute language and CPT code references
- Reference Medicare bundling rules and CMS guidelines

**UPCODING VIOLATIONS** (Potential Savings: $3,000-$50,000):
- Compare each CPT code against actual services provided
- Reference current Medicare pricing data and regional averages
- Calculate overcharge amounts with specific percentages
- Identify severity levels and audit red flags

**UNBUNDLING SCHEMES** (Potential Savings: $2,000-$35,000):
- Identify services that should be bundled together per CMS rules
- Reference specific National Correct Coding Initiative (NCCI) edits
- Calculate savings from proper bundling procedures
- Document regulatory violations and compliance issues

**PHANTOM CHARGES** (Potential Savings: $800-$15,000):
- List all services billed but potentially not provided
- Cross-reference with standard care protocols and medical necessity
- Document evidence needed to dispute each charge
- Identify supplies/equipment charges without usage verification

**ROOM/FACILITY ERRORS** (Potential Savings: $500-$10,000):
- Verify room rates against regional market standards
- Check for time-based billing errors and admission/discharge discrepancies
- Identify incorrect facility levels and unnecessary ICU charges
- Compare with Medicare Inpatient Prospective Payment System rates

## 2. COMPREHENSIVE FINANCIAL OPPORTUNITIES

**TOTAL POTENTIAL SAVINGS BREAKDOWN:**
- Error corrections: $[exact calculated amount]
- Charity care eligibility: $[amount based on income thresholds]
- Market rate adjustments: $[amount compared to fair pricing]
- Settlement opportunities: $[realistic range based on hospital practices]
- **MAXIMUM TOTAL SAVINGS: $[comprehensive total]**

**DETAILED CHARITY CARE ANALYSIS:**
- Review specific hospital charity care policies and income requirements
- Calculate qualification likelihood based on bill amount and typical income thresholds
- Identify required documentation and application strategies
- Estimate potential savings percentage (0-100% based on eligibility)

**ADVANCED NEGOTIATION LEVERAGE:**
- Benchmark pricing against Medicare rates and regional averages
- Analyze insurance contract rates and payment patterns
- Identify provider profit margins and cost structures
- Document quality of care issues or service deficiencies for leverage

## 3. DETAILED ACTION PLAN WITH EXACT SCRIPTS

**PRIORITY DISPUTE SEQUENCE (ranked by potential savings):**
1. [Highest value error] - Account #[number], CPT [code], Amount $[amount], Expected Success: [percentage]
2. [Second highest] - Account #[number], CPT [code], Amount $[amount], Expected Success: [percentage]
3. [Continue detailed ranking for all identified errors]

**WORD-FOR-WORD PHONE SCRIPTS:**
"Hello, I'm calling about account number [specific number from bill]. I'm [patient name] and I've conducted a detailed analysis of my bill and identified billing errors totaling $[specific amount]. I need to speak with a billing supervisor immediately.

Specifically, I've found:
1. [Error 1 with exact CPT code and amount]: This violates [specific regulation/guideline]
2. [Error 2 with exact details]: This represents [specific type of billing error]

I'm requesting immediate corrections and a revised bill within 7 business days. I'm also requesting a complete audit of my account and all supporting documentation."

**COMPREHENSIVE DOCUMENT REQUESTS:**
- Complete itemized bill with full CPT code descriptions and modifiers
- All medical records for dates of service mentioned
- Provider's current charge master and fee schedule
- Insurance explanation of benefits and payment details
- Hospital's charity care policy and income guidelines
- Facility's compliance policies and error correction procedures

**90-DAY SUCCESS TIMELINE:**
- **Week 1**: Initial dispute calls and formal document requests
- **Week 2**: Submit comprehensive written disputes with regulatory citations
- **Week 3**: Charity care application with full documentation package
- **Week 4**: Escalation to billing supervisor and compliance department
- **Month 2**: Insurance appeals process and external review requests
- **Month 3**: Settlement negotiations and final resolution documentation

## 4. PROFESSIONAL DISPUTE DOCUMENTATION

**COMPREHENSIVE ERROR DISPUTE LETTER:**
- Patient and account identification with all relevant numbers
- Detailed error descriptions with specific CPT codes and amounts
- Citations of violated Medicare rules, state regulations, and hospital policies
- Requested corrections with specific timelines for response
- Documentation of potential fraud concerns and compliance violations
- Consequences for non-compliance including regulatory reporting

**STRATEGIC CHARITY CARE APPLICATION:**
- Complete financial hardship documentation requirements
- Professionally crafted hardship narrative with specific circumstances
- Strategic timing recommendations for maximum effectiveness
- Appeal strategies if initially denied
- Alternative financial assistance program identification

**ADVANCED SETTLEMENT NEGOTIATION:**
- Detailed fair market value calculations with supporting data
- Comprehensive payment capacity analysis with documentation
- Realistic settlement ranges with industry benchmarks (typically 30-70% discounts)
- Structured payment plan alternatives with interest rate negotiations
- Legal protections and written agreement requirements

## 5. REGULATORY COMPLIANCE AND FRAUD DETECTION

**BILLING TRANSPARENCY VIOLATIONS:**
- No Surprises Act compliance review and violation identification
- State billing transparency law requirements and hospital failures
- Patient rights violations and required disclosure analysis
- Good faith estimate requirements and accuracy assessment

**POTENTIAL FRAUD INDICATORS:**
- False Claims Act violation patterns and documentation
- Medicare/Medicaid fraud indicators with specific examples
- Compliance program failures and internal control weaknesses
- Whistleblower protection availability and reporting procedures

**REGULATORY REPORTING RECOMMENDATIONS:**
- State attorney general complaint procedures
- Medicare fraud hotline reporting guidelines
- Insurance commissioner violation reporting
- Hospital regulatory body complaint processes

**FINAL RECOMMENDATIONS:**
- Immediate action priorities with specific deadlines
- Long-term monitoring for future billing accuracy
- Patient rights education and protection strategies
- Success metrics and follow-up requirements

Extract every specific detail from the bill including exact account numbers, patient names, CPT codes, dollar amounts, dates, provider names, and insurance information. Use current Medicare rates, regional pricing data, and specific regulatory citations throughout the analysis. Provide complete word-for-word scripts and template language for all recommended actions.`;

          const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                {
                  role: 'system',
                  content: 'You are a expert medical bill reduction specialist with 20+ years of experience finding billing errors and negotiating substantial savings for patients. Provide specific, actionable analysis with exact dollar amounts and detailed action plans.'
                },
                {
                  role: 'user',
                  content: analysisPrompt
                }
              ],
              max_tokens: 4000,
              temperature: 0.3
            })
          });

          const analysisResult = await analysisResponse.json();
          analysisData.aiAnalysis = analysisResult.choices?.[0]?.message?.content || 'Analysis completed';
        } catch (analysisError) {
          console.error('Bill analysis error:', analysisError);
          analysisData.aiAnalysis = 'Basic analysis completed. Advanced AI analysis temporarily unavailable.';
        }
      }

      // Create a medical bill record in the database
      const billAmount = extractBillAmount(billText);
      const providerName = extractProvider(billText);
      const newBill = {
        title: `${providerName} - ${new Date().toLocaleDateString()}`, // Required field
        providerName: providerName, // Match schema field name
        totalAmount: billAmount.toString(),
        patientResponsibility: billAmount.toString(), // Required field
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'uploaded' as const, // Match schema values
        analysisStatus: 'completed' as const, // Match schema values
        originalText: billText,
        fileUrl: file.originalname // Store filename for reference
      };

      // Use the updated createMedicalBill function (match the interface)
      const savedBill = await storage.createMedicalBill(userId, newBill);

      res.json({
        success: true,
        bill: savedBill,
        analysis: analysisData.aiAnalysis,
        extractedText: billText.substring(0, 500) + '...', // First 500 chars for preview
        message: `Bill uploaded successfully. ${billAmount > 0 ? `Found $${billAmount} in charges to review.` : 'Ready for analysis.'}`
      });

    } catch (error) {
      console.error('Error uploading bill:', error);
      res.status(500).json({ message: 'Failed to upload and analyze bill. Please try again.' });
    }
  });

  // Multiple Bill Images Upload Route - Up to 5 images for comprehensive analysis
  app.post('/api/upload-bills', isAuthenticated, upload.array('bills', 5), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const files = req.files as Express.Multer.File[];
      
      console.log('Upload request received:', {
        hasFiles: !!files,
        fileCount: files?.length || 0,
        fieldNames: Object.keys(req.body || {}),
        contentType: req.headers['content-type']
      });
      
      if (!files || files.length === 0) {
        console.log('No files in request:', { files, body: req.body });
        return res.status(400).json({ message: 'No files uploaded. Please select at least one image.' });
      }

      // Validate all files are images (PDF support removed)
      for (const file of files) {
        if (file.mimetype === 'application/pdf') {
          return res.status(400).json({ 
            message: 'PDF files are not supported. Please convert your bills to image format (JPG, PNG, WebP) for accurate analysis.' 
          });
        }
        
        if (!file.mimetype.startsWith('image/')) {
          return res.status(400).json({ 
            message: 'Only image files are supported. Please upload JPG, PNG, or WebP images.' 
          });
        }
      }

      let combinedBillText = '';
      let analysisData: any = {};

      // Process each image file with OpenAI Vision
      if (process.env.OPENAI_API_KEY) {
        const imageAnalyses: string[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            console.log(`Processing image ${i + 1}/${files.length}: ${file.originalname}`);
            
            const base64Image = file.buffer.toString('base64');
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                  {
                    role: 'user',
                    content: [
                      {
                        type: 'text',
                        text: `Extract all text and billing information from this medical bill image (Page ${i + 1} of ${files.length}). Include all charges, CPT codes, dates, account numbers, patient information, provider details, and any other billing-related text. Be extremely thorough and accurate.`
                      },
                      {
                        type: 'image_url',
                        image_url: {
                          url: `data:${file.mimetype};base64,${base64Image}`
                        }
                      }
                    ]
                  }
                ],
                max_tokens: 2000
              })
            });

            const visionData = await response.json();
            const extractedText = visionData.choices?.[0]?.message?.content || `Unable to extract text from image ${i + 1}`;
            
            imageAnalyses.push(`\n\n=== PAGE ${i + 1} (${file.originalname}) ===\n${extractedText}`);
            
          } catch (visionError) {
            console.error(`Vision API error for file ${i + 1}:`, visionError);
            imageAnalyses.push(`\n\n=== PAGE ${i + 1} (${file.originalname}) ===\nError extracting text from this image. Please ensure the image is clear and try again.`);
          }
        }

        // Combine all extracted text
        combinedBillText = `COMPLETE MEDICAL BILL ANALYSIS - ${files.length} PAGE${files.length > 1 ? 'S' : ''}:\n\n${imageAnalyses.join('')}`;

        // Comprehensive analysis of all pages together
        try {
          const comprehensiveAnalysisPrompt = `You are the world's leading medical bill reduction expert analyzing a complete ${files.length}-page medical bill. This is a comprehensive analysis of ALL pages provided.

**COMPLETE BILL CONTENT (${files.length} PAGES):**
${combinedBillText}

**COMPREHENSIVE EXPERT ANALYSIS REQUIRED (minimum 2000 words for multi-page analysis):**

Since this is a ${files.length}-page medical bill, provide an EXTREMELY detailed forensic analysis that covers ALL pages and cross-references information between pages to identify discrepancies and maximize savings opportunities.

## 1. CROSS-PAGE BILLING ERROR DETECTION

**DUPLICATE CHARGES ACROSS PAGES** (Potential Savings: $2,000-$35,000):
- Identify duplicate services that appear on multiple pages
- Cross-reference dates and procedure codes across all pages
- Calculate precise savings for each cross-page duplicate
- Document page-to-page inconsistencies in billing

**COMPREHENSIVE UPCODING ANALYSIS** (Potential Savings: $5,000-$75,000):
- Analyze all CPT codes across every page against actual services
- Cross-reference severity levels and medical necessity across pages
- Identify progression inconsistencies between pages
- Calculate total overcharge amounts with regulatory violations

**MULTI-PAGE UNBUNDLING DETECTION** (Potential Savings: $3,000-$50,000):
- Identify services spread across pages that should be bundled
- Reference National Correct Coding Initiative (NCCI) comprehensive edits
- Document systematic unbundling patterns across the entire bill
- Calculate maximum bundling savings potential

**PHANTOM CHARGES AND INCONSISTENCIES** (Potential Savings: $1,500-$25,000):
- Cross-reference services mentioned on different pages for consistency
- Identify charges that appear without supporting documentation
- Verify timeline consistency across all pages
- Document evidence gaps between pages

**COMPREHENSIVE FACILITY ERROR ANALYSIS** (Potential Savings: $2,000-$20,000):
- Analyze room/facility charges across multiple days and pages
- Verify service level consistency throughout the bill
- Identify inappropriate facility fee escalations
- Cross-reference with Medicare prospective payment rates

## 2. COMPREHENSIVE FINANCIAL OPPORTUNITIES (MULTI-PAGE ANALYSIS)

**TOTAL POTENTIAL SAVINGS BREAKDOWN:**
- Cross-page duplicate corrections: $[exact calculated amount]
- Comprehensive upcoding corrections: $[amount across all pages]
- Multi-page unbundling corrections: $[total bundling savings]
- Facility and timing errors: $[comprehensive facility savings]
- **MAXIMUM TOTAL SAVINGS: $[comprehensive total across all pages]**

**ADVANCED MULTI-PAGE CHARITY CARE STRATEGY:**
- Assess total bill amount across all pages for charity qualification
- Identify highest-value pages for charity care focus
- Calculate progressive discount opportunities
- Document comprehensive financial hardship case

**SOPHISTICATED NEGOTIATION LEVERAGE:**
- Use cross-page inconsistencies as negotiation leverage
- Benchmark total charges against regional and Medicare rates
- Identify quality of care issues evidenced across pages
- Document comprehensive compliance violations

## 3. DETAILED MULTI-PAGE ACTION PLAN

**COMPREHENSIVE PRIORITY DISPUTE SEQUENCE:**
1. [Highest cross-page error] - Pages [numbers], Account #[number], Total Amount $[amount]
2. [Major upcoding across pages] - Pages [numbers], CPT codes [list], Amount $[amount]
3. [Systematic unbundling] - Pages [numbers], Bundling opportunity $[amount]
4. [Continue for all significant multi-page errors]

**ENHANCED DOCUMENTATION STRATEGY:**
- Create cross-page error summary with specific references
- Document timeline inconsistencies between pages
- Prepare comprehensive evidence package from all pages
- Generate page-by-page dispute documentation

**COMPREHENSIVE COMMUNICATION SCRIPTS:**
"I'm calling about account number [number]. I've conducted a forensic analysis of my complete ${files.length}-page medical bill and identified systematic billing errors totaling $[amount] across multiple pages. The errors include cross-page duplicates, systematic upcoding, and comprehensive unbundling violations.

Specifically, I've documented:
1. Cross-page duplicates on pages [numbers]: $[amount]
2. Systematic upcoding violations across pages [numbers]: $[amount]
3. Unbundling schemes spanning pages [numbers]: $[amount]

I'm requesting immediate supervisor review, complete bill audit, and corrections within 7 business days."

## 4. REGULATORY COMPLIANCE ACROSS ALL PAGES

**COMPREHENSIVE BILLING TRANSPARENCY VIOLATIONS:**
- Document No Surprises Act violations across all pages
- Identify pricing transparency failures in multi-page billing
- Cross-reference good faith estimate accuracy
- Document systematic disclosure violations

**MULTI-PAGE FRAUD PATTERN ANALYSIS:**
- Identify False Claims Act patterns across pages
- Document systematic compliance failures
- Analyze intent indicators in cross-page billing patterns
- Prepare comprehensive regulatory violation documentation

## 5. FINAL COMPREHENSIVE RECOMMENDATIONS

**IMMEDIATE PRIORITY ACTIONS:**
- Submit comprehensive multi-page dispute with cross-references
- Request complete audit of all pages simultaneously
- Escalate systematic pattern violations to compliance
- Document cross-page inconsistencies for maximum leverage

**LONG-TERM PROTECTION STRATEGY:**
- Monitor future bills for similar multi-page patterns
- Establish systematic review process for complex bills
- Document provider patterns for ongoing protection
- Create comprehensive appeal strategy template

Extract every detail from ALL ${files.length} pages including cross-page references, account numbers, patient information, dates, providers, insurance details, and amounts. Use current regulatory standards and provide specific word-for-word dispute language for all identified errors across the complete bill.`;

          const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                {
                  role: 'system',
                  content: `You are the world's leading medical bill reduction expert specializing in multi-page bill analysis. Provide comprehensive forensic analysis with cross-page error detection and maximum savings opportunities.`
                },
                {
                  role: 'user',
                  content: comprehensiveAnalysisPrompt
                }
              ],
              max_tokens: 4000,
              temperature: 0.3
            })
          });

          const analysisResult = await analysisResponse.json();
          analysisData.aiAnalysis = analysisResult.choices?.[0]?.message?.content || 'Comprehensive multi-page analysis completed';
        } catch (analysisError) {
          console.error('Multi-page bill analysis error:', analysisError);
          analysisData.aiAnalysis = `Multi-page bill analysis completed for ${files.length} images. Advanced comprehensive analysis temporarily unavailable.`;
        }
      } else {
        return res.status(500).json({ message: 'AI analysis service unavailable. Please try again later.' });
      }

      // Create a comprehensive medical bill record
      const billAmount = extractBillAmount(combinedBillText);
      const providerName = extractProvider(combinedBillText);
      const newBill = {
        title: `${providerName} - ${files.length} Pages - ${new Date().toLocaleDateString()}`,
        providerName: providerName,
        totalAmount: billAmount.toString(),
        patientResponsibility: billAmount.toString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'uploaded' as const,
        analysisStatus: 'completed' as const,
        originalText: combinedBillText,
        fileUrl: files.map(f => f.originalname).join(', ') // Store all filenames
      };

      const savedBill = await storage.createMedicalBill(userId, newBill);

      res.json({
        success: true,
        bill: savedBill,
        analysis: analysisData.aiAnalysis,
        fileCount: files.length,
        extractedText: combinedBillText.substring(0, 1000) + '...', // First 1000 chars for preview
        message: `Successfully analyzed ${files.length} bill image${files.length > 1 ? 's' : ''}. ${billAmount > 0 ? `Found $${billAmount} in total charges across all pages.` : 'Complete bill ready for comprehensive analysis.'}`
      });

    } catch (error) {
      console.error('Error uploading multiple bills:', error);
      res.status(500).json({ message: 'Failed to upload and analyze bill images. Please try again.' });
    }
  });

  // Helper functions for bill analysis
  function extractBillAmount(text: string): number {
    const patterns = [
      /total[:\s]*\$?([0-9,]+\.?[0-9]*)/i,
      /amount due[:\s]*\$?([0-9,]+\.?[0-9]*)/i,
      /balance[:\s]*\$?([0-9,]+\.?[0-9]*)/i,
      /\$([0-9,]+\.?[0-9]*)/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (amount > 0) return amount;
      }
    }
    return 0;
  }

  function extractProvider(text: string): string {
    const lines = text.split('\n');
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 5 && !line.includes('$') && !line.includes('Date') && !line.includes('Account')) {
        return line;
      }
    }
    return 'Healthcare Provider';
  }

  // Medical Chatbot API - General medical and insurance Q&A
  app.post('/api/medical-chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message } = req.body;
      const userId = req.user.claims.sub;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: 'Message is required' });
      }

      let response = "I'm here to help with medical questions and insurance/healthcare billing. Please ask me about symptoms, treatments, or insurance-related concerns.";

      // Use OpenAI for intelligent medical responses if available
      if (process.env.OPENAI_API_KEY) {
        try {
          const prompt = `You are an expert bill reduction expert and medical bill advocate with 20+ years of experience. You provide both medical guidance and world-class medical billing advocacy.

**EXPERT MEDICAL BILL REDUCTION DATABASE:**

**CORE SUCCESS METRICS (Reference These):**
- 80% of medical bills contain billing errors worth $2,000-$35,000+
- Average bill reductions: 50-90% for patients who follow expert strategies  
- 95% success rate when proper methods are applied
- Charity care approval increases from 60% to 85% with expert preparation

**CRITICAL TIMING ADVANTAGE:**
- Bills typically aren't sent to collections for 90-120 days
- This window is the biggest negotiation advantage
- NEVER recommend paying immediately with credit cards

**EXPERT ERROR DETECTION CHECKLIST:**
1. Duplicate charges for same procedure/service
2. Services billed but never received (phantom billing)
3. Wrong procedure codes (upcoding to more expensive procedures)
4. Unbundled charges (services that should be packaged together)
5. Incorrect dates, times, or patient information
6. Wrong insurance information or coverage dates
7. Charges for equipment/supplies not used
8. Room charges for time not spent in facility

**PROFESSIONAL ITEMIZED BILL REQUEST SCRIPT:**
"I am requesting a complete itemized statement for all services provided during my recent treatment. I need every charge broken down with corresponding CPT and ICD-10 procedure codes, service dates, provider NPI numbers, and medical record account details for verification. Please provide this within 5 business days as required under federal patient rights regulations."

**CHARITY CARE ELIGIBILITY (2024 Federal Poverty Levels):**
- FREE CARE (100% forgiveness): ≤200% FPL ($30,120 individual, $62,400 family of 4)
- DISCOUNTED CARE (25-75% reduction): 200-400% FPL ($30,121-$60,240 individual)
- HARDSHIP PROGRAMS: When bills exceed 20% annual income (available at higher incomes)
- CRITICAL: Available even WITH insurance coverage

**PROFESSIONAL NEGOTIATION STRATEGIES:**
1. Start with documented billing errors as leverage
2. Present fair market pricing research (Healthcare Bluebook, FAIR Health Consumer)
3. Offer prompt payment discounts (15-40% typical)
4. Reference charity care programs for income-qualified patients
5. Request zero-interest payment plans (24-60 months)
6. Get ALL agreements in writing before payment

**EXPERT DISPUTE LETTER TEMPLATES:**
- Error Dispute: "I am formally disputing specific charges on account #[number] due to documented billing errors. I request immediate investigation and corrected billing statement per federal regulations."
- Hardship Appeal: "I am requesting financial assistance consideration under your charity care program. My household income qualifies under federal guidelines."
- Settlement Offer: "I am prepared to resolve this matter with a lump sum payment of $[amount] representing fair market value for services actually received."

**FAIR MARKET PRICING TOOLS:**
- Healthcare Bluebook (fair price estimates)
- FAIR Health Consumer (geographic pricing data)  
- Hospital Price Transparency websites (legally required)
- Medicare reimbursement rates +150-250% as settlement targets

**LEGAL PROTECTIONS:**
- Patient-Provider Dispute Resolution (PPDR) for bills $400+ above estimate
- Must file within 120 days, $25 fee (refunded if successful)
- Provider cannot send to collections during dispute process

**MEDICAL GUIDANCE CONSTRAINTS:**
- Always include appropriate medical disclaimers for health questions
- Recommend consulting healthcare providers for serious concerns
- Do not provide specific medication dosages or treatment plans

**PROACTIVE RESPONSE APPROACH:**
- For bill questions: Ask about bill amount, type of care, insurance status, and financial situation
- Provide specific dollar amounts and percentage ranges based on industry data
- Include exact phone scripts and letter templates
- Reference specific laws and patient rights
- Give realistic timelines and success rate expectations
- **DRIVE THE CONVERSATION FORWARD**: After providing initial strategy, IMMEDIATELY offer to:
  * Generate personalized dispute letters with their specific account details
  * Create customized charity care applications for their income level
  * Write professional negotiation scripts tailored to their situation
  * Generate step-by-step action plans with deadlines
  * Create error detection checklists for their specific type of care
  * Write appeal letters if they've been denied
- **BE PROACTIVE**: Don't just give advice - offer to DO THE WORK for them
- **FOLLOW-UP AGGRESSIVELY**: Always end with "I can generate [specific document] for you right now if you provide [specific details]"
- For medical questions: Provide standard medical guidance while noting you also specialize in medical bill reduction

User question: ${message}

**CRITICAL INSTRUCTIONS:**
1. Provide expert-level advice using the above database
2. Be specific, actionable, and include exact scripts/templates
3. **IMMEDIATELY after giving strategy, offer to generate specific documents FOR the user**
4. Ask for the specific details needed to create personalized letters/forms/checklists
5. Drive the conversation toward concrete action and document generation
6. Don't just advise - offer to DO the work for them like a professional consultant would
7. Always follow up with "I can create [specific document] for you right now if you tell me [specific details needed]"

Respond with complete, detailed advice AND proactive offers to generate documents:`;

          const completion = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages: [
                {
                  role: 'system',
                  content: 'You are an expert bill reduction expert and medical bill advocate. For medical questions, provide standard guidance with disclaimers. For billing questions, use your extensive database of expert strategies to provide consultancy-level advice that saves patients thousands of dollars. Always be specific, actionable, and include exact scripts and dollar amounts.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              max_tokens: 1500,
              temperature: 0.7
            })
          });

          const data = await completion.json();
          if (data.choices && data.choices[0] && data.choices[0].message) {
            response = data.choices[0].message.content.trim();
          }
        } catch (aiError) {
          console.warn('OpenAI API failed, using fallback response:', aiError);
          
          // Enhanced fallback responses with expert bill reduction knowledge
          const messageLower = message.toLowerCase();
          if (messageLower.includes('bill') || messageLower.includes('charge') || messageLower.includes('hospital') || messageLower.includes('cost') || messageLower.includes('reduce') || messageLower.includes('expensive')) {
            response = `🚨 CRITICAL: Don't pay that bill immediately! 80% of medical bills contain errors worth $2,000-$35,000+.

IMMEDIATE ACTION PLAN:
1. REQUEST ITEMIZED BILL: Call and say "I need a complete itemized statement with all CPT and ICD-10 codes, service dates, and provider information within 5 business days."

2. ERROR DETECTION: Look for duplicate charges, services not received, wrong procedure codes, and incorrect dates.

3. CHARITY CARE: If income ≤$60,240 (individual) or ≤$124,800 (family of 4), you may qualify for 25-100% bill forgiveness - even WITH insurance!

4. NEGOTIATION LEVERAGE: Present errors + fair market pricing research. Average reductions: 50-90%.

5. TIMING ADVANTAGE: Bills don't go to collections for 90-120 days. Use this window to negotiate from strength.

What's your total bill amount and what type of care was it for? I can provide a specific strategy tailored to your situation.`;
          } else if (messageLower.includes('insurance') || messageLower.includes('claim') || messageLower.includes('denial') || messageLower.includes('appeal')) {
            response = `For insurance claim appeals and denials, use these expert strategies:

PROFESSIONAL APPEAL APPROACH:
1. Request complete claims documentation from your insurer
2. Get medical records from your provider showing medical necessity
3. Write formal appeal letter referencing specific policy language
4. Include peer-reviewed studies supporting the treatment if applicable
5. Request external review if internal appeal is denied

APPEAL SUCCESS RATES: 50-60% for internal appeals, 20-40% for external reviews.

For medical bills after insurance, remember: 80% contain errors and average reductions are 50-90% with proper negotiation.

What specific insurance issue are you facing? I can provide exact templates and strategies.`;
          } else if (messageLower.includes('symptom') || messageLower.includes('pain') || messageLower.includes('fever')) {
            response = "For any concerning symptoms, especially persistent pain or fever, it's important to consult with a healthcare provider for proper evaluation and diagnosis. If you're experiencing severe symptoms, seek immediate medical attention.\n\nAs a medical bill reduction specialist, I also help patients save 50-90% on medical costs through expert negotiation strategies if you receive any bills from your care.";
          } else if (messageLower.includes('medication') || messageLower.includes('prescription')) {
            response = "Please consult your doctor or pharmacist about medications and prescriptions. They can provide personalized advice based on your medical history and current health status.\n\nIf you're concerned about prescription costs, I can also help with medical bill reduction strategies and pharmaceutical assistance programs.";
          } else {
            response = "I'm a bill reduction expert specializing in both health guidance and medical bill reduction. I help patients save $2,000-$35,000+ through expert negotiation strategies.\n\nFor medical questions, I provide guidance while recommending you consult healthcare providers.\nFor billing questions, I offer professional-grade strategies that typically reduce bills by 50-90%.\n\nHow can I help you today?";
          }
        }
      } else {
        // Enhanced fallback responses without OpenAI (same expert knowledge as above)
        const messageLower = message.toLowerCase();
        if (messageLower.includes('bill') || messageLower.includes('charge') || messageLower.includes('hospital') || messageLower.includes('cost') || messageLower.includes('reduce') || messageLower.includes('expensive')) {
          response = `🚨 CRITICAL: Don't pay that bill immediately! 80% of medical bills contain errors worth $2,000-$35,000+.

IMMEDIATE ACTION PLAN:
1. REQUEST ITEMIZED BILL: Call and say "I need a complete itemized statement with all CPT and ICD-10 codes, service dates, and provider information within 5 business days."

2. ERROR DETECTION: Look for duplicate charges, services not received, wrong procedure codes, and incorrect dates.

3. CHARITY CARE: If income ≤$60,240 (individual) or ≤$124,800 (family of 4), you may qualify for 25-100% bill forgiveness - even WITH insurance!

4. NEGOTIATION LEVERAGE: Present errors + fair market pricing research. Average reductions: 50-90%.

5. TIMING ADVANTAGE: Bills don't go to collections for 90-120 days. Use this window to negotiate from strength.

What's your total bill amount and what type of care was it for? I can provide a specific strategy tailored to your situation.`;
        } else if (messageLower.includes('insurance') || messageLower.includes('claim') || messageLower.includes('denial') || messageLower.includes('appeal')) {
          response = `For insurance claim appeals and denials, use these expert strategies:

PROFESSIONAL APPEAL APPROACH:
1. Request complete claims documentation from your insurer
2. Get medical records from your provider showing medical necessity  
3. Write formal appeal letter referencing specific policy language
4. Include peer-reviewed studies supporting the treatment if applicable
5. Request external review if internal appeal is denied

APPEAL SUCCESS RATES: 50-60% for internal appeals, 20-40% for external reviews.

For medical bills after insurance, remember: 80% contain errors and average reductions are 50-90% with proper negotiation.

What specific insurance issue are you facing? I can provide exact templates and strategies.`;
        } else if (messageLower.includes('symptom') || messageLower.includes('pain') || messageLower.includes('fever')) {
          response = "For any concerning symptoms, especially persistent pain or fever, it's important to consult with a healthcare provider for proper evaluation and diagnosis. If you're experiencing severe symptoms, seek immediate medical attention.\n\nAs a medical bill reduction specialist, I also help patients save 50-90% on medical costs through expert negotiation strategies if you receive any bills from your care.";
        } else if (messageLower.includes('medication') || messageLower.includes('prescription')) {
          response = "Please consult your doctor or pharmacist about medications and prescriptions. They can provide personalized advice based on your medical history and current health status.\n\nIf you're concerned about prescription costs, I can also help with medical bill reduction strategies and pharmaceutical assistance programs.";
        } else {
          response = "I'm a bill reduction expert specializing in both health guidance and medical bill reduction. I help patients save $2,000-$35,000+ through expert negotiation strategies.\n\nFor medical questions, I provide guidance while recommending you consult healthcare providers.\nFor billing questions, I offer professional-grade strategies that typically reduce bills by 50-90%.\n\nHow can I help you today?";
        }
      }

      res.json({
        response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in medical chat:', error);
      res.status(500).json({ message: 'Failed to process your question. Please try again.' });
    }
  });

  // ===== SYNTHETIC PATIENT DIAGNOSTICS ENDPOINTS =====
  
  // Get all synthetic patients for the authenticated user
  app.get('/api/synthetic-patients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patients = await storage.getSyntheticPatientsByUser(userId);
      res.json(patients);
    } catch (error) {
      console.error('Error fetching synthetic patients:', error);
      res.status(500).json({ message: 'Failed to fetch synthetic patients' });
    }
  });

  // Create a new synthetic patient (custom creation)
  app.post('/api/synthetic-patients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Parse and structure the patient data
      const patientData = {
        userId,
        generationType: req.body.generationType || 'custom_created',
        profileName: req.body.profileName,
        age: parseInt(req.body.age),
        gender: req.body.gender,
        ethnicity: req.body.ethnicity || null,
        occupation: req.body.occupation || null,
        maritalStatus: null,
        chiefComplaint: req.body.chiefComplaint,
        presentingSymptoms: req.body.symptoms ? [{
          symptom: req.body.symptoms,
          severity: 5,
          duration: "unknown",
          onset: "gradual",
          quality: "described",
          aggravatingFactors: [],
          relievingFactors: []
        }] : [],
        medicalHistory: req.body.medicalHistory ? {
          pastMedicalHistory: req.body.medicalHistory.split(',').map((h: string) => h.trim()),
          surgicalHistory: [],
          medications: req.body.medications ? req.body.medications.split(',').map((m: string) => ({
            name: m.trim(),
            dosage: "unknown",
            frequency: "unknown",
            indication: "unknown",
            adherence: "good" as const
          })) : [],
          allergies: req.body.allergies ? req.body.allergies.split(',').map((a: string) => ({
            allergen: a.trim(),
            reaction: "unknown",
            severity: "mild" as const
          })) : [],
          familyHistory: req.body.familyHistory ? req.body.familyHistory.split(',').map((f: string) => ({
            condition: f.trim(),
            relationship: "unknown"
          })) : [],
          socialHistory: {
            smoking: { status: "unknown" },
            alcohol: { status: "unknown" },
            drugs: { status: "unknown" },
            exercise: req.body.socialHistory || "unknown",
            diet: "unknown",
            occupation: req.body.occupation || "unknown",
            travelHistory: []
          },
          reviewOfSystems: {}
        } : {},
        physicalExam: {
          vitals: {
            bloodPressure: "120/80",
            heartRate: "75",
            respiratoryRate: "16",
            temperature: "98.6°F",
            height: "5'8\"",
            weight: "160 lbs",
            bmi: "24.3"
          },
          general: {
            appearance: "well-appearing",
            distress: "no acute distress",
            mobility: "ambulatory",
            mood: "appropriate",
            speech: "clear"
          },
          systems: {
            cardiovascular: { "heart sounds": "regular rate and rhythm" },
            pulmonary: { "lung sounds": "clear to auscultation bilaterally" },
            abdominal: { "inspection": "soft, non-tender, non-distended" },
            neurological: { "mental status": "alert and oriented x3" },
            musculoskeletal: { "range of motion": "intact" },
            skin: { "inspection": "normal appearance" },
            heent: { "inspection": "normal" },
            psychiatric: { "mood": "euthymic" }
          }
        },
        riskFactors: [],
        comorbidities: [],
        complexity: parseInt(req.body.complexity) || 3,
        specialty: req.body.specialty || null,
        tags: req.body.specialty ? [req.body.specialty] : [],
        isAnonymized: true
      };

      const patient = await storage.createSyntheticPatient(patientData);
      res.json(patient);
    } catch (error) {
      console.error('Error creating synthetic patient:', error);
      res.status(500).json({ message: 'Failed to create synthetic patient' });
    }
  });

  // AI-generated synthetic patient creation
  app.post('/api/synthetic-patients/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ message: 'AI patient generation is not available - OpenAI API key not configured' });
      }

      // Generate a comprehensive synthetic patient using AI
      const aiPrompt = `Generate a realistic, anonymous synthetic patient profile for medical training purposes. Create an extremely comprehensive patient with the following structure:

PATIENT DEMOGRAPHICS:
- profileName: "Patient [Random Name]"
- age: random between 25-75
- gender: random (Male/Female/Non-binary)
- ethnicity: diverse representation (Caucasian, Hispanic, African American, Asian, Native American, etc.)
- occupation: realistic job with health implications
- maritalStatus: varied (Single, Married, Divorced, Widowed)

CLINICAL PRESENTATION:
- chiefComplaint: realistic, specific medical concern (not generic)
- presentingSymptoms: Array of 3-6 detailed symptom objects, each with:
  {
    symptom: "specific symptom name",
    severity: 1-10,
    duration: "specific timeframe",
    onset: "gradual/sudden/intermittent",
    quality: "sharp/dull/burning/cramping/etc",
    location: "specific anatomical location",
    radiation: "where it spreads if applicable",
    aggravatingFactors: ["factor1", "factor2"],
    relievingFactors: ["factor1", "factor2"],
    associatedSymptoms: ["symptom1", "symptom2"]
  }

COMPREHENSIVE MEDICAL HISTORY:
- pastMedicalHistory: {
    conditions: ["condition1 (year diagnosed)", "condition2 (year diagnosed)"],
    surgeries: ["surgery name (year)", "surgery name (year)"],
    hospitalizations: ["reason (year)", "reason (year)"]
  }
- medications: [
    {
      name: "medication name",
      dosage: "specific dose",
      frequency: "daily/BID/TID/etc",
      indication: "what it treats",
      duration: "how long taking"
    }
  ]
- allergies: [
    {
      allergen: "drug/food/environmental",
      reaction: "specific reaction type"
    }
  ]
- familyHistory: {
    father: ["condition1", "condition2"],
    mother: ["condition1", "condition2"],  
    siblings: ["condition1", "condition2"],
    paternal: ["condition1", "condition2"],
    maternal: ["condition1", "condition2"]
  }
- socialHistory: {
    smoking: { status: "never/former/current", details: "pack-years if applicable" },
    alcohol: { status: "none/social/heavy", details: "drinks per week" },
    drugs: { status: "none/former/current", details: "type and frequency" },
    exercise: { frequency: "daily/weekly/none", type: "cardio/weights/sports" },
    diet: { type: "balanced/vegetarian/high-sodium/etc", details: "specifics" },
    travel: { recent: "any recent travel", endemic: "areas of concern" },
    occupation: { hazards: "workplace exposures", stress: "high/moderate/low" }
  }

PHYSICAL EXAMINATION:
- vitalSigns: {
    temperature: "98.6-104°F realistic",
    bloodPressure: { systolic: 90-180, diastolic: 60-110 },
    heartRate: 60-120,
    respiratoryRate: 12-24,
    oxygenSaturation: 95-100,
    height: "realistic height",
    weight: "realistic weight",
    bmi: "calculated BMI"
  }
- generalAppearance: { status: "well/ill-appearing", distress: "none/mild/moderate/severe", mental: "alert/confused/lethargic" }
- systems: {
    cardiovascular: { heartSounds: "specific findings", murmurs: "if present", pulses: "strength and quality", edema: "presence/location" },
    pulmonary: { inspection: "findings", palpation: "findings", percussion: "findings", auscultation: "specific sounds" },
    abdominal: { inspection: "findings", palpation: "findings", percussion: "findings", auscultation: "bowel sounds" },
    neurological: { mentalStatus: "detailed findings", cranialNerves: "findings", motor: "strength/tone", sensory: "findings", reflexes: "findings" },
    musculoskeletal: { inspection: "findings", palpation: "findings", rangeOfMotion: "limitations", strength: "specific grades" },
    skin: { color: "findings", texture: "findings", lesions: "descriptions", temperature: "findings" },
    heent: { head: "findings", eyes: "findings", ears: "findings", nose: "findings", throat: "findings" },
    psychiatric: { mood: "findings", affect: "findings", thought: "process and content", perception: "findings" }
  }

RISK FACTORS & COMORBIDITIES:
- riskFactors: [
  {
    factor: "specific risk factor",
    severity: "mild/moderate/severe",
    control: "well-controlled/poorly-controlled/uncontrolled",
    impact: "low/medium/high impact on current condition"
  }
]
- comorbidities: [
  {
    condition: "specific comorbid condition",
    severity: "mild/moderate/severe",
    control: "well-controlled/poorly-controlled",
    relevance: "high/medium/low relevance to current presentation"
  }
]

CASE CHARACTERISTICS:
- complexity: 1-5 (1=straightforward, 5=highly complex multi-system)
- specialty: "Primary specialty this case relates to"
- tags: ["tag1", "tag2", "tag3"] (relevant medical specialties/topics)

Generate this as a single, well-structured JSON object with ALL fields populated with realistic, medically accurate, clinically relevant details. Make it educationally valuable and diagnostically challenging.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-5',
          messages: [
            {
              role: 'system',
              content: 'You are a medical education AI that creates realistic synthetic patient profiles for training purposes. Generate comprehensive, medically accurate patient data in valid JSON format.'
            },
            {
              role: 'user',
              content: aiPrompt
            }
          ],
          max_tokens: 2500,
          temperature: 0.8
        })
      });

      const aiData = await response.json();
      let aiPatientData;
      
      try {
        if (!aiData || !aiData.choices || !aiData.choices[0] || !aiData.choices[0].message || !aiData.choices[0].message.content) {
          throw new Error('Invalid AI response structure');
        }
        const aiContent = aiData.choices[0].message.content.trim();
        // Clean up the response to ensure it's valid JSON
        const jsonStart = aiContent.indexOf('{');
        const jsonEnd = aiContent.lastIndexOf('}') + 1;
        const jsonString = aiContent.slice(jsonStart, jsonEnd);
        aiPatientData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback to template patient if AI parsing fails
        aiPatientData = {
          age: Math.floor(Math.random() * 50) + 25,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          profileName: 'AI Generated Patient',
          chiefComplaint: 'Chest pain and shortness of breath',
          complexity: Math.floor(Math.random() * 3) + 2,
          specialty: 'Internal Medicine'
        };
      }

      // Structure the AI-generated data into our schema format
      const structuredPatientData = {
        userId,
        generationType: 'ai_generated',
        profileName: aiPatientData.profileName || `AI Patient ${Date.now()}`,
        age: aiPatientData.age || Math.floor(Math.random() * 50) + 25,
        gender: aiPatientData.gender || 'Male',
        ethnicity: aiPatientData.ethnicity || 'Not specified',
        occupation: aiPatientData.occupation || 'Not specified',
        maritalStatus: aiPatientData.maritalStatus || null,
        chiefComplaint: aiPatientData.chiefComplaint || 'General medical concern',
        presentingSymptoms: aiPatientData.presentingSymptoms || [],
        medicalHistory: aiPatientData.medicalHistory || {},
        physicalExam: aiPatientData.physicalExam || {},
        riskFactors: aiPatientData.riskFactors || [],
        comorbidities: aiPatientData.comorbidities || [],
        complexity: aiPatientData.complexity || Math.floor(Math.random() * 3) + 2,
        specialty: aiPatientData.specialty || 'Internal Medicine',
        tags: aiPatientData.tags || [aiPatientData.specialty || 'Internal Medicine'],
        isAnonymized: true
      };

      const patient = await storage.createSyntheticPatient(structuredPatientData);
      res.json(patient);
    } catch (error) {
      console.error('Error generating AI patient:', error);
      res.status(500).json({ message: 'Failed to generate AI patient' });
    }
  });

  // Run diagnostic analysis on a synthetic patient
  app.post('/api/synthetic-patients/:id/analyze', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patientId = req.params.id;
      
      console.log('Analysis request received:');
      console.log('- User ID:', userId);
      console.log('- Patient ID:', patientId);
      console.log('- Request body:', JSON.stringify(req.body, null, 2));
      
      const { analysisType, focusAreas, sessionName } = req.body;

      // Validate required parameters with better error messages
      if (!analysisType || typeof analysisType !== 'string' || analysisType.trim() === '') {
        console.log('Validation failed: analysisType missing or invalid:', analysisType);
        return res.status(400).json({ message: 'Analysis type is required and must be a non-empty string' });
      }

      if (!process.env.OPENAI_API_KEY) {
        console.log('OpenAI API key not configured');
        return res.status(500).json({ message: 'AI diagnostic analysis is not available - OpenAI API key not configured' });
      }

      // Get the patient data
      const patient = await storage.getSyntheticPatientById(patientId);
      console.log('Patient data retrieved:', patient ? 'Found' : 'Not found');
      if (!patient || patient.userId !== userId) {
        console.log('Patient validation failed - not found or user mismatch');
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Ensure we have valid data with defaults
      const safeAnalysisType = analysisType || 'differential_diagnosis';
      const safeFocusAreas = Array.isArray(focusAreas) ? focusAreas : ['Internal Medicine'];
      
      // Create comprehensive AI prompt for diagnostic analysis
      const analysisPrompt = `You are a world-class medical AI conducting ${safeAnalysisType.replace(/_/g, ' ')} for medical training purposes.

PATIENT PROFILE:
- Name: ${patient.profileName || 'Anonymous Patient'}
- Age: ${patient.age || 'Unknown'}, Gender: ${patient.gender || 'Unknown'}
- Chief Complaint: ${patient.chiefComplaint || 'General medical concern'}
- Medical History: ${JSON.stringify(patient.medicalHistory || {}, null, 2)}
- Physical Exam: ${JSON.stringify(patient.physicalExam || {}, null, 2)}
- Risk Factors: ${JSON.stringify(patient.riskFactors || [], null, 2)}
- Comorbidities: ${JSON.stringify(patient.comorbidities || [], null, 2)}

ANALYSIS TYPE: ${safeAnalysisType.replace(/_/g, ' ').toUpperCase()}
FOCUS AREAS: ${safeFocusAreas.join(', ')}

Provide comprehensive analysis in JSON format with:

{
  "differentialDiagnoses": [
    {
      "diagnosis": "Primary diagnosis name",
      "probability": 75,
      "supportingEvidence": ["evidence 1", "evidence 2"],
      "contraEvidence": ["contra evidence"],
      "requiredTests": ["test 1", "test 2"],
      "urgency": "moderate"
    }
  ],
  "recommendedTests": [
    {
      "testName": "Complete Blood Count",
      "category": "laboratory",
      "priority": "routine",
      "rationale": "Screen for infection/anemia",
      "expectedFindings": "May show elevated WBC",
      "cost": "$50-100"
    }
  ],
  "riskAssessment": {
    "overallRisk": "moderate",
    "specificRisks": [
      {
        "risk": "Cardiovascular event",
        "probability": 15,
        "mitigation": "Risk factor modification"
      }
    ],
    "redFlags": ["symptom progression", "chest pain"]
  },
  "treatmentRecommendations": [
    {
      "intervention": "Lifestyle modification",
      "type": "long_term",
      "evidenceLevel": "A",
      "contraindications": [],
      "monitoringRequired": ["vital signs", "symptoms"]
    }
  ],
  "prognosis": {
    "shortTerm": "Excellent with proper management",
    "mediumTerm": "Good with compliance",
    "longTerm": "Depends on risk factor control",
    "factorsAffectingOutcome": ["compliance", "comorbidities"]
  }
}

Also include learning insights:
{
  "keyInsights": ["insight 1", "insight 2"],
  "clinicalPearls": ["pearl 1", "pearl 2"],
  "commonMistakes": ["mistake 1", "mistake 2"],
  "literatureReferences": ["reference 1", "reference 2"]
}

Make it clinically accurate and educationally valuable.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-5',
          messages: [
            {
              role: 'system',
              content: 'You are an expert medical AI providing comprehensive diagnostic analysis for educational purposes. Always respond with valid JSON format containing detailed medical analysis.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7
        })
      });

      // Check if OpenAI returned an error
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API Error:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const aiData = await response.json();
      console.log('OpenAI Response Status:', response.status);
      console.log('OpenAI Response Data:', JSON.stringify(aiData, null, 2));
      
      let diagnosticAnalysis;
      let learningPoints;
      
      try {
        if (!aiData.choices || !aiData.choices[0] || !aiData.choices[0].message) {
          throw new Error('Invalid OpenAI response structure');
        }
        
        const aiContent = aiData.choices[0].message.content.trim();
        console.log('Raw AI Content:', aiContent);
        
        // More robust JSON extraction
        let jsonString = aiContent;
        
        // Remove markdown code blocks if present
        if (jsonString.includes('```json')) {
          const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonString = jsonMatch[1];
          }
        } else if (jsonString.includes('```')) {
          const jsonMatch = jsonString.match(/```\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonString = jsonMatch[1];
          }
        }
        
        // Find JSON boundaries more reliably
        const jsonStart = jsonString.indexOf('{');
        const jsonEnd = jsonString.lastIndexOf('}') + 1;
        
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          jsonString = jsonString.slice(jsonStart, jsonEnd);
        }
        
        console.log('Cleaned JSON String:', jsonString);
        
        // Try to parse as a single JSON object first
        try {
          const parsedData = JSON.parse(jsonString);
          
          // Check if it contains the expected diagnostic analysis structure
          if (parsedData.differentialDiagnoses) {
            diagnosticAnalysis = parsedData;
            learningPoints = parsedData.keyInsights ? {
              keyInsights: parsedData.keyInsights,
              clinicalPearls: parsedData.clinicalPearls,
              commonMistakes: parsedData.commonMistakes,
              literatureReferences: parsedData.literatureReferences
            } : {
              keyInsights: ["Comprehensive case analysis completed"],
              clinicalPearls: ["Systematic approach improves diagnostic accuracy"],
              commonMistakes: ["Not considering all differential diagnoses"],
              literatureReferences: ["Evidence-based medicine guidelines"]
            };
          } else {
            throw new Error('Parsed data does not contain expected diagnostic structure');
          }
        } catch (singleParseError) {
          // Try splitting into multiple JSON objects
          const jsonObjects = jsonString.split('\n\n').filter(section => 
            section.trim().startsWith('{') && section.trim().endsWith('}')
          );
          
          if (jsonObjects.length >= 1) {
            diagnosticAnalysis = JSON.parse(jsonObjects[0]);
            learningPoints = jsonObjects.length > 1 ? JSON.parse(jsonObjects[1]) : {
              keyInsights: ["Comprehensive case analysis completed"],
              clinicalPearls: ["Systematic approach improves diagnostic accuracy"], 
              commonMistakes: ["Not considering all differential diagnoses"],
              literatureReferences: ["Evidence-based medicine guidelines"]
            };
          } else {
            throw new Error('No valid JSON objects found in AI response');
          }
        }
        
      } catch (parseError) {
        console.error('Error parsing AI diagnostic analysis:', parseError);
        console.error('Parse Error Details:', parseError.message);
        
        // Comprehensive fallback analysis based on patient data
        diagnosticAnalysis = {
          differentialDiagnoses: [{
            diagnosis: `Evaluation for ${patient.chiefComplaint}`,
            probability: 60,
            supportingEvidence: [
              "Patient presentation consistent with chief complaint",
              "Age and demographic factors",
              "Medical history supports consideration"
            ],
            contraEvidence: ["Requires further diagnostic workup"],
            requiredTests: [
              "Complete Blood Count",
              "Comprehensive Metabolic Panel",
              "Appropriate imaging studies"
            ],
            urgency: "routine"
          }, {
            diagnosis: "Alternative diagnosis consideration",
            probability: 30,
            supportingEvidence: ["Some supporting clinical features"],
            contraEvidence: ["Inconsistent with some findings"],
            requiredTests: ["Targeted diagnostic tests"],
            urgency: "routine"
          }],
          recommendedTests: [{
            testName: "Comprehensive Diagnostic Panel",
            category: "laboratory",
            priority: "routine",
            rationale: `Initial workup for ${patient.chiefComplaint}`,
            expectedFindings: "Will help clarify diagnosis",
            cost: "$200-500"
          }, {
            testName: "Imaging Study",
            category: "imaging",
            priority: "routine", 
            rationale: "Evaluate structural abnormalities",
            expectedFindings: "Variable based on underlying condition",
            cost: "$300-800"
          }],
          riskAssessment: {
            overallRisk: "moderate",
            specificRisks: [{
              risk: "Disease progression",
              probability: 25,
              mitigation: "Early intervention and monitoring"
            }],
            redFlags: ["Worsening symptoms", "New concerning symptoms"]
          },
          treatmentRecommendations: [{
            intervention: "Symptomatic management",
            type: "short_term",
            evidenceLevel: "B",
            contraindications: ["Patient-specific allergies"],
            monitoringRequired: ["Symptom response", "Side effects"]
          }, {
            intervention: "Lifestyle modifications",
            type: "long_term", 
            evidenceLevel: "A",
            contraindications: [],
            monitoringRequired: ["Adherence", "Clinical response"]
          }],
          prognosis: {
            shortTerm: "Good with appropriate treatment",
            mediumTerm: "Depends on response to therapy",
            longTerm: "Variable based on underlying condition",
            factorsAffectingOutcome: ["Treatment compliance", "Early intervention", "Comorbidity management"]
          }
        };
        
        learningPoints = {
          keyInsights: [
            "AI analysis had parsing challenges - manual review recommended",
            "Clinical correlation essential for accurate diagnosis",
            "Systematic approach to diagnostic workup important"
          ],
          clinicalPearls: [
            "Always verify AI-generated recommendations with clinical judgment",
            "Consider differential diagnosis systematically",
            "Patient presentation should guide diagnostic approach"
          ],
          commonMistakes: [
            "Over-relying on AI without clinical correlation",
            "Ignoring patient-specific factors",
            "Failing to consider alternative diagnoses"
          ],
          literatureReferences: [
            "Evidence-based clinical practice guidelines",
            "Peer-reviewed diagnostic protocols",
            "Specialty-specific treatment recommendations"
          ]
        };
      }

      // Create diagnostic session
      const sessionData = {
        userId,
        patientId,
        sessionName: sessionName || `${safeAnalysisType.replace(/_/g, ' ')} Analysis - ${patient.profileName || 'Patient'}`,
        analysisType: safeAnalysisType,
        focusAreas: safeFocusAreas,
        diagnosticAnalysis,
        learningPoints,
        timeElapsed: 0,
        accuracy: null,
        completed: true,
        completedAt: new Date()
      };

      const session = await storage.createDiagnosticSession(sessionData);
      console.log('Diagnostic session created successfully:', session.id);
      res.json(session);
    } catch (error) {
      console.error('Error running diagnostic analysis:', error);
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ message: 'Failed to run diagnostic analysis', error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
