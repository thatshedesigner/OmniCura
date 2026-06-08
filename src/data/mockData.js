export const mock = {
  gene: 'BRCA1',
  confidence: 94,
  biologicalFunction:
    'BRCA1 is a tumor suppressor gene that plays a critical role in DNA double-strand break repair through homologous recombination. It maintains genomic stability and prevents uncontrolled cell division by facilitating accurate DNA repair mechanisms.',
  diseases: [
    'Hereditary breast cancer',
    'Hereditary ovarian cancer',
    'Fallopian tube carcinoma',
    'Prostate cancer (increased risk)',
    'Pancreatic cancer',
  ],
  pathogenicVariants: [
    'c.5266dupC (5382insC)',
    'c.68_69delAG (185delAG)',
    'c.5123C>A (p.Ala1708Glu)',
    'c.4327C>T (p.Arg1443*)',
  ],
  literature: [
    {
      year: 2024,
      journal: 'Nature Medicine',
      finding:
        'PARP inhibitor combinations with immune checkpoint blockade showed synergistic effects in BRCA1-mutated tumors, achieving durable responses in 67% of patients with advanced disease.',
    },
    {
      year: 2023,
      journal: 'Journal of Clinical Oncology',
      finding:
        'Novel platinum-based regimens demonstrated improved overall survival in BRCA1 carriers compared to standard chemotherapy protocols, with a median OS extension of 8.3 months.',
    },
    {
      year: 2023,
      journal: 'Cancer Research',
      finding:
        'CDK12 inhibition creates synthetic lethality in BRCA1-deficient cells by impairing DNA damage response pathways, suggesting new therapeutic combinations.',
    },
    {
      year: 2022,
      journal: 'Cell',
      finding:
        'Single-cell RNA sequencing revealed heterogeneous immune microenvironment in BRCA1-mutated tumors, identifying potential biomarkers for immunotherapy response.',
    },
    {
      year: 2022,
      journal: 'The Lancet Oncology',
      finding:
        'Long-term follow-up of PARP inhibitor maintenance therapy shows sustained benefit at 5 years with manageable toxicity profile in BRCA1/2-mutated ovarian cancer.',
    },
  ],
  drugs: [
    {
      name: 'Olaparib',
      original: 'BRCA-mutated ovarian cancer maintenance',
      proposed: 'BRCA1-positive pancreatic adenocarcinoma',
      mechanism:
        'PARP inhibition leads to synthetic lethality in homologous recombination-deficient cells by preventing single-strand DNA break repair',
    },
    {
      name: 'Veliparib',
      original: 'Investigational PARP inhibitor',
      proposed: 'Triple-negative breast cancer with BRCA1 alterations',
      mechanism:
        'Selective PARP1/2 inhibition combined with DNA-damaging agents enhances cytotoxicity in DNA repair-deficient tumors',
    },
    {
      name: 'Carboplatin',
      original: 'Various solid tumors',
      proposed: 'First-line BRCA1-mutated breast cancer',
      mechanism:
        'Platinum crosslinks DNA, exploiting defective homologous recombination in BRCA1-deficient cells',
    },
  ],
  trials: [
    {
      phase: 'Phase 3',
      status: 'Recruiting',
      location: 'United States',
      name: 'BRCA1-mutated metastatic breast cancer',
      id: 'NCT04171700',
    },
    {
      phase: 'Phase 2',
      status: 'Completed',
      location: 'Germany',
      name: 'BRCA1-positive ovarian cancer',
      id: 'NCT03748641',
    },
    {
      phase: 'Phase 1',
      status: 'Recruiting',
      location: 'United Kingdom',
      name: 'BRCA1 deficient solid tumors',
      id: 'NCT05231070',
    },
  ],
  patents: [
    {
      id: 'US10,751,341',
      title: 'PARP inhibitor combinations for BRCA-mutated cancers',
      status: 'Active',
      year: 2020,
      repurpose: true,
    },
    {
      id: 'EP3,124,041',
      title: 'Synthetic lethality screening methods for DNA repair genes',
      status: 'Active',
      year: 2019,
      repurpose: true,
    },
    {
      id: 'US9,872,864',
      title: 'Original BRCA1 diagnostic compositions',
      status: 'Expired',
      year: 2015,
      repurpose: true,
    },
  ],
  summary: {
    keyFindings: [
      'BRCA1 mutations create therapeutic vulnerability through synthetic lethality with PARP inhibition',
      'Strong evidence supports platinum-based chemotherapy efficacy in BRCA1-deficient tumors',
      'Combination immunotherapy shows promising synergy with DNA damage response inhibitors',
      'Multiple clinical trials actively recruiting for novel therapeutic combinations',
      'Expired patent landscape creates favorable conditions for biosimilar development',
    ],
    recommendation:
      'High confidence recommendation for PARP inhibitor combinations in BRCA1-mutated pancreatic and prostate cancers. Consider carboplatin-based neoadjuvant protocols for triple-negative breast cancer with confirmed BRCA1 pathogenic variants. The synthetic lethality paradigm provides a strong mechanistic rationale for expanded indications.',
    overallConfidence: 89,
  },
}
