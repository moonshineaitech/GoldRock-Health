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
  },
  {
    uniprotId: "P11309",
    name: "Serine/threonine-protein kinase pim-1",
    gene: "PIM1",
    organism: "Human",
    description: "Proto-oncogene implicated in lymphoma and leukemia development",
    significanceScore: 88,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Serine/Threonine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Lymphoma", "Leukemia", "Prostate Cancer"],
    citations: 12000
  },
  {
    uniprotId: "P12931",
    name: "Proto-oncogene tyrosine-protein kinase Src",
    gene: "SRC",
    organism: "Human",
    description: "First discovered oncogene, key regulator of cell growth and differentiation",
    significanceScore: 96,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Non-receptor Tyrosine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Colon Cancer", "Breast Cancer", "Pancreatic Cancer"],
    citations: 85000
  },
  {
    uniprotId: "P08581",
    name: "Hepatocyte growth factor receptor",
    gene: "MET",
    organism: "Human",
    description: "Receptor tyrosine kinase driving cancer progression and metastasis",
    significanceScore: 94,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Receptor Tyrosine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Lung Cancer", "Gastric Cancer", "Renal Cancer"],
    citations: 28000
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
  },
  {
    uniprotId: "P24941",
    name: "Cyclin-dependent kinase 2",
    gene: "CDK2",
    organism: "Human",
    description: "Key cell cycle regulator and emerging therapeutic target",
    significanceScore: 92,
    categories: ["oncology", "kinase", "cell-cycle"],
    therapeuticArea: "Oncology",
    mechanism: "Serine/Threonine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Breast Cancer", "Ovarian Cancer"],
    citations: 28000
  },
  {
    uniprotId: "P11362",
    name: "Fibroblast growth factor receptor 1",
    gene: "FGFR1",
    organism: "Human",
    description: "Receptor kinase amplified in breast and lung cancers",
    significanceScore: 90,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Receptor Tyrosine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Breast Cancer", "Lung Cancer", "Bladder Cancer"],
    citations: 18000
  },
  {
    uniprotId: "P17948",
    name: "Vascular endothelial growth factor receptor 1",
    gene: "FLT1/VEGFR1",
    organism: "Human",
    description: "Key angiogenesis regulator and anti-cancer target",
    significanceScore: 91,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Receptor Tyrosine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Solid Tumors", "Macular Degeneration"],
    citations: 22000
  },
  {
    uniprotId: "P35968",
    name: "Vascular endothelial growth factor receptor 2",
    gene: "KDR/VEGFR2",
    organism: "Human",
    description: "Primary mediator of VEGF-induced angiogenesis",
    significanceScore: 94,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Receptor Tyrosine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Cancer", "Age-related Macular Degeneration"],
    citations: 35000
  },
  {
    uniprotId: "P09619",
    name: "Platelet-derived growth factor receptor beta",
    gene: "PDGFRB",
    organism: "Human",
    description: "Target of imatinib in hypereosinophilic syndrome",
    significanceScore: 89,
    categories: ["oncology", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Receptor Tyrosine Kinase",
    drugTarget: true,
    diseaseAssociation: ["GIST", "Dermatofibrosarcoma"],
    citations: 16000
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
  },
  {
    uniprotId: "P21728",
    name: "Dopamine D1 receptor",
    gene: "DRD1",
    organism: "Human",
    description: "Target for Parkinson's disease and schizophrenia therapeutics",
    significanceScore: 90,
    categories: ["neurology", "gpcr", "drug-target"],
    therapeuticArea: "Neurology",
    mechanism: "G Protein-Coupled Receptor",
    drugTarget: true,
    diseaseAssociation: ["Parkinson's Disease", "Schizophrenia", "ADHD"],
    citations: 18000
  },
  {
    uniprotId: "P14416",
    name: "Dopamine D2 receptor",
    gene: "DRD2",
    organism: "Human",
    description: "Primary target of antipsychotic medications",
    significanceScore: 95,
    categories: ["psychiatry", "gpcr", "drug-target"],
    therapeuticArea: "Psychiatry",
    mechanism: "G Protein-Coupled Receptor",
    drugTarget: true,
    diseaseAssociation: ["Schizophrenia", "Parkinson's Disease", "Prolactinoma"],
    citations: 42000
  },
  {
    uniprotId: "P25101",
    name: "Endothelin-1 receptor",
    gene: "EDNRA",
    organism: "Human",
    description: "Target of bosentan for pulmonary arterial hypertension",
    significanceScore: 88,
    categories: ["cardiovascular", "gpcr", "drug-target"],
    therapeuticArea: "Cardiovascular",
    mechanism: "G Protein-Coupled Receptor",
    drugTarget: true,
    diseaseAssociation: ["Pulmonary Hypertension", "Heart Failure"],
    citations: 12000
  },
  {
    uniprotId: "P30556",
    name: "Type-1 angiotensin II receptor",
    gene: "AGTR1",
    organism: "Human",
    description: "Target of ARBs like losartan for hypertension",
    significanceScore: 94,
    categories: ["cardiovascular", "gpcr", "drug-target"],
    therapeuticArea: "Cardiovascular",
    mechanism: "G Protein-Coupled Receptor",
    drugTarget: true,
    diseaseAssociation: ["Hypertension", "Heart Failure", "Diabetic Nephropathy"],
    citations: 28000
  },
  {
    uniprotId: "P25929",
    name: "Neuropeptide Y receptor type 1",
    gene: "NPY1R",
    organism: "Human",
    description: "Involved in appetite regulation and anxiety",
    significanceScore: 85,
    categories: ["neurology", "gpcr", "drug-target"],
    therapeuticArea: "Metabolic",
    mechanism: "G Protein-Coupled Receptor",
    drugTarget: true,
    diseaseAssociation: ["Obesity", "Anxiety", "Hypertension"],
    citations: 8000
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
  },
  {
    uniprotId: "P04156",
    name: "Major prion protein",
    gene: "PRNP",
    organism: "Human",
    description: "Causes Creutzfeldt-Jakob disease when misfolded",
    significanceScore: 94,
    categories: ["neurology", "prion", "disease-target"],
    therapeuticArea: "Neurology",
    mechanism: "Prion Protein",
    drugTarget: true,
    diseaseAssociation: ["Creutzfeldt-Jakob Disease", "Fatal Familial Insomnia", "Kuru"],
    citations: 28000
  },
  {
    uniprotId: "Q99700",
    name: "Ataxin-2",
    gene: "ATXN2",
    organism: "Human",
    description: "Polyglutamine expansion causes spinocerebellar ataxia type 2",
    significanceScore: 86,
    categories: ["neurology", "repeat-expansion", "disease-target"],
    therapeuticArea: "Neurology",
    mechanism: "RNA-binding Protein",
    drugTarget: true,
    diseaseAssociation: ["Spinocerebellar Ataxia Type 2", "ALS"],
    citations: 5000
  },
  {
    uniprotId: "P49768",
    name: "Presenilin-1",
    gene: "PSEN1",
    organism: "Human",
    description: "Gamma-secretase component mutated in early-onset Alzheimer's",
    significanceScore: 95,
    categories: ["neurology", "protease", "disease-target"],
    therapeuticArea: "Neurology",
    mechanism: "Aspartyl Protease",
    drugTarget: true,
    diseaseAssociation: ["Early-onset Alzheimer's Disease"],
    citations: 32000
  },
  {
    uniprotId: "Q16143",
    name: "Beta-secretase 1",
    gene: "BACE1",
    organism: "Human",
    description: "Key enzyme in amyloid-beta production, Alzheimer's drug target",
    significanceScore: 93,
    categories: ["neurology", "protease", "drug-target"],
    therapeuticArea: "Neurology",
    mechanism: "Aspartyl Protease",
    drugTarget: true,
    diseaseAssociation: ["Alzheimer's Disease"],
    citations: 18000
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
  },
  {
    uniprotId: "Q9BZM6",
    name: "T-cell immunoglobulin and mucin domain-containing protein 3",
    gene: "TIM-3/HAVCR2",
    organism: "Human",
    description: "Next-generation immune checkpoint target in clinical trials",
    significanceScore: 88,
    categories: ["oncology", "immunotherapy", "drug-target"],
    therapeuticArea: "Immuno-Oncology",
    mechanism: "Immune Checkpoint",
    drugTarget: true,
    diseaseAssociation: ["Acute Myeloid Leukemia", "Solid Tumors"],
    citations: 8000
  },
  {
    uniprotId: "Q9NQ74",
    name: "Lymphocyte-activation gene 3",
    gene: "LAG-3",
    organism: "Human",
    description: "Emerging immune checkpoint target combined with PD-1 inhibitors",
    significanceScore: 89,
    categories: ["oncology", "immunotherapy", "drug-target"],
    therapeuticArea: "Immuno-Oncology",
    mechanism: "Immune Checkpoint",
    drugTarget: true,
    diseaseAssociation: ["Melanoma", "Solid Tumors"],
    citations: 6000
  },
  {
    uniprotId: "Q9H2W1",
    name: "B and T lymphocyte attenuator",
    gene: "BTLA",
    organism: "Human",
    description: "Inhibitory receptor on lymphocytes",
    significanceScore: 82,
    categories: ["immunology", "checkpoint", "drug-target"],
    therapeuticArea: "Immuno-Oncology",
    mechanism: "Immune Checkpoint",
    drugTarget: true,
    diseaseAssociation: ["Cancer", "Autoimmune Disease"],
    citations: 3000
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
    uniprotId: "P04585",
    name: "HIV-1 Protease",
    gene: "pol",
    organism: "HIV-1",
    description: "Target of protease inhibitors like ritonavir and darunavir",
    significanceScore: 96,
    categories: ["infectious", "viral", "drug-target"],
    therapeuticArea: "Infectious Disease",
    mechanism: "Aspartyl Protease",
    drugTarget: true,
    diseaseAssociation: ["HIV/AIDS"],
    citations: 65000
  },
  {
    uniprotId: "P03366",
    name: "HIV-1 Reverse Transcriptase",
    gene: "pol",
    organism: "HIV-1",
    description: "Target of NRTIs and NNRTIs for HIV treatment",
    significanceScore: 97,
    categories: ["infectious", "viral", "drug-target"],
    therapeuticArea: "Infectious Disease",
    mechanism: "Reverse Transcriptase",
    drugTarget: true,
    diseaseAssociation: ["HIV/AIDS"],
    citations: 75000
  },
  {
    uniprotId: "P04591",
    name: "Envelope glycoprotein gp160",
    gene: "env",
    organism: "HIV-1",
    description: "HIV surface protein and vaccine target",
    significanceScore: 95,
    categories: ["infectious", "viral", "vaccine-target"],
    therapeuticArea: "Infectious Disease",
    mechanism: "Viral Surface Protein",
    drugTarget: true,
    diseaseAssociation: ["HIV/AIDS"],
    citations: 55000
  },
  {
    uniprotId: "P27958",
    name: "NS3 protease",
    gene: "NS3",
    organism: "Hepatitis C virus",
    description: "Target of direct-acting antivirals like simeprevir",
    significanceScore: 94,
    categories: ["infectious", "viral", "drug-target"],
    therapeuticArea: "Infectious Disease",
    mechanism: "Serine Protease",
    drugTarget: true,
    diseaseAssociation: ["Hepatitis C"],
    citations: 32000
  },
  {
    uniprotId: "P26663",
    name: "NS5B RNA-dependent RNA polymerase",
    gene: "NS5B",
    organism: "Hepatitis C virus",
    description: "Target of sofosbuvir - cure for Hepatitis C",
    significanceScore: 96,
    categories: ["infectious", "viral", "drug-target"],
    therapeuticArea: "Infectious Disease",
    mechanism: "RNA Polymerase",
    drugTarget: true,
    diseaseAssociation: ["Hepatitis C"],
    citations: 28000
  },
  {
    uniprotId: "Q9QUN7",
    name: "Neuraminidase",
    gene: "NA",
    organism: "Influenza A",
    description: "Target of oseltamivir (Tamiflu) and zanamivir",
    significanceScore: 93,
    categories: ["infectious", "viral", "drug-target"],
    therapeuticArea: "Infectious Disease",
    mechanism: "Glycosidase",
    drugTarget: true,
    diseaseAssociation: ["Influenza"],
    citations: 42000
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
  },
  {
    uniprotId: "P13569",
    name: "Cystic fibrosis transmembrane conductance regulator",
    gene: "CFTR",
    organism: "Human",
    description: "Ion channel mutated in cystic fibrosis, target of ivacaftor",
    significanceScore: 96,
    categories: ["metabolic", "ion-channel", "drug-target"],
    therapeuticArea: "Respiratory",
    mechanism: "Ion Channel",
    drugTarget: true,
    diseaseAssociation: ["Cystic Fibrosis"],
    citations: 45000
  },
  {
    uniprotId: "Q16850",
    name: "Cytochrome P450 51A1",
    gene: "CYP51A1",
    organism: "Human",
    description: "Target of azole antifungals, key in cholesterol synthesis",
    significanceScore: 88,
    categories: ["metabolic", "enzyme", "drug-target"],
    therapeuticArea: "Infectious Disease",
    mechanism: "Cytochrome P450",
    drugTarget: true,
    diseaseAssociation: ["Fungal Infections"],
    citations: 12000
  },
  {
    uniprotId: "P37231",
    name: "Peroxisome proliferator-activated receptor gamma",
    gene: "PPARG",
    organism: "Human",
    description: "Target of thiazolidinediones for type 2 diabetes",
    significanceScore: 94,
    categories: ["metabolic", "nuclear-receptor", "drug-target"],
    therapeuticArea: "Metabolic",
    mechanism: "Nuclear Receptor",
    drugTarget: true,
    diseaseAssociation: ["Type 2 Diabetes", "Obesity", "NAFLD"],
    citations: 55000
  },
  {
    uniprotId: "P04035",
    name: "HMG-CoA reductase",
    gene: "HMGCR",
    organism: "Human",
    description: "Target of statins - most prescribed cholesterol-lowering drugs",
    significanceScore: 97,
    categories: ["metabolic", "enzyme", "drug-target"],
    therapeuticArea: "Cardiovascular",
    mechanism: "Oxidoreductase",
    drugTarget: true,
    diseaseAssociation: ["Hypercholesterolemia", "Cardiovascular Disease"],
    citations: 65000
  },
  {
    uniprotId: "Q96RI1",
    name: "Sodium-glucose co-transporter 2",
    gene: "SLC5A2/SGLT2",
    organism: "Human",
    description: "Target of gliflozins for diabetes and heart failure",
    significanceScore: 95,
    categories: ["metabolic", "transporter", "drug-target"],
    therapeuticArea: "Metabolic",
    mechanism: "Transporter",
    drugTarget: true,
    diseaseAssociation: ["Type 2 Diabetes", "Heart Failure", "Chronic Kidney Disease"],
    citations: 25000
  },
  {
    uniprotId: "P28482",
    name: "Mitogen-activated protein kinase 1",
    gene: "MAPK1/ERK2",
    organism: "Human",
    description: "Central kinase in RAS-MAPK signaling pathway",
    significanceScore: 93,
    categories: ["signaling", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Serine/Threonine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Cancer", "Inflammatory Disease"],
    citations: 75000
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
  },
  {
    uniprotId: "P02144",
    name: "Myoglobin",
    gene: "MB",
    organism: "Human",
    description: "Oxygen-binding protein in muscle tissue",
    significanceScore: 90,
    categories: ["structural", "oxygen-binding"],
    therapeuticArea: "General",
    mechanism: "Oxygen Storage",
    drugTarget: false,
    diseaseAssociation: ["Myocardial Infarction", "Rhabdomyolysis"],
    citations: 35000
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
  },
  {
    uniprotId: "P09211",
    name: "Glutathione S-transferase Pi",
    gene: "GSTP1",
    organism: "Human",
    description: "Drug metabolism enzyme and cancer biomarker",
    significanceScore: 88,
    categories: ["enzyme", "detoxification", "cancer"],
    therapeuticArea: "Oncology",
    mechanism: "Transferase",
    drugTarget: true,
    diseaseAssociation: ["Cancer", "Drug Resistance"],
    citations: 28000
  },
  {
    uniprotId: "P10145",
    name: "Interleukin-8",
    gene: "CXCL8/IL8",
    organism: "Human",
    description: "Pro-inflammatory chemokine in immune response",
    significanceScore: 92,
    categories: ["cytokine", "inflammation", "immune"],
    therapeuticArea: "Immunology",
    mechanism: "Chemokine",
    drugTarget: true,
    diseaseAssociation: ["Inflammatory Diseases", "Cancer", "COPD"],
    citations: 65000
  },
  {
    uniprotId: "P00492",
    name: "Hypoxanthine-guanine phosphoribosyltransferase",
    gene: "HPRT1",
    organism: "Human",
    description: "Purine salvage enzyme - deficiency causes Lesch-Nyhan syndrome",
    significanceScore: 87,
    categories: ["enzyme", "metabolism", "genetic-disorder"],
    therapeuticArea: "Metabolic",
    mechanism: "Transferase",
    drugTarget: true,
    diseaseAssociation: ["Lesch-Nyhan Syndrome", "Gout"],
    citations: 12000
  },
  {
    uniprotId: "P22303",
    name: "Acetylcholinesterase",
    gene: "ACHE",
    organism: "Human",
    description: "Target of Alzheimer's drugs like donepezil and rivastigmine",
    significanceScore: 94,
    categories: ["enzyme", "neurology", "drug-target"],
    therapeuticArea: "Neurology",
    mechanism: "Hydrolase",
    drugTarget: true,
    diseaseAssociation: ["Alzheimer's Disease", "Myasthenia Gravis"],
    citations: 45000
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
  },
  {
    uniprotId: "P0CG48",
    name: "Ubiquitin",
    gene: "UBB",
    organism: "Human",
    description: "Universal protein tag for degradation and signaling",
    significanceScore: 98,
    categories: ["signaling", "degradation", "model"],
    therapeuticArea: "General",
    mechanism: "Post-translational Modifier",
    drugTarget: false,
    diseaseAssociation: ["Cancer", "Neurodegeneration"],
    citations: 95000
  },
  {
    uniprotId: "P61626",
    name: "Lysozyme C",
    gene: "LYZ",
    organism: "Human",
    description: "Antimicrobial enzyme in tears, saliva, and mucus",
    significanceScore: 88,
    categories: ["enzyme", "antimicrobial", "innate-immunity"],
    therapeuticArea: "Immunology",
    mechanism: "Glycosidase",
    drugTarget: false,
    diseaseAssociation: ["Systemic Amyloidosis"],
    citations: 32000
  },
  {
    uniprotId: "P62937",
    name: "Peptidyl-prolyl cis-trans isomerase A",
    gene: "PPIA",
    organism: "Human",
    description: "Cyclophilin A - target of immunosuppressant cyclosporin",
    significanceScore: 91,
    categories: ["enzyme", "drug-target", "model"],
    therapeuticArea: "Immunology",
    mechanism: "Isomerase",
    drugTarget: true,
    diseaseAssociation: ["Organ Rejection", "HIV Infection"],
    citations: 42000
  }
];

export const ION_CHANNELS: SignificantProtein[] = [
  {
    uniprotId: "P35498",
    name: "Sodium channel protein type 1 subunit alpha",
    gene: "SCN1A",
    organism: "Human",
    description: "Mutations cause Dravet syndrome and epilepsy",
    significanceScore: 94,
    categories: ["neurology", "ion-channel", "drug-target"],
    therapeuticArea: "Neurology",
    mechanism: "Voltage-gated Ion Channel",
    drugTarget: true,
    diseaseAssociation: ["Dravet Syndrome", "Epilepsy", "Migraine"],
    citations: 28000
  },
  {
    uniprotId: "Q12809",
    name: "Potassium voltage-gated channel subfamily H member 2",
    gene: "KCNH2/hERG",
    organism: "Human",
    description: "Cardiac ion channel - key in drug safety screening",
    significanceScore: 95,
    categories: ["cardiovascular", "ion-channel", "safety"],
    therapeuticArea: "Cardiovascular",
    mechanism: "Voltage-gated Ion Channel",
    drugTarget: true,
    diseaseAssociation: ["Long QT Syndrome", "Cardiac Arrhythmia"],
    citations: 35000
  },
  {
    uniprotId: "P17252",
    name: "Protein kinase C alpha type",
    gene: "PRKCA",
    organism: "Human",
    description: "Key signaling kinase in cellular responses",
    significanceScore: 89,
    categories: ["signaling", "kinase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Serine/Threonine Kinase",
    drugTarget: true,
    diseaseAssociation: ["Cancer", "Cardiovascular Disease"],
    citations: 45000
  },
  {
    uniprotId: "P48050",
    name: "Potassium inwardly-rectifying channel subfamily J member 11",
    gene: "KCNJ11",
    organism: "Human",
    description: "ATP-sensitive potassium channel - target for diabetes drugs",
    significanceScore: 92,
    categories: ["metabolic", "ion-channel", "drug-target"],
    therapeuticArea: "Metabolic",
    mechanism: "Inwardly-rectifying K+ Channel",
    drugTarget: true,
    diseaseAssociation: ["Neonatal Diabetes", "Hyperinsulinism"],
    citations: 18000
  },
  {
    uniprotId: "P21817",
    name: "Ryanodine receptor 1",
    gene: "RYR1",
    organism: "Human",
    description: "Calcium release channel in skeletal muscle",
    significanceScore: 90,
    categories: ["muscle", "ion-channel", "disease"],
    therapeuticArea: "Neuromuscular",
    mechanism: "Calcium Release Channel",
    drugTarget: true,
    diseaseAssociation: ["Malignant Hyperthermia", "Central Core Disease"],
    citations: 22000
  },
  {
    uniprotId: "Q13586",
    name: "Stromal interaction molecule 1",
    gene: "STIM1",
    organism: "Human",
    description: "ER calcium sensor regulating store-operated calcium entry",
    significanceScore: 86,
    categories: ["signaling", "calcium", "immune"],
    therapeuticArea: "Immunology",
    mechanism: "Calcium Sensor",
    drugTarget: true,
    diseaseAssociation: ["Immunodeficiency", "Myopathy"],
    citations: 12000
  }
];

export const TRANSCRIPTION_FACTORS: SignificantProtein[] = [
  {
    uniprotId: "P01100",
    name: "Proto-oncogene c-Fos",
    gene: "FOS",
    organism: "Human",
    description: "Immediate early gene product and AP-1 component",
    significanceScore: 93,
    categories: ["oncology", "transcription-factor", "signaling"],
    therapeuticArea: "Oncology",
    mechanism: "Transcription Factor",
    drugTarget: true,
    diseaseAssociation: ["Cancer", "Bone Disease"],
    citations: 65000
  },
  {
    uniprotId: "P05412",
    name: "Transcription factor AP-1",
    gene: "JUN",
    organism: "Human",
    description: "Proto-oncogene forming AP-1 complex with Fos",
    significanceScore: 92,
    categories: ["oncology", "transcription-factor", "signaling"],
    therapeuticArea: "Oncology",
    mechanism: "Transcription Factor",
    drugTarget: true,
    diseaseAssociation: ["Cancer", "Inflammation"],
    citations: 55000
  },
  {
    uniprotId: "P19838",
    name: "Nuclear factor NF-kappa-B p105 subunit",
    gene: "NFKB1",
    organism: "Human",
    description: "Master regulator of inflammation and immune response",
    significanceScore: 97,
    categories: ["immunology", "transcription-factor", "drug-target"],
    therapeuticArea: "Immunology",
    mechanism: "Transcription Factor",
    drugTarget: true,
    diseaseAssociation: ["Inflammatory Diseases", "Cancer", "Autoimmunity"],
    citations: 85000
  },
  {
    uniprotId: "Q00987",
    name: "E3 ubiquitin-protein ligase Mdm2",
    gene: "MDM2",
    organism: "Human",
    description: "p53 inhibitor and cancer therapeutic target",
    significanceScore: 94,
    categories: ["oncology", "e3-ligase", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "E3 Ubiquitin Ligase",
    drugTarget: true,
    diseaseAssociation: ["Cancer", "Li-Fraumeni Syndrome"],
    citations: 48000
  },
  {
    uniprotId: "P40763",
    name: "Signal transducer and activator of transcription 3",
    gene: "STAT3",
    organism: "Human",
    description: "Oncogenic transcription factor in solid tumors",
    significanceScore: 95,
    categories: ["oncology", "transcription-factor", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Transcription Factor",
    drugTarget: true,
    diseaseAssociation: ["Cancer", "Immunodeficiency"],
    citations: 62000
  },
  {
    uniprotId: "Q04206",
    name: "Transcription factor p65",
    gene: "RELA",
    organism: "Human",
    description: "NF-kB subunit essential for inflammatory response",
    significanceScore: 94,
    categories: ["immunology", "transcription-factor", "drug-target"],
    therapeuticArea: "Immunology",
    mechanism: "Transcription Factor",
    drugTarget: true,
    diseaseAssociation: ["Inflammatory Diseases", "Cancer"],
    citations: 58000
  },
  {
    uniprotId: "P10276",
    name: "Retinoic acid receptor alpha",
    gene: "RARA",
    organism: "Human",
    description: "Nuclear receptor involved in differentiation therapy for leukemia",
    significanceScore: 91,
    categories: ["oncology", "nuclear-receptor", "drug-target"],
    therapeuticArea: "Oncology",
    mechanism: "Nuclear Receptor",
    drugTarget: true,
    diseaseAssociation: ["Acute Promyelocytic Leukemia"],
    citations: 28000
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
  },
  {
    id: "ion-channels",
    title: "Ion Channels",
    description: "Membrane proteins critical for electrical signaling",
    icon: "⚡",
    color: "#0ea5e9",
    proteins: ION_CHANNELS
  },
  {
    id: "transcription-factors",
    title: "Transcription Factors",
    description: "Gene expression regulators and oncogenic drivers",
    icon: "🧬",
    color: "#f43f5e",
    proteins: TRANSCRIPTION_FACTORS
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

export function getTopProteins(count: number = 8): SignificantProtein[] {
  return getAllProteins()
    .sort((a, b) => b.significanceScore - a.significanceScore)
    .slice(0, count);
}
