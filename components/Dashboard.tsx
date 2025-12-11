import React from 'react';
import { HospitalState } from '../types';
import { Users, Activity, CreditCard, Pill, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  state: HospitalState;
}

const Dashboard: React.FC<Props> = ({ state }) => {
  
  // Data processing for charts
  const patientStats = [
    { name: 'Admitted', value: state.patients.filter(p => p.status === 'Admitted').length, color: '#3b82f6' },
    { name: 'Critical', value: state.patients.filter(p => p.status === 'Critical').length, color: '#ef4444' },
    { name: 'Discharged', value: state.patients.filter(p => p.status === 'Discharged').length, color: '#10b981' },
  ];

  const medicationLowStock = state.medications.filter(m => m.stock < 100);

  return (
    <div className="space-y-6 h-full overflow-y-auto p-2 scrollbar-hide">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Hospital Overview</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center gap-1">
          <ShieldCheck size={12} /> Live
        </span>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users size={16} /> <span className="text-xs font-medium">Patients</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{state.patients.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <CreditCard size={16} /> <span className="text-xs font-medium">Pending Bills</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{state.bills.filter(b => b.status === 'Pending').length}</div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Patient Status</h3>
        <div className="h-40 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie 
                 data={patientStats} 
                 innerRadius={40} 
                 outerRadius={60} 
                 paddingAngle={5} 
                 dataKey="value"
               >
                 {patientStats.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
               </Pie>
               <Tooltip />
             </PieChart>
           </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-3 text-xs text-gray-500 mt-2">
          {patientStats.map(s => (
            <div key={s.name} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
              {s.name} ({s.value})
            </div>
          ))}
        </div>
      </div>

      {/* Critical Lists */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
           <Activity size={16} className="text-red-500"/> Critical Lab Results
         </h3>
         <div className="space-y-2">
           {state.labResults.filter(l => l.isCritical).map(l => {
             const patient = state.patients.find(p => p.id === l.patientId);
             return (
               <div key={l.id} className="p-2 bg-red-50 rounded-lg border border-red-100 text-xs">
                 <div className="font-semibold text-red-800">{patient?.name || l.patientId}</div>
                 <div className="text-red-600">{l.testName}: {l.value} {l.unit}</div>
               </div>
             );
           })}
           {state.labResults.filter(l => l.isCritical).length === 0 && (
             <div className="text-xs text-gray-400 italic">No critical values.</div>
           )}
         </div>
      </div>

      {/* Medication Alerts */}
      {medicationLowStock.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
             <Pill size={16} className="text-orange-500"/> Low Stock Alert
           </h3>
           <div className="space-y-2">
             {medicationLowStock.map(m => (
               <div key={m.id} className="flex justify-between items-center text-xs p-2 bg-orange-50 rounded border border-orange-100">
                 <span className="font-medium text-gray-700">{m.name}</span>
                 <span className="font-bold text-orange-600">{m.stock} {m.unit}</span>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Logs */}
      <div className="bg-gray-800 p-3 rounded-lg text-[10px] font-mono text-green-400 h-32 overflow-y-auto">
        <div className="mb-1 text-gray-400 font-bold border-b border-gray-700 pb-1">SYSTEM LOGS & COMPLIANCE</div>
        {state.logs.map((log, i) => (
           <div key={i} className="mb-1 opacity-80">&gt; {log}</div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;