import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { elevenLabsService } from "./services/elevenlabs";
import { medicalCasesService } from "./services/medicalCases";
import { openAIService } from "./services/openai";
import { diagnosticEngine } from "./services/diagnosticEngine";
import { voiceCacheService } from "./services/voiceCache";
import { insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize medical cases on startup
  await medicalCasesService.initializeCases();

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

  app.post('/api/progress', async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(progressData);
      res.status(201).json(progress);
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

  app.get('/api/user-achievements', async (req, res) => {
    try {
      const userAchievements = await storage.getUserAchievements();
      res.json(userAchievements);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      res.status(500).json({ message: 'Failed to fetch user achievements' });
    }
  });

  app.post('/api/achievements/:id/unlock', async (req, res) => {
    try {
      const { id } = req.params;
      const achievement = await storage.unlockAchievement(id);
      res.status(201).json(achievement);
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      res.status(500).json({ message: 'Failed to unlock achievement' });
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

  const httpServer = createServer(app);
  return httpServer;
}
