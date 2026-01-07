export const medicalConditionsData = [
  {
    slug: "appendectomy",
    name: "Appendectomy",
    category: "Surgical",
    icdCodes: ["K35.80", "K35.30", "K37"],
    cptCodes: ["44950", "44960", "44970"],
    description: "Appendectomy is the surgical removal of the appendix, typically performed as an emergency procedure when the appendix becomes inflamed (appendicitis). This is one of the most common emergency surgeries in the United States, with over 300,000 performed annually.",
    symptoms: ["Sudden abdominal pain near navel", "Pain shifting to lower right abdomen", "Nausea and vomiting", "Loss of appetite", "Low-grade fever", "Abdominal swelling"],
    averageCost: { low: 8000, median: 15000, high: 35000, uninsured: 45000 },
    commonBillingErrors: [
      "Unbundling surgical components that should be billed together",
      "Charging for laparoscopic when open surgery was performed",
      "Duplicate charges for anesthesia services",
      "Incorrect facility fee categorization"
    ],
    negotiationTips: [
      "Request itemized bill and compare CPT codes with what was actually performed",
      "Ask for the hospital's charity care policy if uninsured",
      "Compare prices with nearby facilities using CMS price transparency data",
      "Negotiate a cash pay discount - typically 20-40% off"
    ],
    savingsPotential: "$2,000-$15,000",
    relatedConditions: ["abdominal-pain", "emergency-surgery", "laparoscopic-surgery"],
    seoKeywords: ["appendectomy cost", "appendix surgery price", "how much does appendectomy cost", "appendicitis treatment cost"],
    seoDescription: "Learn about appendectomy costs, common billing errors, and how to reduce your appendix surgery bill. Average costs range from $8,000 to $45,000."
  },
  {
    slug: "colonoscopy",
    name: "Colonoscopy",
    category: "Diagnostic",
    icdCodes: ["Z12.11", "K63.5", "K57.30"],
    cptCodes: ["45378", "45380", "45385"],
    description: "A colonoscopy is a diagnostic procedure that examines the large intestine using a flexible camera. It's the gold standard for colorectal cancer screening and is recommended for adults starting at age 45.",
    symptoms: ["Screening procedure - no symptoms required", "Blood in stool", "Change in bowel habits", "Abdominal pain", "Unexplained weight loss"],
    averageCost: { low: 1500, median: 3500, high: 8000, uninsured: 12000 },
    commonBillingErrors: [
      "Charging for screening when it should be preventive (no cost-share under ACA)",
      "Facility fee not clearly disclosed",
      "Pathology charges for polyp removal billed separately when should be bundled",
      "Anesthesia time over-reported"
    ],
    negotiationTips: [
      "Preventive colonoscopies must be covered 100% under ACA - verify coding",
      "If polyps found, the procedure may be recoded from screening to diagnostic - dispute this",
      "Ask for facility fee details upfront",
      "Consider outpatient surgery centers which are 40-60% cheaper than hospitals"
    ],
    savingsPotential: "$500-$5,000",
    relatedConditions: ["colorectal-cancer-screening", "polyp-removal", "gi-procedures"],
    seoKeywords: ["colonoscopy cost", "how much does colonoscopy cost", "colonoscopy price without insurance", "free colonoscopy screening"],
    seoDescription: "Understand colonoscopy costs and billing. Learn why your screening colonoscopy should be free under ACA and how to dispute incorrect charges."
  },
  {
    slug: "mri-scan",
    name: "MRI Scan",
    category: "Imaging",
    icdCodes: ["R51", "M54.5", "S06.0X0A"],
    cptCodes: ["70553", "72148", "73721"],
    description: "Magnetic Resonance Imaging (MRI) uses powerful magnets and radio waves to create detailed images of organs and tissues. MRIs are commonly used to diagnose conditions affecting the brain, spine, joints, and soft tissues.",
    symptoms: ["Diagnostic procedure - varies by indication", "Headaches", "Back pain", "Joint pain", "Neurological symptoms"],
    averageCost: { low: 400, median: 1200, high: 3500, uninsured: 5000 },
    commonBillingErrors: [
      "Charging hospital rates for freestanding imaging center",
      "Multiple MRI studies billed at full price when discount should apply",
      "Contrast agent fees not disclosed upfront",
      "Technical and professional components double-billed"
    ],
    negotiationTips: [
      "Freestanding imaging centers charge 50-70% less than hospital-based",
      "Cash pay prices are often significantly lower - ask before using insurance",
      "Get a prior authorization to avoid surprise denials",
      "Compare prices using MDsave or Healthcare Bluebook"
    ],
    savingsPotential: "$300-$3,000",
    relatedConditions: ["ct-scan", "x-ray", "diagnostic-imaging"],
    seoKeywords: ["MRI cost", "how much does MRI cost", "MRI price without insurance", "cheap MRI near me"],
    seoDescription: "Compare MRI costs and learn how to save up to 70% by choosing the right facility. Average MRI prices range from $400 to $5,000."
  },
  {
    slug: "knee-replacement",
    name: "Knee Replacement Surgery",
    category: "Orthopedic",
    icdCodes: ["M17.11", "M17.12", "Z96.651"],
    cptCodes: ["27447", "27446", "27486"],
    description: "Total knee replacement (arthroplasty) is a surgical procedure to resurface a knee damaged by arthritis. Metal and plastic parts are used to cap the ends of the bones that form the knee joint.",
    symptoms: ["Chronic knee pain", "Stiffness limiting daily activities", "Swelling that doesn't improve with rest", "Knee deformity", "Failure of conservative treatments"],
    averageCost: { low: 25000, median: 50000, high: 100000, uninsured: 150000 },
    commonBillingErrors: [
      "Implant charges not matching actual implants used",
      "Physical therapy bundled into surgery but billed separately",
      "Duplicate operating room time charges",
      "Post-operative care visits double-billed"
    ],
    negotiationTips: [
      "Get quotes from multiple hospitals - prices vary by 300%+ for same procedure",
      "Consider medical tourism or surgery centers of excellence",
      "Negotiate a bundled price covering surgery, hospital stay, and implants",
      "Many hospitals have prompt-pay discounts of 20-30%"
    ],
    savingsPotential: "$10,000-$60,000",
    relatedConditions: ["hip-replacement", "orthopedic-surgery", "joint-replacement"],
    seoKeywords: ["knee replacement cost", "total knee replacement price", "how much does knee surgery cost", "knee replacement without insurance"],
    seoDescription: "Knee replacement surgery costs $25,000-$150,000. Learn how to compare prices, avoid billing errors, and negotiate substantial savings."
  },
  {
    slug: "childbirth-vaginal-delivery",
    name: "Childbirth - Vaginal Delivery",
    category: "Obstetric",
    icdCodes: ["O80", "Z37.0", "O70.0"],
    cptCodes: ["59400", "59409", "59410"],
    description: "Vaginal childbirth is the natural delivery of a baby through the birth canal. Hospital costs include prenatal care, labor and delivery, and postpartum care for mother and newborn.",
    symptoms: ["Regular contractions", "Water breaking", "Cervical dilation", "Back pain", "Bloody show"],
    averageCost: { low: 5000, median: 13000, high: 25000, uninsured: 35000 },
    commonBillingErrors: [
      "Nursery fees charged for rooming-in",
      "Duplicate charges for mother and baby",
      "Epidural billed at incorrect time duration",
      "Lactation consultation charged without consent"
    ],
    negotiationTips: [
      "Request an itemized bill for both mother and baby separately",
      "Compare birth center vs hospital costs - birth centers are 50%+ cheaper",
      "Ask about package pricing for uncomplicated deliveries",
      "Negotiate nursery fees if baby roomed with mother"
    ],
    savingsPotential: "$2,000-$15,000",
    relatedConditions: ["cesarean-section", "prenatal-care", "newborn-care"],
    seoKeywords: ["childbirth cost", "how much does having a baby cost", "vaginal delivery price", "hospital birth cost"],
    seoDescription: "Vaginal delivery costs $5,000-$35,000. Learn about common childbirth billing errors and how to reduce your hospital bill."
  },
  {
    slug: "cesarean-section",
    name: "Cesarean Section (C-Section)",
    category: "Obstetric",
    icdCodes: ["O82", "O84.2", "O75.82"],
    cptCodes: ["59510", "59514", "59515"],
    description: "A cesarean section is a surgical procedure to deliver a baby through incisions in the abdomen and uterus. C-sections may be planned or performed as an emergency procedure.",
    symptoms: ["Scheduled procedure or emergency", "Prolonged labor", "Fetal distress", "Placenta previa", "Multiple pregnancy"],
    averageCost: { low: 10000, median: 22000, high: 45000, uninsured: 60000 },
    commonBillingErrors: [
      "Double billing for labor before C-section",
      "Anesthesia time incorrectly calculated",
      "Recovery room fees charged twice",
      "Surgical assistant fees when resident performed"
    ],
    negotiationTips: [
      "Compare scheduled C-section prices in advance if elective",
      "Request global maternity package pricing",
      "Verify if surgical assistant was necessary and actually present",
      "Appeal insurance denials for emergency C-sections"
    ],
    savingsPotential: "$5,000-$25,000",
    relatedConditions: ["childbirth-vaginal-delivery", "prenatal-care", "surgical-delivery"],
    seoKeywords: ["c-section cost", "cesarean section price", "how much does c-section cost", "emergency c-section bill"],
    seoDescription: "C-section costs range from $10,000 to $60,000. Learn how to verify charges and negotiate your cesarean delivery bill."
  },
  {
    slug: "emergency-room-visit",
    name: "Emergency Room Visit",
    category: "Emergency",
    icdCodes: ["R10.9", "R51", "R07.9"],
    cptCodes: ["99281", "99282", "99283", "99284", "99285"],
    description: "Emergency room visits are for immediate treatment of acute injuries, illnesses, or conditions that could be life-threatening. ER costs vary dramatically based on the level of care required.",
    symptoms: ["Any acute medical emergency", "Chest pain", "Difficulty breathing", "Severe injuries", "Stroke symptoms", "Allergic reactions"],
    averageCost: { low: 500, median: 2000, high: 5000, uninsured: 8000 },
    commonBillingErrors: [
      "Facility fee not disclosed upfront",
      "Incorrect ER level assigned (99281-99285)",
      "Separate physician bill not explained",
      "Out-of-network providers in in-network ER"
    ],
    negotiationTips: [
      "Request itemized bill and verify the ER level matches your treatment",
      "Ask for financial assistance - many ERs have charity care",
      "Dispute surprise out-of-network bills under the No Surprises Act",
      "Negotiate a payment plan with 0% interest"
    ],
    savingsPotential: "$300-$3,000",
    relatedConditions: ["urgent-care", "hospital-admission", "emergency-surgery"],
    seoKeywords: ["ER visit cost", "emergency room bill", "how much does ER cost", "reduce emergency room bill"],
    seoDescription: "Emergency room visits cost $500-$8,000+. Learn how ER billing works and strategies to reduce your emergency room bill."
  },
  {
    slug: "hip-replacement",
    name: "Hip Replacement Surgery",
    category: "Orthopedic",
    icdCodes: ["M16.11", "M16.12", "Z96.641"],
    cptCodes: ["27130", "27132", "27134"],
    description: "Hip replacement surgery involves replacing damaged parts of the hip joint with artificial components. It's one of the most successful orthopedic procedures for relieving pain and restoring function.",
    symptoms: ["Hip pain affecting daily activities", "Stiffness limiting range of motion", "Pain not relieved by medication", "Hip deformity", "Failed conservative treatment"],
    averageCost: { low: 28000, median: 55000, high: 110000, uninsured: 140000 },
    commonBillingErrors: [
      "Implant markup exceeding reasonable margins",
      "Bundled services charged separately",
      "Rehabilitation days billed as acute care",
      "Duplicate anesthesia charges"
    ],
    negotiationTips: [
      "Compare hospital vs ambulatory surgery center pricing",
      "Request bundled pricing including implants and rehab",
      "Ask about manufacturer implant rebates",
      "Consider centers of excellence programs offered by insurers"
    ],
    savingsPotential: "$15,000-$70,000",
    relatedConditions: ["knee-replacement", "orthopedic-surgery", "joint-replacement"],
    seoKeywords: ["hip replacement cost", "total hip replacement price", "how much does hip surgery cost", "hip replacement without insurance"],
    seoDescription: "Hip replacement surgery costs $28,000-$140,000. Compare prices and learn strategies to significantly reduce your hip surgery bill."
  },
  {
    slug: "heart-bypass-surgery",
    name: "Coronary Artery Bypass Surgery (CABG)",
    category: "Cardiac",
    icdCodes: ["I25.10", "I25.110", "I25.700"],
    cptCodes: ["33533", "33534", "33535"],
    description: "Coronary artery bypass grafting (CABG) is open-heart surgery to improve blood flow to the heart. A healthy blood vessel is grafted to bypass blocked coronary arteries.",
    symptoms: ["Chest pain (angina)", "Shortness of breath", "Heart attack", "Blocked coronary arteries", "Failed angioplasty"],
    averageCost: { low: 75000, median: 150000, high: 250000, uninsured: 350000 },
    commonBillingErrors: [
      "ICU days over-reported",
      "Perfusion services double-billed",
      "Post-operative monitoring bundled but charged separately",
      "Cardiac rehabilitation not covered when should be"
    ],
    negotiationTips: [
      "For non-emergency cases, compare hospital pricing extensively",
      "Verify all ICU days were medically necessary",
      "Request assistance from hospital financial counselor",
      "Appeal insurance denials for cardiac rehabilitation"
    ],
    savingsPotential: "$25,000-$100,000",
    relatedConditions: ["heart-attack", "cardiac-catheterization", "angioplasty"],
    seoKeywords: ["heart bypass surgery cost", "CABG cost", "coronary bypass price", "heart surgery cost without insurance"],
    seoDescription: "Heart bypass surgery costs $75,000-$350,000. Learn about common billing errors and how to negotiate significant savings."
  },
  {
    slug: "cataract-surgery",
    name: "Cataract Surgery",
    category: "Ophthalmology",
    icdCodes: ["H25.11", "H25.12", "H25.13"],
    cptCodes: ["66984", "66982", "66987"],
    description: "Cataract surgery removes the clouded natural lens of the eye and replaces it with an artificial intraocular lens (IOL). It's one of the most common and successful surgeries performed.",
    symptoms: ["Cloudy or blurred vision", "Difficulty with night vision", "Light sensitivity", "Seeing halos around lights", "Fading colors"],
    averageCost: { low: 3000, median: 5500, high: 12000, uninsured: 15000 },
    commonBillingErrors: [
      "Premium IOL lens charged without proper consent",
      "Both eyes billed on same day when done separately",
      "Facility fee not explained",
      "Refractive component billed to insurance when not covered"
    ],
    negotiationTips: [
      "Standard IOLs are covered by Medicare - verify you weren't upsold",
      "Compare ambulatory surgery center vs hospital pricing",
      "Get written quotes for both eyes before surgery",
      "Ask about financing for premium lens upgrades"
    ],
    savingsPotential: "$1,000-$8,000",
    relatedConditions: ["lasik", "glaucoma-surgery", "eye-surgery"],
    seoKeywords: ["cataract surgery cost", "cataract removal price", "how much does cataract surgery cost", "cataract surgery Medicare"],
    seoDescription: "Cataract surgery costs $3,000-$15,000 per eye. Learn what's covered by Medicare and how to avoid premium lens overcharges."
  },
  {
    slug: "ct-scan",
    name: "CT Scan (Computed Tomography)",
    category: "Imaging",
    icdCodes: ["R10.9", "R51", "R06.02"],
    cptCodes: ["70450", "71250", "74176"],
    description: "CT scans use X-rays to create detailed cross-sectional images of the body. They're commonly used to diagnose injuries, infections, tumors, and guide treatment planning.",
    symptoms: ["Diagnostic procedure - varies by indication", "Abdominal pain", "Trauma evaluation", "Cancer staging", "Pulmonary embolism workup"],
    averageCost: { low: 300, median: 1000, high: 3000, uninsured: 4000 },
    commonBillingErrors: [
      "Hospital vs freestanding imaging center pricing not disclosed",
      "Contrast agent overcharged",
      "Multiple body areas billed at full price when discount should apply",
      "Emergency vs non-emergency rates misapplied"
    ],
    negotiationTips: [
      "Freestanding imaging centers charge 40-70% less",
      "Ask for cash pay price before using insurance",
      "Compare prices using online tools like MDsave",
      "Request contrast agent costs upfront"
    ],
    savingsPotential: "$200-$2,500",
    relatedConditions: ["mri-scan", "x-ray", "diagnostic-imaging"],
    seoKeywords: ["CT scan cost", "how much does CT scan cost", "CAT scan price", "CT scan without insurance"],
    seoDescription: "CT scan costs range from $300 to $4,000. Learn how to find affordable imaging and avoid hospital markup."
  },
  {
    slug: "physical-therapy",
    name: "Physical Therapy Session",
    category: "Rehabilitation",
    icdCodes: ["M54.5", "S83.401A", "M25.561"],
    cptCodes: ["97110", "97140", "97530"],
    description: "Physical therapy helps restore movement and function after injury, surgery, or illness. Treatment may include exercises, manual therapy, and modalities like ultrasound or electrical stimulation.",
    symptoms: ["Post-surgical rehabilitation", "Sports injuries", "Chronic pain", "Balance problems", "Mobility limitations"],
    averageCost: { low: 50, median: 150, high: 350, uninsured: 400 },
    commonBillingErrors: [
      "Each modality billed separately when should be bundled",
      "Time-based codes billed for incorrect duration",
      "Evaluation code used for routine follow-up",
      "Aide services billed as therapist services"
    ],
    negotiationTips: [
      "Ask about package pricing for multiple sessions",
      "Verify insurance covers prescribed number of visits",
      "Compare hospital-based vs independent PT clinics",
      "Request cash pay discount if paying out of pocket"
    ],
    savingsPotential: "$30-$150 per session",
    relatedConditions: ["occupational-therapy", "sports-medicine", "rehabilitation"],
    seoKeywords: ["physical therapy cost", "PT session price", "how much does physical therapy cost", "physical therapy without insurance"],
    seoDescription: "Physical therapy costs $50-$400 per session. Learn about billing practices and how to maximize your insurance coverage."
  },
  {
    slug: "gallbladder-removal",
    name: "Gallbladder Removal (Cholecystectomy)",
    category: "Surgical",
    icdCodes: ["K80.20", "K81.0", "K82.2"],
    cptCodes: ["47562", "47563", "47600"],
    description: "Cholecystectomy is the surgical removal of the gallbladder, usually performed laparoscopically. It's one of the most common surgeries in the United States.",
    symptoms: ["Gallstones", "Severe abdominal pain", "Nausea after fatty meals", "Gallbladder inflammation", "Jaundice"],
    averageCost: { low: 8000, median: 15000, high: 30000, uninsured: 40000 },
    commonBillingErrors: [
      "Open surgery rates charged for laparoscopic procedure",
      "Pathology fees for routine specimen not disclosed",
      "Recovery room charges excessive",
      "Anesthesia time over-reported"
    ],
    negotiationTips: [
      "Laparoscopic surgery should cost less than open - verify coding",
      "Outpatient surgery centers are significantly cheaper",
      "Request all-inclusive pricing before surgery",
      "Compare prices across facilities in your area"
    ],
    savingsPotential: "$3,000-$20,000",
    relatedConditions: ["appendectomy", "abdominal-surgery", "laparoscopic-surgery"],
    seoKeywords: ["gallbladder surgery cost", "cholecystectomy price", "gallbladder removal cost", "laparoscopic gallbladder surgery"],
    seoDescription: "Gallbladder removal costs $8,000-$40,000. Compare laparoscopic vs open surgery pricing and learn negotiation strategies."
  },
  {
    slug: "spinal-fusion",
    name: "Spinal Fusion Surgery",
    category: "Orthopedic",
    icdCodes: ["M43.16", "M47.816", "M48.06"],
    cptCodes: ["22612", "22630", "22633"],
    description: "Spinal fusion permanently connects two or more vertebrae to eliminate motion and reduce pain. It's used to treat conditions like degenerative disc disease, scoliosis, and spinal fractures.",
    symptoms: ["Chronic back pain", "Leg pain or weakness", "Spinal instability", "Degenerative disc disease", "Failed conservative treatment"],
    averageCost: { low: 50000, median: 110000, high: 200000, uninsured: 250000 },
    commonBillingErrors: [
      "Implant charges far exceeding cost to hospital",
      "Multiple levels billed without proper documentation",
      "Bone graft fees when patient's own bone used",
      "Neuromonitoring charged without medical necessity"
    ],
    negotiationTips: [
      "Get second opinion - many spinal fusions may not be necessary",
      "Request detailed implant cost breakdown",
      "Compare hospital and ambulatory surgery center pricing",
      "Verify insurance pre-authorization covers all planned levels"
    ],
    savingsPotential: "$20,000-$100,000",
    relatedConditions: ["laminectomy", "discectomy", "back-surgery"],
    seoKeywords: ["spinal fusion cost", "back surgery price", "how much does spinal fusion cost", "spine surgery without insurance"],
    seoDescription: "Spinal fusion surgery costs $50,000-$250,000. Learn about implant markups and strategies to reduce your spine surgery bill."
  },
  {
    slug: "hernia-repair",
    name: "Hernia Repair Surgery",
    category: "Surgical",
    icdCodes: ["K40.90", "K43.9", "K44.9"],
    cptCodes: ["49505", "49650", "49652"],
    description: "Hernia repair surgery corrects a hernia by pushing the protruding tissue back and reinforcing the weakened muscle wall. It can be performed open or laparoscopically.",
    symptoms: ["Visible bulge in groin or abdomen", "Pain during activity", "Burning sensation", "Weakness in groin", "Discomfort when lifting"],
    averageCost: { low: 4000, median: 8000, high: 20000, uninsured: 28000 },
    commonBillingErrors: [
      "Mesh charges not disclosed upfront",
      "Laparoscopic vs open surgery pricing discrepancy",
      "Recovery room fees excessive for outpatient procedure",
      "Bilateral hernia billed incorrectly"
    ],
    negotiationTips: [
      "Outpatient surgery centers charge 30-50% less than hospitals",
      "Request mesh costs in advance - varies significantly",
      "Ask about package pricing for uncomplicated repairs",
      "Compare laparoscopic vs open surgery pricing"
    ],
    savingsPotential: "$2,000-$12,000",
    relatedConditions: ["inguinal-hernia", "abdominal-surgery", "outpatient-surgery"],
    seoKeywords: ["hernia repair cost", "hernia surgery price", "inguinal hernia surgery cost", "hernia operation cost"],
    seoDescription: "Hernia repair surgery costs $4,000-$28,000. Compare outpatient vs hospital pricing and learn about mesh fee negotiations."
  },
  {
    slug: "tonsillectomy",
    name: "Tonsillectomy",
    category: "ENT",
    icdCodes: ["J35.01", "J35.03", "J36"],
    cptCodes: ["42820", "42821", "42826"],
    description: "Tonsillectomy is the surgical removal of the tonsils, typically performed to treat recurrent tonsillitis or sleep apnea in children. It's one of the most common pediatric surgeries.",
    symptoms: ["Recurrent tonsillitis", "Difficulty swallowing", "Obstructive sleep apnea", "Enlarged tonsils", "Chronic sore throat"],
    averageCost: { low: 3000, median: 5500, high: 12000, uninsured: 15000 },
    commonBillingErrors: [
      "Adult rates applied to pediatric procedure",
      "Recovery room charges for simple outpatient procedure",
      "Pathology fees for routine tonsil removal",
      "Pain medication over-billed"
    ],
    negotiationTips: [
      "Ambulatory surgery centers offer 40-60% savings",
      "Request package pricing including anesthesia",
      "Verify age-appropriate coding was used",
      "Compare pediatric ENT specialist pricing"
    ],
    savingsPotential: "$1,500-$8,000",
    relatedConditions: ["adenoidectomy", "sleep-apnea-surgery", "pediatric-surgery"],
    seoKeywords: ["tonsillectomy cost", "tonsil removal price", "how much does tonsillectomy cost", "tonsil surgery for kids"],
    seoDescription: "Tonsillectomy costs $3,000-$15,000. Learn about pediatric billing considerations and ambulatory surgery center savings."
  },
  {
    slug: "cardiac-catheterization",
    name: "Cardiac Catheterization",
    category: "Cardiac",
    icdCodes: ["I25.10", "R00.0", "I20.9"],
    cptCodes: ["93458", "93459", "93460"],
    description: "Cardiac catheterization is a diagnostic procedure that uses a catheter threaded through blood vessels to the heart. It can diagnose and treat some heart conditions and is often performed before heart surgery.",
    symptoms: ["Chest pain", "Shortness of breath", "Abnormal stress test", "Heart failure evaluation", "Pre-surgical assessment"],
    averageCost: { low: 10000, median: 25000, high: 50000, uninsured: 70000 },
    commonBillingErrors: [
      "Stent charges when only diagnostic catheterization performed",
      "Facility fee not clearly disclosed",
      "Contrast agent overcharged",
      "Left and right heart cath billed separately when done together"
    ],
    negotiationTips: [
      "Verify diagnostic vs interventional procedure coding",
      "Request itemized breakdown of supplies and medications",
      "Ask for stent manufacturer and model - pricing varies significantly",
      "Compare hospital cardiac cath lab pricing"
    ],
    savingsPotential: "$5,000-$30,000",
    relatedConditions: ["angioplasty", "heart-stent", "heart-bypass-surgery"],
    seoKeywords: ["cardiac catheterization cost", "heart cath price", "angiogram cost", "cardiac cath without insurance"],
    seoDescription: "Cardiac catheterization costs $10,000-$70,000. Learn about stent pricing and how to verify your heart procedure billing."
  },
  {
    slug: "mammogram",
    name: "Mammogram Screening",
    category: "Imaging",
    icdCodes: ["Z12.31", "R92.2", "N63.10"],
    cptCodes: ["77067", "77066", "77065"],
    description: "Mammography is X-ray imaging of the breast used to screen for and diagnose breast cancer. Screening mammograms are recommended annually for women over 40.",
    symptoms: ["Screening procedure - no symptoms required", "Breast lump", "Breast pain", "Nipple discharge", "Skin changes"],
    averageCost: { low: 100, median: 300, high: 600, uninsured: 800 },
    commonBillingErrors: [
      "Screening mammogram coded as diagnostic (higher cost)",
      "3D tomosynthesis charged without disclosure",
      "Computer-aided detection billed when not ordered",
      "Facility fee not explained"
    ],
    negotiationTips: [
      "ACA requires screening mammograms be covered 100%",
      "Ask if 3D mammography is included or extra cost",
      "Freestanding imaging centers offer lower prices",
      "Many hospitals offer free mammogram programs"
    ],
    savingsPotential: "$50-$400",
    relatedConditions: ["breast-biopsy", "breast-cancer-screening", "diagnostic-mammogram"],
    seoKeywords: ["mammogram cost", "how much does mammogram cost", "free mammogram screening", "mammogram price without insurance"],
    seoDescription: "Mammogram costs $100-$800. Learn why screening mammograms should be free under ACA and how to access low-cost screening."
  },
  {
    slug: "dental-implant",
    name: "Dental Implant",
    category: "Dental",
    icdCodes: ["K08.1", "K00.0", "K08.419"],
    cptCodes: ["D6010", "D6065", "D6066"],
    description: "Dental implants are artificial tooth roots surgically placed in the jawbone to support replacement teeth or bridges. They provide a permanent solution for missing teeth.",
    symptoms: ["Missing teeth", "Loose dentures", "Bone loss in jaw", "Difficulty chewing", "Facial changes from tooth loss"],
    averageCost: { low: 1500, median: 4000, high: 7500, uninsured: 8000 },
    commonBillingErrors: [
      "Abutment and crown costs not disclosed upfront",
      "Bone graft billed when not necessary",
      "CT scan overcharged for implant planning",
      "Multiple appointments billed as separate procedures"
    ],
    negotiationTips: [
      "Get quotes including abutment and crown - not just implant",
      "Dental schools offer implants at 50% or more off",
      "Compare periodontist vs oral surgeon pricing",
      "Ask about financing or dental discount plans"
    ],
    savingsPotential: "$500-$3,000 per implant",
    relatedConditions: ["dental-crown", "dental-bridge", "tooth-extraction"],
    seoKeywords: ["dental implant cost", "tooth implant price", "how much do dental implants cost", "affordable dental implants"],
    seoDescription: "Dental implants cost $1,500-$8,000 per tooth. Learn about hidden costs and how to find affordable implant options."
  },
  {
    slug: "root-canal",
    name: "Root Canal Treatment",
    category: "Dental",
    icdCodes: ["K04.0", "K04.1", "K04.5"],
    cptCodes: ["D3310", "D3320", "D3330"],
    description: "Root canal treatment removes infected pulp from inside a tooth, cleaning and sealing the root canals to save the tooth. It's the treatment of choice for infected or dying teeth.",
    symptoms: ["Severe toothache", "Prolonged sensitivity to hot/cold", "Darkening tooth", "Gum swelling", "Dental abscess"],
    averageCost: { low: 500, median: 1000, high: 1800, uninsured: 2500 },
    commonBillingErrors: [
      "Crown cost not included in quote",
      "Molar charged when anterior tooth treated",
      "Retreatment charged as new procedure",
      "X-rays billed separately when included"
    ],
    negotiationTips: [
      "Get total cost including crown upfront",
      "Compare general dentist vs endodontist pricing",
      "Dental schools offer significant discounts",
      "Ask about dental savings plans for uninsured"
    ],
    savingsPotential: "$200-$1,000",
    relatedConditions: ["dental-crown", "tooth-extraction", "dental-abscess"],
    seoKeywords: ["root canal cost", "how much does root canal cost", "root canal price", "root canal without insurance"],
    seoDescription: "Root canal costs $500-$2,500 plus crown. Learn about pricing by tooth location and how to save on endodontic treatment."
  },
  {
    slug: "hysterectomy",
    name: "Hysterectomy",
    category: "Gynecologic",
    icdCodes: ["D25.9", "N80.0", "N85.00"],
    cptCodes: ["58150", "58260", "58550"],
    description: "Hysterectomy is the surgical removal of the uterus. It may be performed abdominally, vaginally, or laparoscopically for conditions including fibroids, endometriosis, and cancer.",
    symptoms: ["Heavy menstrual bleeding", "Chronic pelvic pain", "Uterine fibroids", "Endometriosis", "Uterine prolapse"],
    averageCost: { low: 12000, median: 25000, high: 50000, uninsured: 65000 },
    commonBillingErrors: [
      "More invasive approach billed than performed",
      "Ovary removal charged when not performed",
      "Pathology fees excessive for routine specimen",
      "Post-operative visits billed separately when bundled"
    ],
    negotiationTips: [
      "Verify laparoscopic vs abdominal coding matches procedure",
      "Ask for bundled pricing including hospital stay",
      "Compare hospital vs ambulatory surgery center for eligible procedures",
      "Request ovary preservation if appropriate - reduces complexity and cost"
    ],
    savingsPotential: "$5,000-$25,000",
    relatedConditions: ["fibroid-treatment", "endometriosis-surgery", "gynecologic-surgery"],
    seoKeywords: ["hysterectomy cost", "uterus removal surgery cost", "how much does hysterectomy cost", "hysterectomy price"],
    seoDescription: "Hysterectomy costs $12,000-$65,000. Compare surgical approaches and learn how to verify correct procedure coding."
  },
  {
    slug: "acl-reconstruction",
    name: "ACL Reconstruction Surgery",
    category: "Orthopedic",
    icdCodes: ["S83.511A", "S83.512A", "M23.611"],
    cptCodes: ["29888", "29887", "27427"],
    description: "ACL reconstruction replaces a torn anterior cruciate ligament in the knee with a tissue graft. It's commonly needed after sports injuries and is essential for returning to high-activity lifestyles.",
    symptoms: ["Knee instability", "Swelling after injury", "Loud pop at time of injury", "Limited range of motion", "Pain with activity"],
    averageCost: { low: 15000, median: 35000, high: 60000, uninsured: 75000 },
    commonBillingErrors: [
      "Graft type pricing not disclosed - allograft vs autograft",
      "MRI bundling issues",
      "Physical therapy billed separately when in global period",
      "Meniscus repair charged when only inspection performed"
    ],
    negotiationTips: [
      "Compare surgeon and facility fees - wide variation exists",
      "Ask about graft source and associated costs",
      "Ambulatory surgery centers offer significant savings",
      "Verify what's included in surgeon's global fee"
    ],
    savingsPotential: "$8,000-$35,000",
    relatedConditions: ["meniscus-repair", "knee-arthroscopy", "sports-medicine-surgery"],
    seoKeywords: ["ACL surgery cost", "ACL reconstruction price", "knee ligament surgery cost", "ACL repair cost"],
    seoDescription: "ACL reconstruction costs $15,000-$75,000. Learn about graft types, facility choices, and billing strategies for knee surgery."
  },
  {
    slug: "lasik-eye-surgery",
    name: "LASIK Eye Surgery",
    category: "Ophthalmology",
    icdCodes: ["H52.10", "H52.11", "H52.4"],
    cptCodes: ["65760", "65765", "66999"],
    description: "LASIK is laser eye surgery that corrects vision by reshaping the cornea. It can treat nearsightedness, farsightedness, and astigmatism, reducing or eliminating the need for glasses or contacts.",
    symptoms: ["Nearsightedness", "Farsightedness", "Astigmatism", "Desire to reduce dependence on glasses/contacts", "Stable vision prescription"],
    averageCost: { low: 1000, median: 2500, high: 4500, uninsured: 4500 },
    commonBillingErrors: [
      "Low price advertising doesn't include enhancements",
      "One-eye pricing used when most need both eyes",
      "Post-operative care charged separately",
      "Technology fees not clearly disclosed"
    ],
    negotiationTips: [
      "Get all-inclusive pricing for both eyes upfront",
      "Ask about lifetime enhancement policies",
      "Compare different LASIK technologies and associated costs",
      "Look for promotional pricing - common in this competitive market"
    ],
    savingsPotential: "$500-$2,000",
    relatedConditions: ["prk-surgery", "cataract-surgery", "vision-correction"],
    seoKeywords: ["LASIK cost", "laser eye surgery price", "how much does LASIK cost", "LASIK surgery near me"],
    seoDescription: "LASIK eye surgery costs $1,000-$4,500 per eye. Learn about different technologies and how to compare all-inclusive pricing."
  },
  {
    slug: "back-pain-treatment",
    name: "Chronic Back Pain Treatment",
    category: "Pain Management",
    icdCodes: ["M54.5", "M54.50", "M54.51"],
    cptCodes: ["62322", "62323", "64483"],
    description: "Chronic back pain treatment includes a range of interventions from physical therapy and medications to injections and surgery. Most people respond to conservative treatment without surgery.",
    symptoms: ["Persistent back pain over 3 months", "Radiating leg pain", "Stiffness", "Limited mobility", "Pain affecting daily activities"],
    averageCost: { low: 500, median: 2500, high: 8000, uninsured: 12000 },
    commonBillingErrors: [
      "Injection site levels billed incorrectly",
      "Fluoroscopy guidance double-billed",
      "Physical therapy beyond medical necessity",
      "DME (braces, etc.) overcharged"
    ],
    negotiationTips: [
      "Start with conservative treatment - cheaper and often effective",
      "Verify injection level matches documentation",
      "Compare ambulatory surgery center for injection procedures",
      "Ask about cash pay discounts for repeat injections"
    ],
    savingsPotential: "$300-$5,000",
    relatedConditions: ["epidural-steroid-injection", "spinal-fusion", "physical-therapy"],
    seoKeywords: ["back pain treatment cost", "spine injection cost", "epidural injection price", "chronic pain treatment cost"],
    seoDescription: "Chronic back pain treatment costs $500-$12,000 depending on intervention. Learn about conservative vs surgical options and billing."
  },
  {
    slug: "skin-biopsy",
    name: "Skin Biopsy",
    category: "Dermatology",
    icdCodes: ["D23.9", "L98.9", "C44.90"],
    cptCodes: ["11102", "11104", "11106"],
    description: "A skin biopsy removes a small sample of skin for laboratory analysis to diagnose skin conditions, rashes, infections, or skin cancers. Different techniques include shave, punch, and excisional biopsies.",
    symptoms: ["Suspicious mole or lesion", "Non-healing sore", "Unusual skin growth", "Changing skin spot", "Rash not responding to treatment"],
    averageCost: { low: 150, median: 400, high: 1000, uninsured: 1500 },
    commonBillingErrors: [
      "Each biopsy site billed as separate procedure",
      "Pathology fees not disclosed upfront",
      "Office visit charged in addition to procedure",
      "Incorrect biopsy type coded"
    ],
    negotiationTips: [
      "Ask for all-inclusive pricing including pathology",
      "Dermatologist offices may be cheaper than hospital outpatient",
      "Request pathology be sent to in-network lab",
      "If multiple biopsies needed, negotiate package price"
    ],
    savingsPotential: "$100-$600",
    relatedConditions: ["mole-removal", "skin-cancer-treatment", "dermatology-procedures"],
    seoKeywords: ["skin biopsy cost", "mole biopsy price", "dermatology biopsy cost", "skin cancer screening cost"],
    seoDescription: "Skin biopsy costs $150-$1,500 including pathology. Learn about biopsy types and how to get pricing upfront."
  },
  {
    slug: "blood-work-panel",
    name: "Comprehensive Blood Work Panel",
    category: "Laboratory",
    icdCodes: ["Z00.00", "R53.83", "E11.9"],
    cptCodes: ["80053", "85025", "84443"],
    description: "Comprehensive blood panels check various health markers including blood counts, chemistry panels, lipid levels, and thyroid function. They're used for routine health monitoring and disease diagnosis.",
    symptoms: ["Routine health check", "Fatigue", "Weight changes", "Diabetes monitoring", "Heart disease screening"],
    averageCost: { low: 50, median: 200, high: 600, uninsured: 1000 },
    commonBillingErrors: [
      "Hospital lab fees vs independent lab pricing gap",
      "Duplicate panels ordered",
      "Tests not covered for routine screening",
      "Add-on tests not requested by physician"
    ],
    negotiationTips: [
      "Use independent labs like Quest or Labcorp - 50-90% cheaper than hospital",
      "Ask about self-pay pricing upfront",
      "Direct-to-consumer labs offer transparent pricing",
      "Some tests are covered as preventive - verify before paying"
    ],
    savingsPotential: "$50-$800",
    relatedConditions: ["health-screening", "diabetes-management", "cholesterol-test"],
    seoKeywords: ["blood test cost", "lab work cost without insurance", "blood panel price", "comprehensive metabolic panel cost"],
    seoDescription: "Blood work costs $50-$1,000. Learn how using independent labs can save you up to 90% on laboratory tests."
  },
  {
    slug: "sleep-study",
    name: "Sleep Study (Polysomnography)",
    category: "Sleep Medicine",
    icdCodes: ["G47.30", "G47.33", "R06.83"],
    cptCodes: ["95810", "95811", "95806"],
    description: "A sleep study monitors your sleep patterns, breathing, and body functions overnight to diagnose sleep disorders like sleep apnea, insomnia, and restless leg syndrome.",
    symptoms: ["Loud snoring", "Gasping during sleep", "Excessive daytime sleepiness", "Morning headaches", "Difficulty staying asleep"],
    averageCost: { low: 500, median: 2000, high: 5000, uninsured: 6000 },
    commonBillingErrors: [
      "In-lab study charged when home test appropriate",
      "CPAP titration billed separately when should be split-night",
      "Facility fee excessive for overnight monitoring",
      "Professional interpretation overcharged"
    ],
    negotiationTips: [
      "Home sleep tests cost 50-80% less - ask if you qualify",
      "Request split-night study to avoid second visit",
      "Compare independent sleep centers vs hospital labs",
      "Ask about cash pay discounts"
    ],
    savingsPotential: "$500-$3,000",
    relatedConditions: ["sleep-apnea-treatment", "cpap-therapy", "insomnia-treatment"],
    seoKeywords: ["sleep study cost", "how much does sleep study cost", "polysomnography price", "sleep apnea test cost"],
    seoDescription: "Sleep studies cost $500-$6,000. Learn when home tests are appropriate and how to reduce sleep lab expenses."
  },
  {
    slug: "diabetes-management",
    name: "Diabetes Management Program",
    category: "Chronic Care",
    icdCodes: ["E11.9", "E11.65", "E10.9"],
    cptCodes: ["99490", "99091", "82947"],
    description: "Diabetes management includes regular monitoring, medication management, nutrition counseling, and preventive care to control blood sugar and prevent complications.",
    symptoms: ["Elevated blood sugar", "Increased thirst", "Frequent urination", "Fatigue", "Slow-healing wounds"],
    averageCost: { low: 2000, median: 6000, high: 15000, uninsured: 20000 },
    commonBillingErrors: [
      "Test strips and supplies overcharged",
      "Duplicate A1c tests in short timeframe",
      "Diabetes education not covered when should be",
      "CGM devices billed incorrectly"
    ],
    negotiationTips: [
      "ACA plans cover diabetes supplies and education",
      "Compare pharmacy prices for test strips and medications",
      "Ask about manufacturer patient assistance programs",
      "Use mail-order pharmacy for maintenance medications"
    ],
    savingsPotential: "$500-$8,000 annually",
    relatedConditions: ["insulin-therapy", "blood-glucose-monitoring", "diabetic-foot-care"],
    seoKeywords: ["diabetes management cost", "diabetes supplies cost", "insulin price", "blood sugar monitor cost"],
    seoDescription: "Annual diabetes management costs $2,000-$20,000. Learn about covered services and how to reduce supply and medication costs."
  },
  {
    slug: "allergy-testing",
    name: "Allergy Testing",
    category: "Allergy/Immunology",
    icdCodes: ["T78.40XA", "J30.9", "L50.0"],
    cptCodes: ["95004", "95024", "86003"],
    description: "Allergy testing identifies specific allergens triggering allergic reactions. Skin prick tests and blood tests can identify food allergies, environmental allergies, and drug sensitivities.",
    symptoms: ["Chronic congestion", "Skin rashes or hives", "Food reactions", "Seasonal symptoms", "Asthma triggers unknown"],
    averageCost: { low: 200, median: 600, high: 1500, uninsured: 2000 },
    commonBillingErrors: [
      "Each allergen tested billed as separate procedure",
      "Blood tests ordered when skin test appropriate",
      "Panels including unnecessary allergens",
      "Office visit charged separately"
    ],
    negotiationTips: [
      "Ask for standard panel pricing rather than per-allergen",
      "Skin tests are typically cheaper than blood tests",
      "Request only clinically relevant allergens be tested",
      "Compare allergist vs primary care pricing"
    ],
    savingsPotential: "$200-$1,000",
    relatedConditions: ["allergy-shots", "food-allergy-treatment", "asthma-management"],
    seoKeywords: ["allergy testing cost", "allergy test price", "skin prick test cost", "food allergy testing cost"],
    seoDescription: "Allergy testing costs $200-$2,000. Learn about skin vs blood tests and how to get appropriate testing without overcharges."
  },
  {
    slug: "mental-health-therapy",
    name: "Mental Health Therapy Session",
    category: "Mental Health",
    icdCodes: ["F32.9", "F41.1", "F43.10"],
    cptCodes: ["90834", "90837", "90832"],
    description: "Mental health therapy includes various forms of counseling and psychotherapy to treat depression, anxiety, trauma, and other mental health conditions.",
    symptoms: ["Persistent sadness", "Excessive worry", "Panic attacks", "Trauma symptoms", "Relationship difficulties"],
    averageCost: { low: 100, median: 175, high: 300, uninsured: 350 },
    commonBillingErrors: [
      "Session length billed doesn't match actual time",
      "Out-of-network rates not disclosed",
      "Initial evaluation charged repeatedly",
      "Telemedicine billed at higher rate"
    ],
    negotiationTips: [
      "Mental health parity law requires equal coverage to medical",
      "Many therapists offer sliding scale fees",
      "Community mental health centers offer reduced rates",
      "Ask about telehealth options which may be cheaper"
    ],
    savingsPotential: "$50-$150 per session",
    relatedConditions: ["psychiatry", "depression-treatment", "anxiety-treatment"],
    seoKeywords: ["therapy cost", "counseling cost", "how much does therapy cost", "therapist cost without insurance"],
    seoDescription: "Therapy sessions cost $100-$350. Learn about mental health parity rights and how to access affordable mental health care."
  },
  {
    slug: "ultrasound",
    name: "Ultrasound Imaging",
    category: "Imaging",
    icdCodes: ["Z34.00", "R10.9", "N83.20"],
    cptCodes: ["76700", "76805", "76830"],
    description: "Ultrasound uses sound waves to create images of internal body structures. It's commonly used during pregnancy, for abdominal evaluation, and to guide procedures.",
    symptoms: ["Pregnancy monitoring", "Abdominal pain evaluation", "Pelvic concerns", "Vascular assessment", "Thyroid nodules"],
    averageCost: { low: 150, median: 400, high: 800, uninsured: 1200 },
    commonBillingErrors: [
      "Hospital vs freestanding imaging price gap",
      "Limited vs complete study coding mismatch",
      "Doppler charges added when not ordered",
      "Multiple body areas billed at full price"
    ],
    negotiationTips: [
      "Freestanding imaging centers charge 40-70% less",
      "Ask for cash pay pricing upfront",
      "Prenatal ultrasounds may be covered 100% as preventive",
      "Compare prices online before scheduling"
    ],
    savingsPotential: "$100-$600",
    relatedConditions: ["prenatal-care", "abdominal-imaging", "vascular-testing"],
    seoKeywords: ["ultrasound cost", "how much does ultrasound cost", "pregnancy ultrasound price", "abdominal ultrasound cost"],
    seoDescription: "Ultrasound costs $150-$1,200. Learn about hospital vs imaging center pricing and how to access affordable ultrasound."
  },
  {
    slug: "rotator-cuff-repair",
    name: "Rotator Cuff Repair Surgery",
    category: "Orthopedic",
    icdCodes: ["M75.100", "M75.101", "M75.102"],
    cptCodes: ["29827", "23412", "23410"],
    description: "Rotator cuff repair surgery fixes torn tendons in the shoulder. It can be performed arthroscopically or through open surgery depending on tear severity.",
    symptoms: ["Shoulder pain at night", "Weakness lifting arm", "Crackling sensation", "Limited range of motion", "Pain after injury or overuse"],
    averageCost: { low: 12000, median: 30000, high: 55000, uninsured: 70000 },
    commonBillingErrors: [
      "Arthroscopic vs open surgery pricing difference not explained",
      "Physical therapy bundled but billed separately",
      "Anchor device charges inflated",
      "Post-operative imaging not authorized"
    ],
    negotiationTips: [
      "Compare ambulatory surgery center vs hospital pricing",
      "Ask about device and implant costs in advance",
      "Verify what's included in surgeon's global fee",
      "Request bundled pricing for surgery and initial PT"
    ],
    savingsPotential: "$8,000-$30,000",
    relatedConditions: ["shoulder-arthroscopy", "shoulder-impingement", "sports-medicine-surgery"],
    seoKeywords: ["rotator cuff surgery cost", "shoulder surgery price", "rotator cuff repair cost", "torn rotator cuff treatment"],
    seoDescription: "Rotator cuff surgery costs $12,000-$70,000. Compare arthroscopic vs open surgery and learn about implant cost negotiations."
  },
  {
    slug: "prostate-cancer-screening",
    name: "Prostate Cancer Screening",
    category: "Preventive",
    icdCodes: ["Z12.5", "R97.20", "C61"],
    cptCodes: ["84153", "84154", "G0103"],
    description: "Prostate cancer screening typically includes a PSA blood test and may include a digital rectal exam. The decision to screen should be made jointly by patient and physician.",
    symptoms: ["Screening procedure - no symptoms required", "Difficulty urinating", "Frequent urination", "Blood in urine", "Family history of prostate cancer"],
    averageCost: { low: 30, median: 100, high: 250, uninsured: 350 },
    commonBillingErrors: [
      "PSA test coded as diagnostic rather than screening",
      "Follow-up tests included without explanation",
      "Office visit charged when only blood draw",
      "Out-of-network lab used without notice"
    ],
    negotiationTips: [
      "Medicare covers annual PSA test",
      "Many insurers cover as preventive with no cost-share",
      "Use independent lab for lower pricing",
      "Verify screening vs diagnostic coding"
    ],
    savingsPotential: "$50-$200",
    relatedConditions: ["prostate-biopsy", "prostate-treatment", "cancer-screening"],
    seoKeywords: ["PSA test cost", "prostate cancer screening cost", "prostate exam cost", "PSA test price"],
    seoDescription: "Prostate cancer screening costs $30-$350. Learn about coverage as preventive care and how to avoid overcharges."
  },
  {
    slug: "endoscopy",
    name: "Upper Endoscopy (EGD)",
    category: "Gastroenterology",
    icdCodes: ["K21.0", "K25.9", "R12"],
    cptCodes: ["43239", "43235", "43249"],
    description: "Upper endoscopy uses a thin, flexible scope to examine the esophagus, stomach, and upper small intestine. It diagnoses and can treat conditions like GERD, ulcers, and Barrett's esophagus.",
    symptoms: ["Persistent heartburn", "Difficulty swallowing", "Abdominal pain", "Nausea and vomiting", "Unexplained weight loss"],
    averageCost: { low: 1500, median: 3500, high: 7000, uninsured: 10000 },
    commonBillingErrors: [
      "Biopsy charges excessive for routine sampling",
      "Facility fee not disclosed",
      "Anesthesia type and time misrepresented",
      "Pathology sent to out-of-network lab"
    ],
    negotiationTips: [
      "Ambulatory surgery centers offer 40-60% savings",
      "Ask about all-inclusive pricing upfront",
      "Verify anesthesia is in-network",
      "Request pathology go to in-network lab"
    ],
    savingsPotential: "$800-$4,000",
    relatedConditions: ["colonoscopy", "gerd-treatment", "ulcer-treatment"],
    seoKeywords: ["endoscopy cost", "upper GI endoscopy price", "EGD cost", "endoscopy without insurance"],
    seoDescription: "Upper endoscopy costs $1,500-$10,000. Compare outpatient facility pricing and learn about all-inclusive quotes."
  },
  {
    slug: "vasectomy",
    name: "Vasectomy",
    category: "Urology",
    icdCodes: ["Z30.2", "Z98.52"],
    cptCodes: ["55250", "55450"],
    description: "Vasectomy is a minor surgical procedure for male sterilization. It's performed as an outpatient procedure and is considered a permanent form of birth control.",
    symptoms: ["Elective procedure for contraception", "Desire for permanent birth control", "Completed family planning"],
    averageCost: { low: 500, median: 1000, high: 2500, uninsured: 3000 },
    commonBillingErrors: [
      "Facility fee excessive for office procedure",
      "Follow-up semen analysis not included",
      "Anesthesia overcharged for local procedure",
      "Supply costs inflated"
    ],
    negotiationTips: [
      "Office-based procedures are cheapest option",
      "Ask if follow-up analysis is included in price",
      "Many urologists offer all-inclusive pricing",
      "Compare urologist vs family practice pricing"
    ],
    savingsPotential: "$300-$1,500",
    relatedConditions: ["vasectomy-reversal", "male-contraception", "urology-procedures"],
    seoKeywords: ["vasectomy cost", "how much does vasectomy cost", "vasectomy price without insurance", "cheap vasectomy near me"],
    seoDescription: "Vasectomy costs $500-$3,000. Learn about office vs surgical center pricing and what should be included in the cost."
  },
  {
    slug: "wisdom-tooth-extraction",
    name: "Wisdom Tooth Extraction",
    category: "Oral Surgery",
    icdCodes: ["K01.1", "K08.3", "K09.0"],
    cptCodes: ["D7210", "D7220", "D7240"],
    description: "Wisdom tooth extraction removes one or more third molars, often due to impaction, crowding, or decay. Complexity varies from simple extraction to surgical removal.",
    symptoms: ["Pain in back of mouth", "Swollen gums", "Difficulty opening mouth", "Crowding of other teeth", "Partially erupted teeth"],
    averageCost: { low: 200, median: 500, high: 1200, uninsured: 1500 },
    commonBillingErrors: [
      "Simple extraction billed as surgical",
      "Each tooth charged at full price without multi-tooth discount",
      "Anesthesia level overcharged",
      "X-rays billed separately when included"
    ],
    negotiationTips: [
      "Get quote for all four if multiple need removal",
      "Dental schools offer significant discounts",
      "Compare oral surgeon vs general dentist pricing",
      "Ask about sedation options and costs upfront"
    ],
    savingsPotential: "$100-$600 per tooth",
    relatedConditions: ["tooth-extraction", "oral-surgery", "dental-impaction"],
    seoKeywords: ["wisdom tooth removal cost", "wisdom tooth extraction price", "impacted wisdom tooth surgery cost", "wisdom teeth removal"],
    seoDescription: "Wisdom tooth extraction costs $200-$1,500 per tooth. Learn about simple vs surgical extraction pricing and package discounts."
  },
  {
    slug: "bronchitis-treatment",
    name: "Bronchitis Treatment",
    category: "Respiratory",
    icdCodes: ["J20.9", "J40", "J44.1"],
    cptCodes: ["99213", "99214", "71046"],
    description: "Bronchitis is inflammation of the bronchial tubes that carry air to the lungs. Acute bronchitis is usually viral and resolves without antibiotics, while chronic bronchitis requires ongoing management.",
    symptoms: ["Persistent cough", "Mucus production", "Chest discomfort", "Fatigue", "Mild fever and chills"],
    averageCost: { low: 100, median: 250, high: 600, uninsured: 800 },
    commonBillingErrors: [
      "Chest X-ray ordered when not clinically indicated",
      "Antibiotics prescribed for viral bronchitis",
      "Office visit level coded too high",
      "Nebulizer treatment overcharged"
    ],
    negotiationTips: [
      "Most acute bronchitis doesn't require X-ray or antibiotics",
      "Urgent care is cheaper than ER for non-emergency",
      "Telemedicine visits are often cheapest option",
      "Generic medications if antibiotics truly needed"
    ],
    savingsPotential: "$50-$400",
    relatedConditions: ["pneumonia", "asthma", "respiratory-infection"],
    seoKeywords: ["bronchitis treatment cost", "urgent care for cough", "bronchitis doctor visit cost", "bronchitis medication cost"],
    seoDescription: "Bronchitis treatment costs $100-$800. Learn when X-rays and antibiotics are truly needed and how to save on care."
  },
  {
    slug: "stitches-sutures",
    name: "Stitches/Wound Repair",
    category: "Emergency",
    icdCodes: ["S61.009A", "S01.01XA", "T14.8"],
    cptCodes: ["12001", "12002", "12004"],
    description: "Wound repair includes cleaning and suturing (stitches) or using tissue adhesive to close cuts and lacerations. Complexity depends on wound length, depth, and location.",
    symptoms: ["Open wound requiring closure", "Bleeding not controlled by pressure", "Deep cut", "Wound with debris or contamination", "Cosmetic concern"],
    averageCost: { low: 200, median: 500, high: 1500, uninsured: 2500 },
    commonBillingErrors: [
      "Wound length overestimated",
      "Multiple wounds combined incorrectly",
      "Facility fee excessive for minor repair",
      "Wound care supplies overcharged"
    ],
    negotiationTips: [
      "Urgent care is 50-70% cheaper than ER for simple lacerations",
      "Verify wound length matches bill",
      "Ask for itemized supplies breakdown",
      "Follow-up suture removal can be done at primary care"
    ],
    savingsPotential: "$200-$1,500",
    relatedConditions: ["emergency-room-visit", "wound-care", "urgent-care-visit"],
    seoKeywords: ["stitches cost", "sutures cost", "wound repair cost", "how much do stitches cost at ER"],
    seoDescription: "Stitches cost $200-$2,500. Compare ER vs urgent care pricing and learn how wound length affects your bill."
  },
  {
    slug: "carpal-tunnel-surgery",
    name: "Carpal Tunnel Release Surgery",
    category: "Orthopedic",
    icdCodes: ["G56.00", "G56.01", "G56.02"],
    cptCodes: ["64721", "29848"],
    description: "Carpal tunnel release surgery cuts the ligament pressing on the median nerve to relieve numbness, tingling, and weakness in the hand. It can be performed open or endoscopically.",
    symptoms: ["Hand numbness and tingling", "Weakness in hand", "Pain radiating up arm", "Difficulty gripping objects", "Failed conservative treatment"],
    averageCost: { low: 3000, median: 6000, high: 12000, uninsured: 15000 },
    commonBillingErrors: [
      "Endoscopic vs open approach priced differently without explanation",
      "Physical therapy billed separately when included",
      "Bilateral surgery pricing not discounted",
      "Post-operative splint overcharged"
    ],
    negotiationTips: [
      "Office-based or ASC procedures are significantly cheaper",
      "Compare endoscopic vs open surgery recovery and costs",
      "Ask about bilateral pricing if both hands affected",
      "Verify what's included in surgeon's fee"
    ],
    savingsPotential: "$2,000-$8,000",
    relatedConditions: ["hand-surgery", "nerve-release", "orthopedic-surgery"],
    seoKeywords: ["carpal tunnel surgery cost", "carpal tunnel release price", "hand surgery cost", "carpal tunnel treatment cost"],
    seoDescription: "Carpal tunnel surgery costs $3,000-$15,000. Compare open vs endoscopic procedures and facility pricing options."
  },
  {
    slug: "skin-cancer-removal",
    name: "Skin Cancer Removal (Mohs Surgery)",
    category: "Dermatology",
    icdCodes: ["C44.91", "C44.319", "D03.9"],
    cptCodes: ["17311", "17312", "17313"],
    description: "Mohs micrographic surgery removes skin cancer layer by layer, examining each under a microscope until no cancer cells remain. It offers the highest cure rate while preserving healthy tissue.",
    symptoms: ["Diagnosed skin cancer", "Basal cell carcinoma", "Squamous cell carcinoma", "Melanoma in situ", "Recurrent skin cancer"],
    averageCost: { low: 1500, median: 3000, high: 6000, uninsured: 8000 },
    commonBillingErrors: [
      "Each Mohs stage billed at full price when discount should apply",
      "Wound closure billed incorrectly",
      "Pathology fees duplicated",
      "Facility fee for office procedure"
    ],
    negotiationTips: [
      "Mohs is typically office-based - question facility fees",
      "Ask about pricing for multiple stages upfront",
      "Verify reconstruction is covered",
      "Compare Mohs specialist vs dermatologist pricing"
    ],
    savingsPotential: "$500-$3,000",
    relatedConditions: ["skin-biopsy", "melanoma-treatment", "dermatologic-surgery"],
    seoKeywords: ["Mohs surgery cost", "skin cancer removal cost", "skin cancer treatment price", "basal cell carcinoma treatment cost"],
    seoDescription: "Mohs surgery costs $1,500-$8,000. Learn about stage pricing and why this outpatient procedure shouldn't have facility fees."
  },
  {
    slug: "ear-tube-surgery",
    name: "Ear Tube Surgery (Myringotomy)",
    category: "ENT",
    icdCodes: ["H66.90", "H65.90", "H65.91"],
    cptCodes: ["69436", "69433"],
    description: "Ear tube surgery places small tubes through the eardrum to allow air into the middle ear and drain fluid. It's one of the most common pediatric surgeries for recurrent ear infections.",
    symptoms: ["Recurrent ear infections", "Fluid behind eardrum", "Hearing loss from fluid", "Failed antibiotic treatment", "Speech or developmental concerns"],
    averageCost: { low: 2000, median: 4000, high: 8000, uninsured: 10000 },
    commonBillingErrors: [
      "Bilateral procedure not discounted appropriately",
      "Adenoidectomy added without discussion",
      "Anesthesia time overreported for brief procedure",
      "Recovery room charges excessive"
    ],
    negotiationTips: [
      "Ambulatory surgery centers offer significant savings",
      "Verify bilateral pricing includes appropriate discount",
      "Ask if adenoidectomy is truly necessary",
      "Compare pediatric ENT pricing"
    ],
    savingsPotential: "$1,000-$5,000",
    relatedConditions: ["ear-infection-treatment", "tonsillectomy", "pediatric-surgery"],
    seoKeywords: ["ear tube surgery cost", "myringotomy cost", "ear tubes for kids cost", "PE tube insertion price"],
    seoDescription: "Ear tube surgery costs $2,000-$10,000. Learn about ambulatory surgery center savings and bilateral procedure pricing."
  },
  {
    slug: "shoulder-injection",
    name: "Shoulder Cortisone Injection",
    category: "Pain Management",
    icdCodes: ["M75.00", "M75.40", "M19.011"],
    cptCodes: ["20610", "20611", "77002"],
    description: "Cortisone injections deliver anti-inflammatory medication directly into the shoulder joint to reduce pain and inflammation from conditions like arthritis, bursitis, and tendinitis.",
    symptoms: ["Shoulder pain and stiffness", "Bursitis symptoms", "Arthritis flare", "Rotator cuff inflammation", "Limited range of motion"],
    averageCost: { low: 100, median: 300, high: 700, uninsured: 1000 },
    commonBillingErrors: [
      "Image guidance billed when not used",
      "Office visit charged separately",
      "Multiple injection sites billed inappropriately",
      "Medication cost inflated"
    ],
    negotiationTips: [
      "Office injections are much cheaper than hospital",
      "Not all injections require imaging guidance",
      "Ask about package pricing for series of injections",
      "Compare orthopedist vs primary care pricing"
    ],
    savingsPotential: "$100-$500",
    relatedConditions: ["joint-injection", "knee-injection", "pain-management"],
    seoKeywords: ["cortisone shot cost", "shoulder injection cost", "steroid injection price", "cortisone injection price"],
    seoDescription: "Shoulder cortisone injections cost $100-$1,000. Learn when image guidance is necessary and how to find affordable care."
  },
  {
    slug: "kidney-stone-treatment",
    name: "Kidney Stone Treatment",
    category: "Urology",
    icdCodes: ["N20.0", "N20.1", "N20.2"],
    cptCodes: ["52356", "50590", "52352"],
    description: "Kidney stone treatment ranges from observation and medication to procedures like lithotripsy (shock waves) or ureteroscopy (scope removal). Treatment depends on stone size and location.",
    symptoms: ["Severe flank pain", "Blood in urine", "Nausea and vomiting", "Frequent urination", "Pain radiating to groin"],
    averageCost: { low: 5000, median: 12000, high: 25000, uninsured: 35000 },
    commonBillingErrors: [
      "CT scan repeated unnecessarily",
      "Stent placement billed separately when bundled",
      "ER visit level inflated",
      "Lithotripsy facility fees excessive"
    ],
    negotiationTips: [
      "Many stones pass naturally - avoid unnecessary intervention",
      "Compare lithotripsy vs surgical removal costs",
      "Ambulatory surgery centers offer savings",
      "Ask about stent removal costs upfront"
    ],
    savingsPotential: "$2,000-$15,000",
    relatedConditions: ["lithotripsy", "ureteroscopy", "urology-procedures"],
    seoKeywords: ["kidney stone treatment cost", "lithotripsy cost", "kidney stone surgery cost", "kidney stone removal price"],
    seoDescription: "Kidney stone treatment costs $5,000-$35,000 depending on intervention. Compare lithotripsy vs surgery and learn about natural passing."
  },
  {
    slug: "stress-test",
    name: "Cardiac Stress Test",
    category: "Cardiac",
    icdCodes: ["R00.0", "I25.10", "R94.31"],
    cptCodes: ["93015", "93017", "93018"],
    description: "A cardiac stress test measures your heart's response to physical exertion. It can help diagnose coronary artery disease and determine exercise tolerance.",
    symptoms: ["Chest pain during exertion", "Shortness of breath", "Irregular heartbeat", "Pre-surgery evaluation", "Risk factor assessment"],
    averageCost: { low: 200, median: 800, high: 2000, uninsured: 3000 },
    commonBillingErrors: [
      "Nuclear imaging added without explanation",
      "Physician supervision time inflated",
      "EKG billed separately when bundled",
      "Wrong stress test type coded"
    ],
    negotiationTips: [
      "Standard exercise stress test costs less than nuclear",
      "Compare hospital vs cardiology office pricing",
      "Request upfront pricing before scheduling",
      "Verify what's included in the quoted price"
    ],
    savingsPotential: "$300-$1,500",
    relatedConditions: ["cardiac-catheterization", "echocardiogram", "heart-monitoring"],
    seoKeywords: ["stress test cost", "cardiac stress test price", "heart stress test cost", "treadmill test price"],
    seoDescription: "Cardiac stress test costs $200-$3,000. Compare exercise vs nuclear stress tests and find the best pricing."
  },
  {
    slug: "echocardiogram",
    name: "Echocardiogram",
    category: "Cardiac",
    icdCodes: ["I50.9", "I42.9", "R00.0"],
    cptCodes: ["93306", "93307", "93308"],
    description: "An echocardiogram uses ultrasound to create images of your heart's structure and function. It's a non-invasive way to evaluate heart valves, chambers, and blood flow.",
    symptoms: ["Heart murmur", "Shortness of breath", "Chest pain", "Fainting", "Heart failure symptoms"],
    averageCost: { low: 200, median: 700, high: 2000, uninsured: 3000 },
    commonBillingErrors: [
      "Complete vs limited study coding mismatch",
      "Doppler fees added without medical necessity",
      "Facility fee not disclosed",
      "Technical and professional components duplicated"
    ],
    negotiationTips: [
      "Cardiology offices are typically cheaper than hospitals",
      "Ask if Doppler is medically necessary",
      "Get complete pricing upfront",
      "Compare prices at different imaging centers"
    ],
    savingsPotential: "$200-$1,500",
    relatedConditions: ["stress-test", "cardiac-catheterization", "heart-monitoring"],
    seoKeywords: ["echocardiogram cost", "heart ultrasound price", "echo test cost", "cardiac ultrasound cost"],
    seoDescription: "Echocardiogram costs $200-$3,000. Learn about different echo types and how to get fair pricing."
  },
  {
    slug: "thyroid-surgery",
    name: "Thyroid Surgery (Thyroidectomy)",
    category: "Surgical",
    icdCodes: ["E04.2", "C73", "E05.00"],
    cptCodes: ["60240", "60220", "60225"],
    description: "Thyroidectomy is surgical removal of all or part of the thyroid gland. It's performed for thyroid cancer, large goiters, or overactive thyroid that doesn't respond to medication.",
    symptoms: ["Thyroid nodules", "Thyroid cancer", "Hyperthyroidism", "Large goiter", "Difficulty breathing or swallowing"],
    averageCost: { low: 8000, median: 18000, high: 40000, uninsured: 50000 },
    commonBillingErrors: [
      "Partial vs total thyroidectomy coding mismatch",
      "Nerve monitoring fees not disclosed",
      "Pathology fees excessive",
      "Post-operative visits billed separately when bundled"
    ],
    negotiationTips: [
      "Get complete pricing including pathology",
      "Compare experienced surgeons - lower complication rates save money",
      "Ask about outpatient vs inpatient options",
      "Verify what's included in surgeon's global fee"
    ],
    savingsPotential: "$3,000-$20,000",
    relatedConditions: ["parathyroid-surgery", "neck-surgery", "cancer-surgery"],
    seoKeywords: ["thyroid surgery cost", "thyroidectomy price", "thyroid removal cost", "thyroid surgery without insurance"],
    seoDescription: "Thyroid surgery costs $8,000-$50,000. Compare partial vs total thyroidectomy and learn about bundled pricing."
  },
  {
    slug: "hand-surgery",
    name: "Hand Surgery",
    category: "Orthopedic",
    icdCodes: ["S62.90", "M18.1", "M65.30"],
    cptCodes: ["26010", "26055", "26160"],
    description: "Hand surgery treats various conditions including fractures, trigger finger, Dupuytren's contracture, and nerve compression. Many hand surgeries can be done as outpatient procedures.",
    symptoms: ["Hand pain", "Finger catching or locking", "Loss of grip strength", "Numbness in fingers", "Hand deformity"],
    averageCost: { low: 3000, median: 8000, high: 20000, uninsured: 25000 },
    commonBillingErrors: [
      "Anesthesia type misrepresented",
      "Multiple fingers billed at full price",
      "Splinting fees excessive",
      "Post-op visits not included in global period"
    ],
    negotiationTips: [
      "Many hand surgeries can be done in office setting",
      "Ask about local vs general anesthesia options",
      "Get multi-finger discount if applicable",
      "Compare hand surgeon vs orthopedist pricing"
    ],
    savingsPotential: "$1,500-$10,000",
    relatedConditions: ["carpal-tunnel-surgery", "trigger-finger", "fracture-repair"],
    seoKeywords: ["hand surgery cost", "finger surgery price", "trigger finger surgery cost", "hand operation cost"],
    seoDescription: "Hand surgery costs $3,000-$25,000. Learn about outpatient options and multi-finger pricing discounts."
  },
  {
    slug: "shoulder-surgery",
    name: "Shoulder Surgery (Arthroscopy)",
    category: "Orthopedic",
    icdCodes: ["M75.10", "S43.40", "M25.51"],
    cptCodes: ["29805", "29806", "29807"],
    description: "Shoulder arthroscopy is minimally invasive surgery to diagnose and treat shoulder problems. It's used for rotator cuff repairs, labral tears, and impingement syndrome.",
    symptoms: ["Shoulder pain", "Instability", "Limited range of motion", "Catching or locking", "Weakness with overhead activities"],
    averageCost: { low: 8000, median: 20000, high: 40000, uninsured: 55000 },
    commonBillingErrors: [
      "Multiple procedures not properly discounted",
      "Anchor/suture charges inflated",
      "Physical therapy billed during global period",
      "Nerve block billed separately when included"
    ],
    negotiationTips: [
      "Ambulatory surgery centers offer 30-50% savings",
      "Get implant costs upfront",
      "Verify PT is included or separate",
      "Compare total bundled pricing"
    ],
    savingsPotential: "$5,000-$25,000",
    relatedConditions: ["rotator-cuff-repair", "shoulder-injection", "sports-medicine-surgery"],
    seoKeywords: ["shoulder surgery cost", "shoulder arthroscopy price", "labral tear surgery cost", "shoulder impingement surgery"],
    seoDescription: "Shoulder arthroscopy costs $8,000-$55,000. Compare ASC vs hospital pricing and learn about implant costs."
  },
  {
    slug: "bariatric-surgery",
    name: "Bariatric Surgery (Weight Loss Surgery)",
    category: "Surgical",
    icdCodes: ["E66.01", "E66.09", "Z68.41"],
    cptCodes: ["43644", "43645", "43775"],
    description: "Bariatric surgery includes gastric bypass, sleeve gastrectomy, and gastric banding procedures for weight loss. It's typically covered when BMI exceeds 40 or 35 with obesity-related conditions.",
    symptoms: ["BMI over 40", "BMI over 35 with comorbidities", "Failed weight loss attempts", "Obesity-related conditions", "Sleep apnea"],
    averageCost: { low: 15000, median: 25000, high: 45000, uninsured: 60000 },
    commonBillingErrors: [
      "Pre-operative requirements not explained",
      "Nutritionist visits billed when covered",
      "Surgical approach mismatch",
      "Post-operative labs excessive"
    ],
    negotiationTips: [
      "Check if insurance covers bariatric surgery",
      "Compare centers of excellence pricing",
      "Ask about all-inclusive package pricing",
      "Consider medical tourism for self-pay"
    ],
    savingsPotential: "$8,000-$30,000",
    relatedConditions: ["gastric-bypass", "gastric-sleeve", "weight-management"],
    seoKeywords: ["bariatric surgery cost", "weight loss surgery price", "gastric bypass cost", "gastric sleeve cost"],
    seoDescription: "Bariatric surgery costs $15,000-$60,000. Learn about insurance coverage and package pricing options."
  },
  {
    slug: "brain-mri",
    name: "Brain MRI",
    category: "Imaging",
    icdCodes: ["R51", "G43.909", "S06.0X0A"],
    cptCodes: ["70553", "70551", "70552"],
    description: "A brain MRI uses magnetic resonance imaging to create detailed pictures of the brain and surrounding tissues. It can detect tumors, strokes, infections, and other neurological conditions.",
    symptoms: ["Persistent headaches", "Seizures", "Vision changes", "Memory problems", "Dizziness"],
    averageCost: { low: 500, median: 1500, high: 4000, uninsured: 6000 },
    commonBillingErrors: [
      "With and without contrast billed separately",
      "Freestanding center charged at hospital rates",
      "Radiologist interpretation double-billed",
      "Wrong body part coded"
    ],
    negotiationTips: [
      "Freestanding imaging centers are 50-70% cheaper",
      "Ask about cash pay pricing",
      "Verify contrast is needed before adding",
      "Compare prices online before scheduling"
    ],
    savingsPotential: "$400-$3,000",
    relatedConditions: ["mri-scan", "ct-scan", "neurological-imaging"],
    seoKeywords: ["brain MRI cost", "head MRI price", "brain scan cost", "MRI brain without insurance"],
    seoDescription: "Brain MRI costs $500-$6,000. Compare freestanding center vs hospital pricing for significant savings."
  },
  {
    slug: "pet-scan",
    name: "PET Scan",
    category: "Imaging",
    icdCodes: ["C34.90", "C50.919", "Z12.5"],
    cptCodes: ["78815", "78814", "78816"],
    description: "A PET (Positron Emission Tomography) scan uses radioactive tracers to create detailed images showing how organs and tissues function. It's commonly used in cancer diagnosis and staging.",
    symptoms: ["Cancer staging", "Treatment monitoring", "Alzheimer's evaluation", "Cardiac viability assessment", "Infection localization"],
    averageCost: { low: 2500, median: 5000, high: 10000, uninsured: 15000 },
    commonBillingErrors: [
      "PET-CT billed as separate procedures",
      "Radiotracer overcharged",
      "Prior authorization not obtained",
      "Wrong diagnosis code used"
    ],
    negotiationTips: [
      "Ensure prior authorization is obtained first",
      "Compare hospital vs imaging center pricing",
      "Ask if combined PET-CT is available",
      "Verify radiotracer is included in quote"
    ],
    savingsPotential: "$1,500-$7,000",
    relatedConditions: ["ct-scan", "cancer-staging", "nuclear-medicine"],
    seoKeywords: ["PET scan cost", "PET-CT scan price", "cancer scan cost", "PET scan without insurance"],
    seoDescription: "PET scan costs $2,500-$15,000. Learn about combined PET-CT pricing and prior authorization requirements."
  },
  {
    slug: "sinus-surgery",
    name: "Sinus Surgery (FESS)",
    category: "ENT",
    icdCodes: ["J32.4", "J33.8", "J34.2"],
    cptCodes: ["31255", "31256", "31267"],
    description: "Functional Endoscopic Sinus Surgery (FESS) opens blocked sinuses to improve drainage and reduce chronic sinusitis symptoms. It's minimally invasive and usually outpatient.",
    symptoms: ["Chronic sinusitis", "Nasal polyps", "Recurring sinus infections", "Facial pain/pressure", "Impaired smell"],
    averageCost: { low: 5000, median: 12000, high: 25000, uninsured: 35000 },
    commonBillingErrors: [
      "Each sinus billed separately at full price",
      "Image guidance fees excessive",
      "Turbinate reduction added without consent",
      "Post-op packing supplies overcharged"
    ],
    negotiationTips: [
      "Get complete pricing for all affected sinuses",
      "Ask if image guidance is necessary",
      "Compare ENT specialist pricing",
      "Ambulatory surgery centers offer savings"
    ],
    savingsPotential: "$3,000-$15,000",
    relatedConditions: ["tonsillectomy", "septoplasty", "ent-surgery"],
    seoKeywords: ["sinus surgery cost", "FESS cost", "endoscopic sinus surgery price", "sinus polyp removal cost"],
    seoDescription: "Sinus surgery costs $5,000-$35,000. Learn about multi-sinus pricing and image guidance fees."
  },
  {
    slug: "bunion-surgery",
    name: "Bunion Surgery",
    category: "Orthopedic",
    icdCodes: ["M20.10", "M20.11", "M20.12"],
    cptCodes: ["28296", "28292", "28295"],
    description: "Bunion surgery (bunionectomy) corrects the bony bump and realigns the big toe joint. Many different techniques exist, and recovery time varies by procedure type.",
    symptoms: ["Painful bump at big toe base", "Big toe drifting toward other toes", "Swelling and redness", "Difficulty walking", "Shoe fitting problems"],
    averageCost: { low: 3500, median: 8000, high: 18000, uninsured: 25000 },
    commonBillingErrors: [
      "Procedure type doesn't match coding",
      "Hardware fees not disclosed",
      "Bilateral surgery not properly discounted",
      "Post-operative boot overcharged"
    ],
    negotiationTips: [
      "Ask about different surgical approaches and costs",
      "Get hardware costs upfront",
      "Compare outpatient surgery center pricing",
      "Bilateral procedures should have discount"
    ],
    savingsPotential: "$2,000-$10,000",
    relatedConditions: ["foot-surgery", "hammertoe-surgery", "orthopedic-surgery"],
    seoKeywords: ["bunion surgery cost", "bunionectomy price", "bunion removal cost", "foot surgery cost"],
    seoDescription: "Bunion surgery costs $3,500-$25,000. Compare procedure types and get hardware costs upfront."
  }
];

export default medicalConditionsData;
