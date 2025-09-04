import type { InsertMedicalImage } from "@shared/schema";

export const sampleMedicalImages: InsertMedicalImage[] = [
  {
    imageType: "xray",
    bodyRegion: "chest",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=center",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop&crop=center",
    title: "Chest X-Ray - Pneumonia Case",
    description: "A 65-year-old patient presenting with fever, cough, and shortness of breath. Identify consolidation patterns and assess for pneumonia.",
    modality: "X-ray",
    difficulty: 2,
    keyFindings: [
      {
        finding: "Right lower lobe consolidation",
        x: 65,
        y: 55,
        width: 15,
        height: 20,
        explanation: "Dense consolidation in the right lower lobe consistent with bacterial pneumonia. Note the air bronchograms within the opacity.",
        severity: "moderate"
      },
      {
        finding: "Blunted costophrenic angle",
        x: 75,
        y: 80,
        width: 10,
        height: 8,
        explanation: "Blunting of the right costophrenic angle suggests pleural effusion, commonly associated with pneumonia.",
        severity: "mild"
      }
    ],
    distractors: [
      {
        finding: "Normal left lung",
        x: 25,
        y: 45,
        width: 20,
        height: 30,
        explanation: "The left lung appears clear with normal vascular markings - this is a normal finding that should not be marked as pathological."
      }
    ],
    correctDiagnosis: "Right lower lobe pneumonia with small pleural effusion",
    learningObjectives: [
      "Identify pneumonia on chest X-ray",
      "Recognize air bronchograms",
      "Detect pleural effusion signs",
      "Differentiate consolidation from other opacities"
    ],
    tags: ["pneumonia", "consolidation", "pleural-effusion", "respiratory"]
  },
  {
    imageType: "ct",
    bodyRegion: "head",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&crop=center",
    title: "Head CT - Acute Stroke",
    description: "Emergency CT scan of a 72-year-old patient with sudden onset left-sided weakness and speech difficulties. Time is critical - identify the stroke pattern.",
    modality: "CT",
    difficulty: 3,
    keyFindings: [
      {
        finding: "Right MCA territory hypodensity",
        x: 45,
        y: 40,
        width: 25,
        height: 20,
        explanation: "Early signs of acute ischemic stroke in the right middle cerebral artery territory. The hypodensity indicates tissue edema and infarction.",
        severity: "severe"
      },
      {
        finding: "Loss of gray-white differentiation",
        x: 50,
        y: 45,
        width: 15,
        height: 15,
        explanation: "Subtle loss of gray-white matter differentiation in the right frontal cortex, an early sign of cerebral infarction.",
        severity: "moderate"
      }
    ],
    distractors: [
      {
        finding: "Normal left hemisphere",
        x: 75,
        y: 45,
        width: 20,
        height: 25,
        explanation: "The left hemisphere shows normal gray-white differentiation and no signs of acute pathology."
      }
    ],
    correctDiagnosis: "Acute right middle cerebral artery infarction",
    learningObjectives: [
      "Recognize early CT signs of stroke",
      "Identify MCA territory anatomy",
      "Assess gray-white differentiation",
      "Understand time-critical diagnosis"
    ],
    tags: ["stroke", "mca-infarction", "neurology", "emergency"]
  },
  {
    imageType: "mri",
    bodyRegion: "knee",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=top",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop&crop=top",
    title: "Knee MRI - ACL Tear",
    description: "MRI of a 28-year-old athlete after a sports injury with knee instability. Evaluate the anterior cruciate ligament and associated structures.",
    modality: "MRI",
    difficulty: 2,
    keyFindings: [
      {
        finding: "Complete ACL tear",
        x: 48,
        y: 35,
        width: 8,
        height: 15,
        explanation: "Complete rupture of the anterior cruciate ligament with fiber discontinuity. The torn ligament appears as increased signal intensity.",
        severity: "severe"
      },
      {
        finding: "Bone marrow edema",
        x: 55,
        y: 60,
        width: 12,
        height: 10,
        explanation: "Bone marrow edema in the lateral femoral condyle and posterior tibia, consistent with pivot-shift injury mechanism.",
        severity: "moderate"
      }
    ],
    distractors: [
      {
        finding: "Intact PCL",
        x: 45,
        y: 50,
        width: 6,
        height: 12,
        explanation: "The posterior cruciate ligament remains intact with normal low signal intensity on this T2-weighted sequence."
      }
    ],
    correctDiagnosis: "Complete anterior cruciate ligament tear with associated bone contusions",
    learningObjectives: [
      "Identify ACL anatomy on MRI",
      "Recognize ACL tear patterns",
      "Assess for bone marrow edema",
      "Understand sports injury mechanisms"
    ],
    tags: ["acl-tear", "sports-injury", "orthopedics", "mri"]
  },
  {
    imageType: "xray",
    bodyRegion: "abdomen",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=bottom",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&crop=bottom",
    title: "Abdominal X-Ray - Bowel Obstruction",
    description: "Emergency abdominal X-ray of a patient with severe abdominal pain, vomiting, and inability to pass gas. Look for signs of bowel obstruction.",
    modality: "X-ray",
    difficulty: 2,
    keyFindings: [
      {
        finding: "Dilated small bowel loops",
        x: 40,
        y: 35,
        width: 20,
        height: 25,
        explanation: "Multiple dilated small bowel loops with air-fluid levels, indicating small bowel obstruction. The bowel loops are >3cm in diameter.",
        severity: "severe"
      },
      {
        finding: "Absence of colonic gas",
        x: 60,
        y: 60,
        width: 25,
        height: 20,
        explanation: "Marked paucity of gas in the colon, supporting the diagnosis of complete small bowel obstruction.",
        severity: "moderate"
      }
    ],
    distractors: [
      {
        finding: "Normal gastric bubble",
        x: 25,
        y: 25,
        width: 8,
        height: 6,
        explanation: "Normal gastric air bubble in the left upper quadrant - this is a normal finding."
      }
    ],
    correctDiagnosis: "Small bowel obstruction",
    learningObjectives: [
      "Identify dilated bowel loops",
      "Recognize air-fluid levels",
      "Differentiate small vs large bowel",
      "Assess for obstruction patterns"
    ],
    tags: ["bowel-obstruction", "emergency", "gastroenterology", "surgery"]
  },
  {
    imageType: "ct",
    bodyRegion: "chest",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=left",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop&crop=left",
    title: "Chest CT - Pulmonary Embolism",
    description: "CT pulmonary angiogram of a patient with acute onset shortness of breath and chest pain. High clinical suspicion for pulmonary embolism.",
    modality: "CT",
    difficulty: 3,
    keyFindings: [
      {
        finding: "Filling defect in right PA",
        x: 55,
        y: 30,
        width: 8,
        height: 6,
        explanation: "Intraluminal filling defect in the right main pulmonary artery consistent with acute pulmonary embolism. The clot appears as a hypodense area within the contrast-enhanced vessel.",
        severity: "severe"
      },
      {
        finding: "Segmental PE in left lower lobe",
        x: 35,
        y: 65,
        width: 6,
        height: 8,
        explanation: "Additional smaller emboli in the left lower lobe segmental branches, indicating bilateral pulmonary embolism.",
        severity: "moderate"
      }
    ],
    distractors: [
      {
        finding: "Normal aorta",
        x: 50,
        y: 45,
        width: 10,
        height: 15,
        explanation: "The aorta shows normal enhancement and caliber without evidence of dissection or other pathology."
      }
    ],
    correctDiagnosis: "Bilateral pulmonary embolism",
    learningObjectives: [
      "Identify PE on CTPA",
      "Recognize filling defects",
      "Assess bilateral involvement",
      "Understand PE imaging protocols"
    ],
    tags: ["pulmonary-embolism", "emergency", "cardiovascular", "ctpa"]
  },
  {
    imageType: "ultrasound",
    bodyRegion: "abdomen",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&crop=center",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop&crop=center",
    title: "Abdominal Ultrasound - Gallstones",
    description: "Right upper quadrant ultrasound of a patient with postprandial abdominal pain and nausea. Evaluate the gallbladder for pathology.",
    modality: "Ultrasound",
    difficulty: 1,
    keyFindings: [
      {
        finding: "Gallbladder stones",
        x: 45,
        y: 40,
        width: 12,
        height: 8,
        explanation: "Multiple echogenic foci within the gallbladder lumen with posterior acoustic shadowing, consistent with cholelithiasis.",
        severity: "moderate"
      },
      {
        finding: "Gallbladder wall thickening",
        x: 42,
        y: 35,
        width: 15,
        height: 3,
        explanation: "Mild gallbladder wall thickening (>3mm) suggesting acute cholecystitis in the appropriate clinical setting.",
        severity: "mild"
      }
    ],
    distractors: [
      {
        finding: "Normal liver echogenicity",
        x: 60,
        y: 30,
        width: 20,
        height: 25,
        explanation: "The liver shows normal homogeneous echogenicity without focal lesions or signs of cirrhosis."
      }
    ],
    correctDiagnosis: "Cholelithiasis with possible acute cholecystitis",
    learningObjectives: [
      "Identify gallstones on ultrasound",
      "Recognize acoustic shadowing",
      "Measure gallbladder wall thickness",
      "Assess for cholecystitis signs"
    ],
    tags: ["gallstones", "cholecystitis", "ultrasound", "gastroenterology"]
  }
];

export class MedicalImageService {
  static async initializeImages() {
    try {
      const { storage } = await import("../storage");
      
      // Check if images already exist
      const existingImages = await storage.getMedicalImages();
      if (existingImages.length > 0) {
        console.log(`Found ${existingImages.length} existing medical images`);
        return;
      }

      // Create sample images
      console.log('Initializing sample medical images...');
      for (const imageData of sampleMedicalImages) {
        await storage.createMedicalImage(imageData);
      }
      
      console.log(`Initialized ${sampleMedicalImages.length} sample medical images`);
    } catch (error) {
      console.error('Error initializing medical images:', error);
    }
  }
}