import { Search, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AgentCard } from "./AgentCard";

interface AgentStoreProps {
  onNavigateToAgent?: (agentId: string) => void;
}

const yourAgents = [
  {
    id: "1",
    name: "Catch-up",
    icon: "💬",
    color: "bg-blue-100",
    tunable: false
  },
  {
    id: "2", 
    name: "Idea Coach",
    icon: "💡",
    color: "bg-orange-100",
    tunable: true
  },
  {
    id: "3",
    name: "Prompt Coach", 
    icon: "📝",
    color: "bg-purple-100",
    tunable: true
  },
  {
    id: "4",
    name: "Viva Goals",
    icon: "🎯", 
    color: "bg-green-100",
    tunable: false
  },
  {
    id: "5",
    name: "Employee Self-Service",
    icon: "👤",
    color: "bg-blue-100", 
    tunable: false
  },
  {
    id: "6",
    name: "Strategy & Research Agent",
    icon: "📊",
    color: "bg-indigo-100",
    tunable: true
  }
];

const tunableAgents = [
  {
    id: "t1",
    name: "Document Generation",
    description: "Generate professional documents from templates and data",
    icon: "📄",
    color: "bg-blue-100",
    tunable: true
  },
  {
    id: "t2", 
    name: "Document Summarization",
    description: "Extract key insights and create summaries from long documents",
    icon: "📋",
    color: "bg-green-100",
    tunable: true
  },
  {
    id: "t3",
    name: "Expert Q&A",
    description: "Get expert answers to complex questions in your domain",
    icon: "❓",
    color: "bg-purple-100",
    tunable: true
  },
  {
    id: "t4",
    name: "Document Validation", 
    description: "Verify document accuracy and compliance with standards",
    icon: "✅",
    color: "bg-orange-100",
    tunable: true
  }
];

const builtByMicrosoft = [
  {
    id: "7",
    name: "Document Drafting Copilot",
    description: "Generate professional documents faster using your organization's data",
    icon: "�",
    color: "bg-blue-100",
    tunable: true
  },
  {
    id: "8", 
    name: "Analyst",
    description: "Perform complex data analysis over files in a variety of formats",
    icon: "📈",
    color: "bg-pink-100",
    tunable: false
  },
  {
    id: "9",
    name: "Prompt Coach",
    description: "Write and improve your prompts",
    icon: "📝",
    color: "bg-purple-100",
    tunable: true
  },
  {
    id: "10",
    name: "Writing Coach", 
    description: "Take your writing to the next level with Writing Coach",
    icon: "✍️",
    color: "bg-blue-100",
    tunable: true
  },
  {
    id: "11",
    name: "Idea Coach",
    description: "Plan and navigate the brainstorming process",
    icon: "💡",
    color: "bg-orange-100", 
    tunable: true
  },
  {
    id: "12",
    name: "Career Coach",
    description: "Elevate your career with Career Coach",
    icon: "💼",
    color: "bg-teal-100",
    tunable: false
  },
  {
    id: "13",
    name: "Learning Coach",
    description: "Unlock your potential with Learning Coach",
    icon: "📚",
    color: "bg-orange-100",
    tunable: true
  }
];

export function AgentStore({ onNavigateToAgent }: AgentStoreProps = {}) {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-gray-900">Agent Store</h1>
          <p className="text-gray-600 text-sm">Find agents with the expertise to help you complete complex tasks</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create agent
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Search agents" 
          className="pl-10 bg-white border border-gray-200 rounded-md h-10"
        />
      </div>

      {/* Tunable Agents Featured Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Tunable Agents</h2>
            <p className="text-gray-600 text-sm">Agents you can customize to your team's needs with just a few clicks.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tunableAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onNavigateToAgent={onNavigateToAgent} />
          ))}
        </div>
      </div>

      {/* Your agents */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your agents</h2>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
            See more
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {yourAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} compact onNavigateToAgent={onNavigateToAgent} />
          ))}
        </div>
      </div>

      {/* Built by Microsoft */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Built by Microsoft</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {builtByMicrosoft.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onNavigateToAgent={onNavigateToAgent} />
          ))}
        </div>
      </div>
    </div>
  );
}