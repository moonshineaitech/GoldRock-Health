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
import { setupAuth, isAuthenticated } from "./replitAuth";
import { AchievementService } from "./services/achievementService";
import Stripe from "stripe";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
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
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceId || (planType === 'annual' ? 'price_annual' : 'price_monthly'), // You'll need to set these in Stripe
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

  // Medical Chatbot API - General medical and insurance Q&A
  // Medical Bill Analysis Chat Endpoint
  app.post('/api/bill-analysis-chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      const userId = req.user.claims.sub;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: 'Message is required' });
      }

      let response = "I'm here to help you analyze your medical bills and find ways to reduce them. What specific billing issue can I help you with?";

      // Use OpenAI for intelligent bill analysis responses
      if (process.env.OPENAI_API_KEY) {
        try {
          response = await openAIService.generateBillAnalysisResponse(
            message,
            conversationHistory
          );
        } catch (aiError) {
          console.warn('OpenAI bill analysis failed, using fallback response:', aiError);
          
          // Fallback for bill-related queries
          const messageLower = message.toLowerCase();
          if (messageLower.includes('itemized') || messageLower.includes('bill') || messageLower.includes('hospital')) {
            response = "To get an itemized bill, call your hospital's billing department and request a complete breakdown of all charges with CPT and ICD codes. This is your first step to identifying overcharges.";
          } else if (messageLower.includes('negotiate') || messageLower.includes('reduce') || messageLower.includes('payment')) {
            response = "Don't pay immediately - you have 90-120 days before collection. Use this time to negotiate. Request charity care applications and prompt payment discounts. Many patients achieve 40-70% reductions.";
          } else if (messageLower.includes('error') || messageLower.includes('overcharge') || messageLower.includes('duplicate')) {
            response = "Common billing errors include duplicate charges, upcoding, unbundled services, and phantom charges. Request an itemized bill and compare against your medical records to identify discrepancies.";
          }
        }
      } else {
        // Basic fallback responses without OpenAI
        const messageLower = message.toLowerCase();
        if (messageLower.includes('itemized') || messageLower.includes('bill') || messageLower.includes('hospital')) {
          response = "To get an itemized bill, call your hospital's billing department and request a complete breakdown of all charges with CPT and ICD codes. This is your first step to identifying overcharges.";
        } else if (messageLower.includes('negotiate') || messageLower.includes('reduce') || messageLower.includes('payment')) {
          response = "Don't pay immediately - you have 90-120 days before collection. Use this time to negotiate. Request charity care applications and prompt payment discounts.";
        }
      }

      res.json({
        response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in bill analysis chat:', error);
      res.status(500).json({ message: 'Failed to process your question. Please try again.' });
    }
  });

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
          const prompt = `You are a helpful medical assistant focused on providing information about medical conditions, symptoms, treatments, and insurance/healthcare billing questions. 

IMPORTANT CONSTRAINTS:
- Only answer questions related to medical/health topics and insurance/healthcare billing
- Always include appropriate medical disclaimers
- Recommend consulting healthcare providers for serious concerns
- Do not provide specific medication dosages or treatment plans
- Keep responses concise but helpful
- If asked about non-medical topics, politely redirect to medical/insurance topics

User question: ${message}

Provide a helpful, accurate, and concise response:`;

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
                  content: 'You are a medical assistant that helps with health questions and insurance/billing inquiries. Always provide disclaimers and recommend consulting healthcare providers for serious concerns.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              max_tokens: 300,
              temperature: 0.7
            })
          });

          const data = await completion.json();
          if (data.choices && data.choices[0] && data.choices[0].message) {
            response = data.choices[0].message.content.trim();
          }
        } catch (aiError) {
          console.warn('OpenAI API failed, using fallback response:', aiError);
          
          // Fallback responses for common medical/insurance questions
          const messageLower = message.toLowerCase();
          if (messageLower.includes('symptom') || messageLower.includes('pain') || messageLower.includes('fever')) {
            response = "For any concerning symptoms, especially persistent pain or fever, it's important to consult with a healthcare provider for proper evaluation and diagnosis. If you're experiencing severe symptoms, seek immediate medical attention.";
          } else if (messageLower.includes('insurance') || messageLower.includes('claim') || messageLower.includes('bill')) {
            response = "For insurance claims, contact your insurance provider directly or check your policy documents. Most insurers have customer service lines and online portals to help with billing questions and claim appeals.";
          } else if (messageLower.includes('medication') || messageLower.includes('prescription')) {
            response = "Please consult your doctor or pharmacist about medications and prescriptions. They can provide personalized advice based on your medical history and current health status.";
          }
        }
      } else {
        // Basic fallback responses without OpenAI
        const messageLower = message.toLowerCase();
        if (messageLower.includes('symptom') || messageLower.includes('pain') || messageLower.includes('fever')) {
          response = "For any concerning symptoms, especially persistent pain or fever, it's important to consult with a healthcare provider for proper evaluation and diagnosis. If you're experiencing severe symptoms, seek immediate medical attention.";
        } else if (messageLower.includes('insurance') || messageLower.includes('claim') || messageLower.includes('bill')) {
          response = "For insurance claims, contact your insurance provider directly or check your policy documents. Most insurers have customer service lines and online portals to help with billing questions and claim appeals.";
        } else if (messageLower.includes('medication') || messageLower.includes('prescription')) {
          response = "Please consult your doctor or pharmacist about medications and prescriptions. They can provide personalized advice based on your medical history and current health status.";
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

  const httpServer = createServer(app);
  return httpServer;
}
