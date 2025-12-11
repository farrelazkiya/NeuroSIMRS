import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_STATE } from './constants';
import { HospitalState, ChatMessage, AgentRole } from './types';
import Dashboard from './components/Dashboard';
import ChatMessageBubble from './components/ChatMessageBubble';
import { chatSession } from './services/geminiService';
import { Send, Menu, LayoutDashboard } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [hospitalState, setHospitalState] = useState<HospitalState>(INITIAL_STATE);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: "Hello. I am the **NeuroSIMRS Orchestrator**. I can coordinate Agent 1 (Admin/Billing), Agent 2 (Pharmacy), Agent 3 (Lab), and Agent 4 (Staff) to assist you. \n\nHow can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboardMobile, setShowDashboardMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- TOOL EXECUTION LOGIC ---
  // This function takes the function calls from Gemini and executes them against the React State.
  const executeFunctionCalls = async (functionCalls: any[]) => {
    const responses = [];

    for (const call of functionCalls) {
      const { name, args } = call;
      console.log(`[Agent Execution] Calling ${name} with`, args);
      
      let result: any = { error: "Unknown function" };
      let logMessage = `[EXEC] Unknown tool call: ${name}`;

      try {
        if (name === 'get_patient_data') {
          const search = args.identifier.toLowerCase();
          const patient = hospitalState.patients.find(p => 
            p.id.toLowerCase() === search || p.name.toLowerCase().includes(search)
          );
          if (patient) {
            result = patient;
            logMessage = `[AGENT 1] Accessed EMR for patient ${patient.name}.`;
          } else {
            result = { error: "Patient not found" };
            logMessage = `[AGENT 1] EMR Search failed for '${args.identifier}'.`;
          }
        } 
        
        else if (name === 'create_billing_proposal') {
           // Simulate AI iDRG logic
           const cost = Math.floor(Math.random() * 5000000) + 500000; // Random cost
           const icd = "I10"; // Simplification
           const newBill = {
             id: `B${Date.now()}`,
             patientId: args.patientId,
             amount: cost,
             icdCode: icd,
             status: 'Pending',
             description: `Care for ${args.diagnosis} - ${args.intervention}`
           };
           
           // Update State
           setHospitalState(prev => ({
             ...prev,
             bills: [...prev.bills, newBill as any]
           }));
           
           result = { status: "Proposal Created", billId: newBill.id, amount: cost, icd: icd };
           logMessage = `[AGENT 1 - iDRG] Generated billing proposal for ${args.patientId}. Cost: ${cost}`;
        }

        else if (name === 'check_medication_stock') {
           const med = hospitalState.medications.find(m => m.name.toLowerCase().includes(args.medicationName.toLowerCase()));
           if (med) {
             result = med;
             logMessage = `[AGENT 2] Checked stock for ${med.name}: ${med.stock} remaining.`;
           } else {
             result = { error: "Medication not found" };
             logMessage = `[AGENT 2] Medication '${args.medicationName}' not found in inventory.`;
           }
        }

        else if (name === 'analyze_critical_lab') {
           const labs = hospitalState.labResults.filter(l => l.patientId === args.patientId);
           const critical = labs.filter(l => l.isCritical);
           
           // If critical, simulate an alert system
           if (critical.length > 0) {
             result = { status: "CRITICAL_FOUND", criticalResults: critical, action: "Notify Physician Immediately" };
             logMessage = `[AGENT 3] CRITICAL VALUE ALERT for Patient ${args.patientId}. COBIT DSS06 Alert triggered.`;
           } else {
             result = { status: "Normal", count: labs.length };
             logMessage = `[AGENT 3] Lab analysis for ${args.patientId} normal.`;
           }
        }

        else if (name === 'schedule_staff') {
            const staffIndex = hospitalState.staff.findIndex(s => s.name.toLowerCase().includes(args.staffName.toLowerCase()));
            if (staffIndex >= 0) {
               // Update state
               const updatedStaff = [...hospitalState.staff];
               updatedStaff[staffIndex] = { ...updatedStaff[staffIndex], currentShift: args.shift };
               setHospitalState(prev => ({ ...prev, staff: updatedStaff }));
               
               result = { status: "Scheduled", staff: updatedStaff[staffIndex].name, newShift: args.shift };
               logMessage = `[AGENT 4] Resource Allocation: ${updatedStaff[staffIndex].name} assigned to ${args.shift}.`;
            } else {
               result = { error: "Staff member not found" };
               logMessage = `[AGENT 4] Scheduling failed. Staff '${args.staffName}' not found.`;
            }
        }

        // Add to logs
        setHospitalState(prev => ({ ...prev, logs: [logMessage, ...prev.logs] }));

      } catch (e: any) {
        result = { error: e.message };
      }

      responses.push({
        id: call.id,
        name: call.name,
        response: { result }
      });
    }

    return responses;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Send User Message to Gemini
      let result = await chatSession.sendMessage(userMsg.content);
      
      // 2. Loop for Tool Handling (Function Calling)
      while (result.response.functionCalls && result.response.functionCalls.length > 0) {
          const toolCalls = result.response.functionCalls;
          
          // Show a "System" message indicating work is being done
          const toolNames = toolCalls.map(tc => tc.name).join(', ');
          setMessages(prev => [...prev, {
             id: uuidv4(),
             role: 'system',
             content: `Executing Agents: ${toolNames}...`,
             timestamp: new Date()
          }]);

          // Execute tools locally
          const functionResponses = await executeFunctionCalls(toolCalls);

          const toolResponseParts = functionResponses.map(r => ({
              functionResponse: {
                  name: r.name,
                  response: r.response
              }
          }));
          
          // Send the tool output back to the model
          result = await chatSession.sendMessage(toolResponseParts);
      }

      // 3. Final Text Response
      // FIX: .text is a property, not a method, in the new SDK
      const text = result.response.text;
      
      const botMsg: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        content: text || "I completed the task but have no further comment.", // Fallback if text is undefined
        timestamp: new Date(),
        // Simple logic to guess which agent "spoke" based on content or context
        agent: text && text.includes("Agent 1") ? AgentRole.HOSPITAL_ADMIN 
             : text && text.includes("Agent 2") ? AgentRole.PHARMACY
             : text && text.includes("Agent 3") ? AgentRole.LABORATORY
             : text && text.includes("Agent 4") ? AgentRole.STAFF_COORD
             : undefined
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'system',
        content: `System Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full h-14 bg-white border-b z-20 flex items-center justify-between px-4">
        <h1 className="font-bold text-teal-700">NeuroSIMRS</h1>
        <button onClick={() => setShowDashboardMobile(!showDashboardMobile)} className="p-2 text-gray-600">
           <LayoutDashboard />
        </button>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-full pt-14 md:pt-0 relative transition-all duration-300`}>
        {/* Chat Header (Desktop) */}
        <div className="hidden md:flex h-16 bg-white border-b items-center px-6 justify-between shadow-sm z-10">
           <div>
             <h1 className="text-xl font-bold text-gray-800">NeuroSIMRS <span className="text-teal-600 text-sm font-normal ml-2">Agentic Healthcare System</span></h1>
             <p className="text-xs text-gray-400">Powered by Gemini 2.5 Flash • COBIT 2019 Compliant • Security by Design</p>
           </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 scrollbar-hide">
           {messages.map((msg) => (
             <ChatMessageBubble key={msg.id} message={msg} />
           ))}
           {isLoading && (
             <div className="flex justify-start w-full mb-4 animate-pulse">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce delay-150"></div>
                  <span className="text-xs text-gray-400 ml-2">Agents thinking...</span>
                </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <div className="max-w-4xl mx-auto relative flex items-center gap-2">
            <input
              type="text"
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-3 shadow-sm outline-none transition-all"
              placeholder="Ask the agents (e.g., 'Check Mr. Budi's labs' or 'Bill patient P001')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-gray-400">Agents can perform actions. Try: "Schedule Dr. Hartono for Night shift" or "Create a bill for Budi for Diabetes treatment"</p>
          </div>
        </div>
      </div>

      {/* Dashboard Sidebar (Desktop & Mobile Drawer) */}
      <div className={`
        fixed inset-y-0 right-0 w-80 lg:w-96 bg-gray-50 border-l transform transition-transform duration-300 z-20 shadow-xl md:shadow-none md:relative md:transform-none
        ${showDashboardMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
           <div className="p-4 border-b bg-white flex justify-between items-center md:hidden">
             <h2 className="font-bold">Live State</h2>
             <button onClick={() => setShowDashboardMobile(false)}>✕</button>
           </div>
           <Dashboard state={hospitalState} />
        </div>
      </div>

    </div>
  );
}