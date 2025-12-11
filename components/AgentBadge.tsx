import React from 'react';
import { AgentRole } from '../types';

const AgentBadge: React.FC<{ role?: AgentRole | string }> = ({ role }) => {
  if (!role) return null;

  let colorClass = "bg-gray-100 text-gray-800";
  let label = role;

  if (role === AgentRole.HOSPITAL_ADMIN) {
    colorClass = "bg-blue-100 text-blue-800 border border-blue-200";
    label = "Agent 1: Hospital Admin";
  } else if (role === AgentRole.PHARMACY) {
    colorClass = "bg-green-100 text-green-800 border border-green-200";
    label = "Agent 2: Pharmacy";
  } else if (role === AgentRole.LABORATORY) {
    colorClass = "bg-purple-100 text-purple-800 border border-purple-200";
    label = "Agent 3: Diagnostics";
  } else if (role === AgentRole.STAFF_COORD) {
    colorClass = "bg-orange-100 text-orange-800 border border-orange-200";
    label = "Agent 4: Resources";
  }

  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colorClass}`}>
      {label}
    </span>
  );
};

export default AgentBadge;