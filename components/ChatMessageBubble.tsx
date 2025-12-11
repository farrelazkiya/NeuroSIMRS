import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import AgentBadge from './AgentBadge';
import { Bot, User, BrainCircuit } from 'lucide-react';

interface Props {
  message: ChatMessage;
}

const ChatMessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 text-gray-500 text-xs py-1 px-3 rounded-full flex items-center gap-2">
           <BrainCircuit size={12} /> {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mx-2 ${isUser ? 'bg-indigo-600' : 'bg-teal-600'}`}>
          {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {!isUser && message.agent && <div className="mb-1"><AgentBadge role={message.agent} /></div>}
          
          <div className={`p-3 rounded-2xl shadow-sm text-sm ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
          }`}>
             <ReactMarkdown 
               components={{
                 p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                 ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                 li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                 strong: ({node, ...props}) => <span className="font-semibold text-indigo-700" {...props} />
               }}
             >
               {message.content}
             </ReactMarkdown>
          </div>
          <span className="text-[10px] text-gray-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble;