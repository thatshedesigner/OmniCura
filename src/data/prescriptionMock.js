export const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='

export const SAMPLE_EXTRACT = {
  drugs: [
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', confidence: 97 },
    { name: 'Warfarin', dosage: '5mg', frequency: 'Once daily', confidence: 94 },
    { name: 'Aspirin', dosage: '100mg', frequency: 'Once daily', confidence: 91 },
    { name: 'Omeprazole', dosage: '20mg', frequency: 'Before meals', confidence: 88 },
    { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', confidence: 85 },
  ],
  prescriber: 'Dr. Sample',
  date: null,
  rawText: 'Sample OCR text for prescription image.'
}

export const INTERACTION_DB = [
  {
    drugs: ['warfarin', 'ibuprofen'],
    severity: 'critical',
    type: 'Anticoagulant Potentiation + GI Risk',
    significance: 'NSAIDs inhibit platelet aggregation and displace warfarin from plasma proteins, significantly increasing bleeding risk.',
    recommendation: 'Avoid concurrent use; substitute Ibuprofen with Acetaminophen under physician review.'
  },
  {
    drugs: ['warfarin', 'aspirin'],
    severity: 'critical',
    type: 'Dual Antiplatelet + Anticoagulant Synergy',
    significance: 'Combined use substantially increases hemorrhagic stroke and major GI bleed risk.',
    recommendation: 'Only co-prescribe if benefit clearly outweighs risk; reduce INR target range.'
  },
  {
    drugs: ['warfarin', 'naproxen'],
    severity: 'critical',
    type: 'Anticoagulant Potentiation',
    significance: 'Naproxen potentiates anticoagulant effect of warfarin, increasing major bleed risk.',
    recommendation: 'Avoid combination; use Acetaminophen for analgesia.'
  },
  {
    drugs: ['metformin', 'omeprazole'],
    severity: 'moderate',
    type: 'Renal Transporter Competition',
    significance: 'Omeprazole inhibits OCT1/OCT2 transporters, modestly increasing Metformin plasma levels.',
    recommendation: 'Monitor renal function quarterly; no adjustment needed if eGFR >60.'
  },
  {
    drugs: ['ssri', 'tramadol'],
    severity: 'severe',
    type: 'Serotonin Syndrome Risk',
    significance: 'Concurrent serotonergic agents increase risk of serotonin syndrome.',
    recommendation: 'Monitor for agitation, hyperthermia, tachycardia; consider dose reduction.'
  },
  {
    drugs: ['lisinopril', 'potassium'],
    severity: 'severe',
    type: 'Hyperkalemia Risk',
    significance: 'ACE inhibitors reduce aldosterone, increasing potassium retention.',
    recommendation: 'Monitor serum potassium levels every 3 months.'
  },
  {
    drugs: ['simvastatin', 'amlodipine'],
    severity: 'moderate',
    type: 'CYP3A4 Inhibition',
    significance: 'Amlodipine inhibits simvastatin metabolism, increasing myopathy risk.',
    recommendation: 'Cap simvastatin dose at 20mg/day when co-administered with amlodipine.'
  }
]
