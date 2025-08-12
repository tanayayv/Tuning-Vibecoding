import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Settings2 } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  tunable?: boolean;
}

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
  onNavigateToAgent?: (agentId: string) => void;
}

export function AgentCard({ agent, compact = false, onNavigateToAgent }: AgentCardProps) {
  const handleClick = () => {
    if (agent.name === "Document Drafting Copilot" && onNavigateToAgent) {
      onNavigateToAgent('docgen');
    }
  };
  if (compact) {
    return (
      <Card className="p-3 hover:shadow-sm transition-shadow cursor-pointer relative bg-white border border-gray-200" onClick={handleClick}>
        {agent.tunable && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-teal-500 to-purple-600 text-white border-0 text-xs px-2 py-0.5 font-medium shadow-sm">
              <Settings2 className="w-2.5 h-2.5 mr-1" />
              Tunable
            </Badge>
          </div>
        )}
        <div className={`w-8 h-8 rounded-lg ${agent.color} flex items-center justify-center mb-2`}>
          <span className="text-lg">{agent.icon}</span>
        </div>
        <h3 className="font-medium text-sm text-gray-900 leading-tight">{agent.name}</h3>
      </Card>
    );
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer relative bg-white border border-gray-200" onClick={handleClick}>
      {agent.tunable && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-teal-500 to-purple-600 text-white border-0 text-xs px-3 py-1 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Settings2 className="w-3 h-3 mr-1" />
            Tunable
          </Badge>
        </div>
      )}
      <div className={`w-10 h-10 rounded-lg ${agent.color} flex items-center justify-center mb-3`}>
        <span className="text-xl">{agent.icon}</span>
      </div>
      <h3 className="font-medium text-base text-gray-900 mb-2 leading-tight">{agent.name}</h3>
      {agent.description && (
        <p className="text-gray-600 text-sm leading-relaxed">{agent.description}</p>
      )}
    </Card>
  );
}