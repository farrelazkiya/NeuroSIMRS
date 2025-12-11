export enum AgentRole {
  HOSPITAL_ADMIN = 'Agent 1: Hospital System (Admin & Billing)',
  PHARMACY = 'Agent 2: Pharmacy & Medication',
  LABORATORY = 'Agent 3: Lab & Diagnostics',
  STAFF_COORD = 'Agent 4: Staff & Resources'
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  diagnosis: string;
  admissionDate: string;
  status: 'Admitted' | 'Discharged' | 'Critical';
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  value: string;
  unit: string;
  isCritical: boolean;
  timestamp: string;
  analysis?: string; // AI generated analysis
}

export interface Bill {
  id: string;
  patientId: string;
  amount: number;
  icdCode: string;
  status: 'Pending' | 'Processed' | 'Insurance_Approved';
  description: string;
}

export interface Medication {
  id: string;
  name: string;
  stock: number;
  unit: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'Doctor' | 'Nurse' | 'Admin';
  currentShift: 'Morning' | 'Afternoon' | 'Night' | 'Off';
  specialty: string;
}

export interface HospitalState {
  patients: Patient[];
  labResults: LabResult[];
  bills: Bill[];
  medications: Medication[];
  staff: Staff[];
  logs: string[]; // Compliance/Audit logs
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  agent?: AgentRole;
  timestamp: Date;
  isToolCall?: boolean;
}