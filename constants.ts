import { HospitalState } from './types';

export const INITIAL_STATE: HospitalState = {
  patients: [
    { id: 'P001', name: 'Budi Santoso', age: 45, gender: 'M', diagnosis: 'Type 2 Diabetes', admissionDate: '2023-10-25', status: 'Admitted' },
    { id: 'P002', name: 'Siti Aminah', age: 62, gender: 'F', diagnosis: 'Hypertension Crisis', admissionDate: '2023-10-26', status: 'Critical' },
    { id: 'P003', name: 'Andi Pratama', age: 28, gender: 'M', diagnosis: 'Dengue Fever', admissionDate: '2023-10-27', status: 'Admitted' },
  ],
  labResults: [
    { id: 'L001', patientId: 'P001', testName: 'HbA1c', value: '8.5', unit: '%', isCritical: true, timestamp: '2023-10-25 09:00' },
    { id: 'L002', patientId: 'P002', testName: 'Blood Pressure', value: '180/110', unit: 'mmHg', isCritical: true, timestamp: '2023-10-26 14:30' },
  ],
  bills: [
    { id: 'B001', patientId: 'P001', amount: 1500000, icdCode: 'E11.9', status: 'Pending', description: 'Initial Care & Insulin' },
  ],
  medications: [
    { id: 'M001', name: 'Metformin', stock: 500, unit: 'tabs' },
    { id: 'M002', name: 'Insulin Glargine', stock: 45, unit: 'pens' },
    { id: 'M003', name: 'Paracetamol', stock: 1200, unit: 'tabs' },
    { id: 'M004', name: 'Amlodipine', stock: 300, unit: 'tabs' },
  ],
  staff: [
    { id: 'S001', name: 'Dr. Hartono', role: 'Doctor', currentShift: 'Morning', specialty: 'Internal Medicine' },
    { id: 'S002', name: 'Ns. Rina', role: 'Nurse', currentShift: 'Morning', specialty: 'ICU' },
    { id: 'S003', name: 'Dr. Sarah', role: 'Doctor', currentShift: 'Off', specialty: 'Cardiology' },
  ],
  logs: [
    "[SYSTEM] Security by Design: Initialized Encrypted Data Store.",
    "[AUDIT] COBIT APO02: Strategy alignment check passed.",
  ]
};