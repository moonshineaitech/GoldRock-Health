export interface SignificantProtein {
  uniprotId: string;
  name: string;
  gene: string;
  organism: string;
  description: string;
  significanceScore: number;
  categories: string[];
  therapeuticArea?: string;
  mechanism?: string;
  drugTarget?: boolean;
  diseaseAssociation?: string[];
  citations?: number;
}

export interface ProteinCollection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  proteins: SignificantProtein[];
}

export const THERAPEUTIC_TARGETS: SignificantProtein[] = [
  {
    uniprotId: "P00533",
    name: "Epidermal Growth Factor Receptor",
    gene: "EGFR",
    organism: "Human",
    description: "Key oncogene and target for cancer therapies like gefitinib and erlotinib",
    significanceScore: 98,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Receptor Tyrosine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Lung Cancer", "Glioblastoma", "Colorectal Cancer"],
    citations: 45000
  },
  {
    uniprotId: "P04637",
    name: "Tumor Protein p53",
    gene: "TP53",
    organism: "Human",
    description: "The guardian of the genome - most frequently mutated gene in human cancers",
    significanceScore: 99,
    categories: ["oncology", "tumor-suppressor", "transcription-factor"],
    therapeuticArea: "Oncology",
    mechanism: "Transcription Factor",
    drugTarget: true,
    diseaseAssociation: ["Li-Fraumeni Syndrome", "Breast Cancer", "Colorectal Cancer"],
    citations: 120000
  },
  {
    uniprotId: "P35354",
    name: "Prostaglandin G/H Synthase 2",
    gene: "PTGS2/COX-2",
    organism: "Human",
    description: "Target of NSAIDs and selective COX-2 inhibitors for pain and inflammation",
    significanceScore: 95,
    categories: ["inflammation", "enzyme", "drug-target"],
    therapeuticArea: "Inflammation",
    mechanism: "Cyclooxygenase",
    drugTarget: true,
    diseaseAssociation: ["Rheumatoid Arthritis", "Colorectal Cancer", "Cardiovascular Disease"],
    citations: 35000
  },
  {
    uniprotId: "P00734",
    name: "Prothrombin",
    gene: "F2",
    organism: "Human",
    description: "Central to blood coagulation cascade, target for anticoagulant therapies",
    significanceScore: 94,
    categories: ["cardiovascular", "protease", "drug-target"],
    therapeuticArea: "Cardiovascular",
    mechanism: "Serine Protease",
    drugTarget: true,
    diseaseAssociation: ["Thrombosis", "Stroke", "Pulmonary Embolism"],
    citations: 28000
  },
  {
    uniprotId: "P14780",
    name: "Matrix Metalloproteinase-9",
    gene: "MMP9",
    organism: "Human",
    description: "Key enzyme in tissue remodeling, cancer metastasis, and inflammatory diseases",
    significanceScore: 91,
    categories: ["oncology", "protease", "inflammation"],
    therapeuticArea: "Oncology",
    mechanism: "Metalloproteinase",
    drugTarget: true,
    diseaseAssociation: ["Cancer Metastasis", "Rheumatoid Arthritis", "Multiple Sclerosis"],
    citations: 22000
  }
];

export const KINASE_INHIBITOR_TARGETS: SignificantProtein[] = [
  {
    uniprotId: "P00519",
    name: "Tyrosine-protein kinase ABL1",
    gene: "ABL1",
    organism: "Human",
    description: "Target of imatinib (Gleevec) - revolutionized CML treatment",
    significanceScore: 97,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Non-receptor Tyrosine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Chronic Myeloid Leukemia", "Acute Lymphoblastic Leukemia"],
    citations: 38000
  },
  {
    uniprotId: "P15056",
    name: "Serine/threonine-protein kinase B-raf",
    gene: "BRAF",
    organism: "Human",
    description: "Mutated in melanoma; target of vemurafenib and dabrafenib",
    significanceScore: 96,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Serine/Threonine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Melanoma", "Colorectal Cancer", "Thyroid Cancer"],
    citations: 32000
  },
  {
    uniprotId: "P06493",
    name: "Cyclin-dependent kinase 1",
    gene: "CDK1",
    organism: "Human",
    description: "Master regulator of cell cycle, emerging cancer target",
    significanceScore: 93,
    categories: ["oncology", "kinase", "cell-cycle"],
    therapeuticArea: "Oncology",
    mechanism: "Serine/Threonine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Breast Cancer", "Ovarian Cancer", "Leukemia"],
    citations: 18000
  },
  {
    uniprotId: "P42336",
    name: "Phosphatidylinositol 4,5-bisphosphate 3-kinase catalytic subunit alpha",
    gene: "PIK3CA",
    organism: "Human",
    description: "Frequently mutated in solid tumors, target of alpelisib",
    significanceScore: 95,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Lipid Kinase",
    drugTarget: true,
    diseaseAssociation: ["Breast Cancer", "Endometrial Cancer", "Ovarian Cancer"],
    citations: 25000
  }
];

export const GPCR_TARGETS: SignificantProtein[] = [
  {
    uniprotId: "P07550",
    name: "Beta-2 Adrenergic Receptor",
    gene: "ADRB2",
    organism: "Human",
    description: "Target of asthma medications like albuterol and salmeterol",
    significanceScore: 94,
    categories: ["respiratory", "gpcr", "drug-target"],
    therapeuticArea: "Respiratory",
    mechanism: "G Protein-Coupled Receptor",
    drugTarget: true,
    diseaseAssociation: ["Asthma", "COPD", "Cardiac Arrhythmia"],
    citations: 28000
  },
  {
    uniprotId: "P35372",
    name: "Mu-type Opioid Receptor",
    gene: "OPRM1",
    organism: "Human",
    description: "Primary target of morphine and other opioid analgesics",
    significanceScore: 96,
    categories: ["neurology", "gpcr", "drug-target"],
    therapeuticArea: "Neurology/Pain",
    mechanism: "G Protein-Coupled Receptor",
    drugTarget: true,
    diseaseAssociation: ["Chronic Pain", "Opioid Addiction", "Respiratory Depression"],
    citations: 35000
  },
  {
    uniprotId: "P28223",
    name: "5-hydroxytryptamine receptor 2A",
    gene: "HTR2A",
    organism: "Human",
    description: "Serotonin receptor targeted by antipsychotics and psychedelics",
    significanceScore: 92,
    categories: ["psychiatry", "gpcr", "drug-target"],
    therapeuticArea: "Psychiatry",
    mechanism: "G Protein-Coupled Receptor",
    drugTarget: true,
    diseaseAssociation: ["Schizophrenia", "Depression", "Anxiety"],
    citations: 20000
  },
  {
    uniprotId: "P08172",
    name: "Muscarinic Acetylcholine Receptor M2",
    gene: "CHRM2",
    organism: "Human",
    description: "Target for cardiac and respiratory therapeutics",
    significanceScore: 89,
    categories: ["cardiovascular", "gpcr", "drug-target"],
    therapeuticArea: "Cardiovascular",
    mechanism: "G Protein-Coupled Receptor",
    drugTarget: true,
    diseaseAssociation: ["Bradycardia", "Asthma", "Overactive Bladder"],
    citations: 15000
  }
];

export const NEURODEGENERATIVE_TARGETS: SignificantProtein[] = [
  {
    uniprotId: "P05067",
    name: "Amyloid-beta Precursor Protein",
    gene: "APP",
    organism: "Human",
    description: "Central to Alzheimer's disease pathology and drug development",
    significanceScore: 98,
    categories: ["neurology", "amyloid", "disease-target"],
    therapeuticArea: "Neurology",
    mechanism: "Membrane Protein",
    drugTarget: true,
    diseaseAssociation: ["Alzheimer's Disease", "Cerebral Amyloid Angiopathy"],
    citations: 55000
  },
  {
    uniprotId: "P37840",
    name: "Alpha-synuclein",
    gene: "SNCA",
    organism: "Human",
    description: "Key protein in Parkinson's disease and Lewy body dementia",
    significanceScore: 97,
    categories: ["neurology", "aggregation", "disease-target"],
    therapeuticArea: "Neurology",
    mechanism: "Intrinsically Disordered Protein",
    drugTarget: true,
    diseaseAssociation: ["Parkinson's Disease", "Lewy Body Dementia", "Multiple System Atrophy"],
    citations: 42000
  },
  {
    uniprotId: "P10636",
    name: "Microtubule-associated protein tau",
    gene: "MAPT",
    organism: "Human",
    description: "Forms neurofibrillary tangles in Alzheimer's and tauopathies",
    significanceScore: 96,
    categories: ["neurology", "aggregation", "disease-target"],
    therapeuticArea: "Neurology",
    mechanism: "Cytoskeletal Protein",
    drugTarget: true,
    diseaseAssociation: ["Alzheimer's Disease", "Frontotemporal Dementia", "Progressive Supranuclear Palsy"],
    citations: 38000
  },
  {
    uniprotId: "P09936",
    name: "Ubiquitin C-terminal Hydrolase L1",
    gene: "UCHL1",
    organism: "Human",
    description: "Linked to Parkinson's disease and neuronal function",
    significanceScore: 88,
    categories: ["neurology", "enzyme", "disease-target"],
    therapeuticArea: "Neurology",
    mechanism: "Deubiquitinase",
    drugTarget: true,
    diseaseAssociation: ["Parkinson's Disease", "Alzheimer's Disease"],
    citations: 8000
  }
];

export const IMMUNE_CHECKPOINT_TARGETS: SignificantProtein[] = [
  {
    uniprotId: "Q15116",
    name: "Programmed Cell Death 1 Ligand 1",
    gene: "PD-L1/CD274",
    organism: "Human",
    description: "Target of pembrolizumab and atezolizumab - revolutionized cancer immunotherapy",
    significanceScore: 99,
    categories: ["oncology", "immunotherapy", "drug-target"],
    therapeuticArea: "Immuno-Oncology",
    mechanism: "Immune Checkpoint",
    drugTarget: true,
    diseaseAssociation: ["Melanoma", "Lung Cancer", "Bladder Cancer", "Renal Cancer"],
    citations: 48000
  },
  {
    uniprotId: "P16410",
    name: "Cytotoxic T-lymphocyte-associated protein 4",
    gene: "CTLA-4",
    organism: "Human",
    description: "Target of ipilimumab - first approved checkpoint inhibitor",
    significanceScore: 97,
    categories: ["oncology", "immunotherapy", "drug-target"],
    therapeuticArea: "Immuno-Oncology",
    mechanism: "Immune Checkpoint",
    drugTarget: true,
    diseaseAssociation: ["Melanoma", "Renal Cancer", "Lung Cancer"],
    citations: 32000
  },
  {
    uniprotId: "Q9NZQ7",
    name: "Programmed Cell Death 1",
    gene: "PD-1/PDCD1",
    organism: "Human",
    description: "Checkpoint receptor targeted by nivolumab and pembrolizumab",
    significanceScore: 98,
    categories: ["oncology", "immunotherapy", "drug-target"],
    therapeuticArea: "Immuno-Oncology",
    mechanism: "Immune Checkpoint Receptor",
    drugTarget: true,
    diseaseAssociation: ["Melanoma", "Lung Cancer", "Hodgkin Lymphoma"],
    citations: 45000
  }
];

export const INFECTIOUS_DISEASE_TARGETS: SignificantProtein[] = [
  {
    uniprotId: "P0DTC2",
    name: "Spike Glycoprotein",
    gene: "S",
    organism: "SARS-CoV-2",
    description: "Target of COVID-19 vaccines and neutralizing antibodies",
    significanceScore: 99,
    categories: ["infectious", "viral", "vaccine-target"],
    therapeuticArea: "Infectious Disease",
    mechanism: "Viral Surface Protein",
    drugTarget: true,
    diseaseAssociation: ["COVID-19"],
    citations: 85000
  },
  {
    uniprotId: "P0DTD1",
    name: "Replicase Polyprotein 1ab (Nsp5 Main Protease)",
    gene: "ORF1ab",
    organism: "SARS-CoV-2",
    description: "Main protease (Mpro/3CLpro) - target of nirmatrelvir (Paxlovid)",
    significanceScore: 97,
    categories: ["infectious", "viral", "drug-target"],
    therapeuticArea: "Infectious Disease",
    mechanism: "Viral Protease",
    drugTarget: true,
    diseaseAssociation: ["COVID-19"],
    citations: 52000
  },
  {
    uniprotId: "P03372",
    name: "Estrogen Receptor Alpha",
    gene: "ESR1",
    organism: "Human",
    description: "Target of tamoxifen and fulvestrant in breast cancer treatment",
    significanceScore: 95,
    categories: ["oncology", "nuclear-receptor", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Nuclear Hormone Receptor",
    drugTarget: true,
    diseaseAssociation: ["Breast Cancer", "Endometrial Cancer"],
    citations: 38000
  }
];

export const METABOLIC_TARGETS: SignificantProtein[] = [
  {
    uniprotId: "P43220",
    name: "Glucagon-like peptide 1 receptor",
    gene: "GLP1R",
    organism: "Human",
    description: "Target of semaglutide (Ozempic/Wegovy) - blockbuster diabetes and obesity drug",
    significanceScore: 98,
    categories: ["metabolic", "gpcr", "drug-target"],
    therapeuticArea: "Metabolic",
    mechanism: "G Protein-Coupled Receptor",
    drugTarget: true,
    diseaseAssociation: ["Type 2 Diabetes", "Obesity", "Cardiovascular Disease"],
    citations: 28000
  },
  {
    uniprotId: "P17612",
    name: "cAMP-dependent protein kinase catalytic subunit alpha",
    gene: "PRKACA",
    organism: "Human",
    description: "Central to cellular signaling and metabolic regulation",
    significanceScore: 90,
    categories: ["metabolic", "kinase", "signaling"],
    therapeuticArea: "Metabolic",
    mechanism: "Serine/Threonine Kinase",
    drugTarget: false,
    diseaseAssociation: ["Cushing's Syndrome", "Adrenal Tumors"],
    citations: 15000
  },
  {
    uniprotId: "P06858",
    name: "Lipoprotein Lipase",
    gene: "LPL",
    organism: "Human",
    description: "Key enzyme in lipid metabolism and cardiovascular disease",
    significanceScore: 89,
    categories: ["metabolic", "enzyme", "cardiovascular"],
    therapeuticArea: "Cardiovascular",
    mechanism: "Lipase",
    drugTarget: true,
    diseaseAssociation: ["Hypertriglyceridemia", "Coronary Artery Disease"],
    citations: 18000
  }
];

export const STRUCTURAL_BIOLOGY_TARGETS: SignificantProtein[] = [
  {
    uniprotId: "P68871",
    name: "Hemoglobin Subunit Beta",
    gene: "HBB",
    organism: "Human",
    description: "Oxygen transport protein - mutations cause sickle cell disease",
    significanceScore: 96,
    categories: ["hematology", "structural", "disease"],
    therapeuticArea: "Hematology",
    mechanism: "Oxygen Carrier",
    drugTarget: true,
    diseaseAssociation: ["Sickle Cell Disease", "Beta-Thalassemia"],
    citations: 65000
  },
  {
    uniprotId: "P69905",
    name: "Hemoglobin Subunit Alpha",
    gene: "HBA1",
    organism: "Human",
    description: "Alpha chain of hemoglobin tetramer",
    significanceScore: 94,
    categories: ["hematology", "structural"],
    therapeuticArea: "Hematology",
    mechanism: "Oxygen Carrier",
    drugTarget: false,
    diseaseAssociation: ["Alpha-Thalassemia"],
    citations: 45000
  },
  {
    uniprotId: "P02768",
    name: "Serum Albumin",
    gene: "ALB",
    organism: "Human",
    description: "Most abundant blood protein - drug carrier and osmotic regulator",
    significanceScore: 95,
    categories: ["blood", "carrier", "structural"],
    therapeuticArea: "General",
    mechanism: "Transport Protein",
    drugTarget: false,
    diseaseAssociation: ["Hypoalbuminemia", "Liver Disease"],
    citations: 85000
  },
  {
    uniprotId: "P01308",
    name: "Insulin",
    gene: "INS",
    organism: "Human",
    description: "Glucose metabolism regulator - cornerstone of diabetes treatment",
    significanceScore: 99,
    categories: ["metabolic", "hormone", "drug"],
    therapeuticArea: "Metabolic",
    mechanism: "Peptide Hormone",
    drugTarget: true,
    diseaseAssociation: ["Type 1 Diabetes", "Type 2 Diabetes"],
    citations: 150000
  },
  {
    uniprotId: "P01375",
    name: "Tumor Necrosis Factor Alpha",
    gene: "TNF",
    organism: "Human",
    description: "Pro-inflammatory cytokine - target of anti-TNF biologics",
    significanceScore: 98,
    categories: ["inflammation", "cytokine", "drug-target"],
    therapeuticArea: "Immunology",
    mechanism: "Cytokine",
    drugTarget: true,
    diseaseAssociation: ["Rheumatoid Arthritis", "Crohn's Disease", "Psoriasis"],
    citations: 120000
  },
  {
    uniprotId: "P01137",
    name: "Transforming Growth Factor Beta-1",
    gene: "TGFB1",
    organism: "Human",
    description: "Multifunctional cytokine regulating cell growth and differentiation",
    significanceScore: 95,
    categories: ["growth-factor", "fibrosis", "cancer"],
    therapeuticArea: "Oncology",
    mechanism: "Growth Factor",
    drugTarget: true,
    diseaseAssociation: ["Fibrosis", "Cancer", "Autoimmune Disease"],
    citations: 95000
  },
  {
    uniprotId: "P02751",
    name: "Fibronectin",
    gene: "FN1",
    organism: "Human",
    description: "Extracellular matrix glycoprotein involved in cell adhesion",
    significanceScore: 91,
    categories: ["structural", "ecm", "adhesion"],
    therapeuticArea: "General",
    mechanism: "ECM Protein",
    drugTarget: false,
    diseaseAssociation: ["Cancer Metastasis", "Wound Healing"],
    citations: 55000
  },
  {
    uniprotId: "P02671",
    name: "Fibrinogen Alpha Chain",
    gene: "FGA",
    organism: "Human",
    description: "Blood clotting factor - forms fibrin clots",
    significanceScore: 92,
    categories: ["hematology", "coagulation", "structural"],
    therapeuticArea: "Cardiovascular",
    mechanism: "Clotting Factor",
    drugTarget: true,
    diseaseAssociation: ["Thrombosis", "Bleeding Disorders"],
    citations: 42000
  }
];

export const ENZYME_TARGETS: SignificantProtein[] = [
  {
    uniprotId: "P00918",
    name: "Carbonic Anhydrase II",
    gene: "CA2",
    organism: "Human",
    description: "Target of diuretics and glaucoma drugs like acetazolamide",
    significanceScore: 93,
    categories: ["enzyme", "drug-target", "ophthalmology"],
    therapeuticArea: "Ophthalmology",
    mechanism: "Metalloenzyme",
    drugTarget: true,
    diseaseAssociation: ["Glaucoma", "Epilepsy", "Altitude Sickness"],
    citations: 28000
  },
  {
    uniprotId: "P00390",
    name: "Glutathione Reductase",
    gene: "GSR",
    organism: "Human",
    description: "Antioxidant enzyme maintaining cellular redox balance",
    significanceScore: 88,
    categories: ["enzyme", "antioxidant", "redox"],
    therapeuticArea: "General",
    mechanism: "Oxidoreductase",
    drugTarget: false,
    diseaseAssociation: ["Oxidative Stress", "Hemolytic Anemia"],
    citations: 22000
  },
  {
    uniprotId: "P04406",
    name: "Glyceraldehyde-3-phosphate Dehydrogenase",
    gene: "GAPDH",
    organism: "Human",
    description: "Key glycolytic enzyme and moonlighting protein",
    significanceScore: 94,
    categories: ["enzyme", "metabolism", "housekeeping"],
    therapeuticArea: "General",
    mechanism: "Dehydrogenase",
    drugTarget: false,
    diseaseAssociation: ["Cancer", "Neurodegeneration"],
    citations: 150000
  },
  {
    uniprotId: "P00352",
    name: "Retinal Dehydrogenase 1",
    gene: "ALDH1A1",
    organism: "Human",
    description: "Retinoic acid synthesis - cancer stem cell marker",
    significanceScore: 89,
    categories: ["enzyme", "cancer", "development"],
    therapeuticArea: "Oncology",
    mechanism: "Dehydrogenase",
    drugTarget: true,
    diseaseAssociation: ["Cancer", "Alcohol Metabolism"],
    citations: 18000
  }
];

export const POPULAR_MODEL_PROTEINS: SignificantProtein[] = [
  {
    uniprotId: "P0A9Q9",
    name: "Enolase",
    gene: "eno",
    organism: "E. coli",
    description: "Glycolytic enzyme - classic model protein",
    significanceScore: 85,
    categories: ["enzyme", "model", "bacterial"],
    therapeuticArea: "General",
    mechanism: "Lyase",
    drugTarget: false,
    diseaseAssociation: [],
    citations: 15000
  },
  {
    uniprotId: "P00760",
    name: "Trypsin",
    gene: "PRSS1",
    organism: "Bovine",
    description: "Serine protease - classical structural biology model",
    significanceScore: 90,
    categories: ["enzyme", "protease", "model"],
    therapeuticArea: "General",
    mechanism: "Serine Protease",
    drugTarget: true,
    diseaseAssociation: ["Pancreatitis"],
    citations: 45000
  },
  {
    uniprotId: "P00698",
    name: "Lysozyme C",
    gene: "LYZ",
    organism: "Chicken",
    description: "First enzyme structure solved - crystallography landmark",
    significanceScore: 92,
    categories: ["enzyme", "antimicrobial", "model"],
    therapeuticArea: "General",
    mechanism: "Glycosidase",
    drugTarget: false,
    diseaseAssociation: ["Hereditary Amyloidosis"],
    citations: 75000
  },
  {
    uniprotId: "P02754",
    name: "Beta-Lactoglobulin",
    gene: "LGB",
    organism: "Bovine",
    description: "Major whey protein - lipocalin family model",
    significanceScore: 84,
    categories: ["structural", "food", "model"],
    therapeuticArea: "General",
    mechanism: "Lipocalin",
    drugTarget: false,
    diseaseAssociation: ["Milk Allergy"],
    citations: 25000
  },
  {
    uniprotId: "P00441",
    name: "Superoxide Dismutase [Cu-Zn]",
    gene: "SOD1",
    organism: "Human",
    description: "Antioxidant enzyme - mutations cause ALS",
    significanceScore: 96,
    categories: ["enzyme", "antioxidant", "neurodegeneration"],
    therapeuticArea: "Neurology",
    mechanism: "Metalloenzyme",
    drugTarget: true,
    diseaseAssociation: ["Amyotrophic Lateral Sclerosis", "Down Syndrome"],
    citations: 65000
  }
];

export const PROTEIN_COLLECTIONS: ProteinCollection[] = [
  {
    id: "therapeutic",
    title: "Therapeutic Targets",
    description: "High-value drug targets in clinical development",
    icon: "💊",
    color: "#10b981",
    proteins: THERAPEUTIC_TARGETS
  },
  {
    id: "kinases",
    title: "Kinase Inhibitor Targets",
    description: "Key kinases targeted by small molecule inhibitors",
    icon: "⚡",
    color: "#f59e0b",
    proteins: KINASE_INHIBITOR_TARGETS
  },
  {
    id: "gpcr",
    title: "GPCR Drug Targets",
    description: "G protein-coupled receptors - largest drug target family",
    icon: "🔗",
    color: "#8b5cf6",
    proteins: GPCR_TARGETS
  },
  {
    id: "neurodegeneration",
    title: "Neurodegenerative Disease",
    description: "Proteins implicated in Alzheimer's, Parkinson's, and ALS",
    icon: "🧠",
    color: "#ec4899",
    proteins: NEURODEGENERATIVE_TARGETS
  },
  {
    id: "immunotherapy",
    title: "Immune Checkpoints",
    description: "Revolutionary cancer immunotherapy targets",
    icon: "🛡️",
    color: "#06b6d4",
    proteins: IMMUNE_CHECKPOINT_TARGETS
  },
  {
    id: "infectious",
    title: "Infectious Disease",
    description: "Viral and bacterial therapeutic targets",
    icon: "🦠",
    color: "#ef4444",
    proteins: INFECTIOUS_DISEASE_TARGETS
  },
  {
    id: "metabolic",
    title: "Metabolic Disorders",
    description: "Targets for diabetes, obesity, and metabolic syndrome",
    icon: "⚗️",
    color: "#22c55e",
    proteins: METABOLIC_TARGETS
  },
  {
    id: "structural",
    title: "Structural Biology",
    description: "Well-characterized structural models",
    icon: "🏛️",
    color: "#3b82f6",
    proteins: STRUCTURAL_BIOLOGY_TARGETS
  },
  {
    id: "enzymes",
    title: "Enzyme Targets",
    description: "Key enzymes for drug development",
    icon: "🔬",
    color: "#a855f7",
    proteins: ENZYME_TARGETS
  },
  {
    id: "models",
    title: "Popular Model Proteins",
    description: "Classic proteins for structural biology research",
    icon: "📚",
    color: "#64748b",
    proteins: POPULAR_MODEL_PROTEINS
  }
];

export function getAllProteins(): SignificantProtein[] {
  return PROTEIN_COLLECTIONS.flatMap(collection => collection.proteins);
}

export function searchProteins(query: string): SignificantProtein[] {
  const lowerQuery = query.toLowerCase();
  return getAllProteins().filter(protein =>
    protein.name.toLowerCase().includes(lowerQuery) ||
    protein.gene.toLowerCase().includes(lowerQuery) ||
    protein.uniprotId.toLowerCase().includes(lowerQuery) ||
    protein.description.toLowerCase().includes(lowerQuery) ||
    protein.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
  );
}

export function getProteinByUniprotId(uniprotId: string): SignificantProtein | undefined {
  return getAllProteins().find(protein => protein.uniprotId === uniprotId);
}
