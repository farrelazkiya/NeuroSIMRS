import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";

// Initialize Gemini
// NOTE: In a real production app, ensure API_KEY is set in environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Function Declarations ---

const getPatientDataTool: FunctionDeclaration = {
  name: "get_patient_data",
  description: "Agent 1: Retrieve medical records for a specific patient by name or ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      identifier: { type: Type.STRING, description: "Patient Name or ID (e.g., 'P001' or 'Budi')" },
    },
    required: ["identifier"],
  },
};

const createBillingProposalTool: FunctionDeclaration = {
  name: "create_billing_proposal",
  description: "Agent 1 (iDRG): Generate a billing proposal based on diagnosis. Returns ICD-10 code and estimated cost.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      patientId: { type: Type.STRING, description: "The ID of the patient" },
      diagnosis: { type: Type.STRING, description: "The medical diagnosis" },
      intervention: { type: Type.STRING, description: "Treatment or intervention provided" },
    },
    required: ["patientId", "diagnosis"],
  },
};

const checkMedicationStockTool: FunctionDeclaration = {
  name: "check_medication_stock",
  description: "Agent 2: Check current stock levels of a specific medication.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      medicationName: { type: Type.STRING, description: "Name of the drug" },
    },
    required: ["medicationName"],
  },
};

const analyzeCriticalLabTool: FunctionDeclaration = {
  name: "analyze_critical_lab",
  description: "Agent 3: Analyze a patient's latest lab results for critical values and flag them.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      patientId: { type: Type.STRING, description: "Patient ID" },
    },
    required: ["patientId"],
  },
};

const scheduleStaffTool: FunctionDeclaration = {
  name: "schedule_staff",
  description: "Agent 4: Assign a staff member to a specific shift to optimize resources.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      staffName: { type: Type.STRING, description: "Name of the staff member" },
      shift: { type: Type.STRING, description: "Target shift: Morning, Afternoon, Night" },
    },
    required: ["staffName", "shift"],
  },
};

export const tools = [
  getPatientDataTool,
  createBillingProposalTool,
  checkMedicationStockTool,
  analyzeCriticalLabTool,
  scheduleStaffTool
];

export const modelName = "gemini-2.5-flash";

export const systemInstruction = `
You are the NeuroSIMRS Multi-Agent System Orchestrator. You manage a hospital with 4 specialized Agents.
Your goal is to assist the user by delegating tasks to the appropriate agent logic via Function Calls.

AGENTS & ROLES:
- Agent 1 (Hospital System): Handling Admin, EMR, Billing (iDRG), Security.
- Agent 2 (Pharmacy): Medication stock, drug interactions, patient drug history.
- Agent 3 (Laboratory): Lab results, critical value analysis, diagnostics.
- Agent 4 (Resource): Staff scheduling, equipment tracking, shift optimization.

BEHAVIOR:
- When a user asks a question, determine which Agent domain it falls under.
- Use the provided Tools to fetch data or perform actions (simulating the Agent's work).
- If a tool requires an ID (like P001) and the user only gave a name, try to find the patient first or ask for clarification, or use 'get_patient_data' to find the ID.
- Always maintain a professional, clinical tone.
- Mention which Agent is performing the action in your final response (e.g., "Agent 3 has analyzed the results...").
- If the request implies an action (like "Bill this patient" or "Schedule Dr. Smith"), USE THE TOOL. Do not just describe it.

COMPLIANCE:
- Mention "iDRG" when discussing billing.
- Mention "Critical Value Notification" if lab results are dangerous.
- Mention "COBIT DSS06" or "Security by Design" if discussing data access.
`;

export const chatSession = ai.chats.create({
  model: modelName,
  config: {
    systemInstruction,
    tools: [{ functionDeclarations: tools }],
  },
});