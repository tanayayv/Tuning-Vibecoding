import { useState } from 'react';
import { FileText, ExternalLink, CheckCircle, AlertCircle, Loader2, MessageSquare, PanelRightOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type ProcessingState = 'idle' | 'processing' | 'completed' | 'notified';
type ChatMessage = {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  isDraft?: boolean;
  isNotification?: boolean;
  timestamp: Date;
  modelUsed?: string;
};

type EditorMode = 'closed' | 'word' | 'pages';

type ModelInfo = {
  id: string;
  name: string;
  displayName: string;
  isTuned: boolean;
  description: string;
  provider: string;
  modelType: string;
  author: string;
  domain?: string;
  capabilities?: string[];
  limitations?: string[];
};

type ComparisonMode = 'single' | 'comparison';

export function DocumentGenerationAgent() {
  const [inputValue, setInputValue] = useState('');
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('closed');
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('phi-3-mini');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('single');
  const [comparisonOutputs, setComparisonOutputs] = useState<{standard: string | null, tuned: string | null}>({standard: null, tuned: null});
  const [showModelSuggestion, setShowModelSuggestion] = useState(false);
  const [isFirstTimeMultiModel, setIsFirstTimeMultiModel] = useState(true);

  // Available models with enhanced metadata
  const availableModels: ModelInfo[] = [
    {
      id: 'phi-3-mini',
      name: 'Phi-3-mini',
      displayName: 'Phi-3-mini',
      isTuned: false,
      description: 'Great for efficient text generation in low latency scenarios',
      provider: 'Microsoft Research',
      modelType: 'Lightweight foundational model',
      author: 'Microsoft',
      capabilities: ['General document creation', 'Basic formatting', 'Template application'],
      limitations: ['Limited domain expertise', 'Generic outputs']
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      displayName: 'GPT-4 Turbo',
      isTuned: false,
      description: 'Advanced language model for complex document generation tasks',
      provider: 'OpenAI',
      modelType: 'Large language model',
      author: 'OpenAI',
      capabilities: ['Complex document creation', 'Advanced reasoning', 'Multi-format outputs'],
      limitations: ['Higher latency', 'Resource intensive']
    },
    {
      id: 'legal-gpt4-tuned',
      name: 'Legal Document Generation',
      displayName: 'Legal Document Generation (Tuned)',
      isTuned: true,
      description: 'Optimized for drafting principal agreements with consistent legal language and clause structures',
      provider: 'Microsoft',
      modelType: 'Fine-tuned GPT-4.1',
      author: 'Microsoft CELA',
      domain: 'Legal',
      capabilities: ['Legal document creation', 'Contract clauses', 'Compliance language', 'Risk assessment'],
      limitations: ['Limited to legal domain', 'Requires legal review']
    },
    {
      id: 'prd-tuned',
      name: 'PRD Model',
      displayName: 'PRD Model (Fine-tuned)',
      isTuned: true,
      description: 'Specialized for creating comprehensive Product Requirements Documents with technical specifications',
      provider: 'Microsoft',
      modelType: 'Fine-tuned GPT-4',
      author: 'Product Team',
      domain: 'Product Management',
      capabilities: ['PRD creation', 'Feature specifications', 'Technical requirements', 'User story mapping'],
      limitations: ['Product domain focused', 'Requires product context']
    }
  ];

  // Document generation flow for M365 Copilot
  const generateDocument = async (prompt: string, modelId: string = selectedModel) => {
    setProcessingState('processing');
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Add model change indicator if switching models
    const currentModel = availableModels.find(m => m.id === modelId);
    if (modelId !== 'phi-3-mini') {
      const modelChangeMessage: ChatMessage = {
        id: `model-change-${Date.now()}`,
        type: 'system',
        content: `(Now using ${currentModel?.displayName})`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelChangeMessage]);
    }

    // Immediate canned response
    const cannedResponse: ChatMessage = {
      id: `canned-${Date.now()}`,
      type: 'agent',
      content: `Thanks Tanaya. You can either start a new chat or wait while I generate this document using the ${currentModel?.displayName}.\nThis may take some time, but you will receive a notification once it's ready.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, cannedResponse]);

    // Show notification in activity feed
    setTimeout(() => {
      setShowNotification(true);
      setProcessingState('notified');
    }, 2000);

    // Simulate document generation time
    setTimeout(async () => {
      const generatedDoc = await generateMockDocument(modelId);
      setCurrentDocument(generatedDoc);
      
      const completionMessage: ChatMessage = {
        id: `completion-${Date.now()}`,
        type: 'agent',
        content: generatedDoc,
        isDraft: true,
        timestamp: new Date(),
        modelUsed: modelId
      };
      
      setMessages(prev => [...prev, completionMessage]);
      setProcessingState('completed');
      setShowNotification(false);
    }, 8000);
  };

  // Generate mock document based on template and edits
  const generateMockDocument = async (modelId: string = 'phi-3-mini'): Promise<string> => {
    const isLegalTuned = modelId === 'legal-gpt4-tuned';
    const isPrdTuned = modelId === 'prd-tuned';
    
    if (isLegalTuned) {
      return `# Legal Service Agreement Template

## PARTIES AND EFFECTIVE DATE
This Legal Service Agreement ("Agreement") is entered into on [DATE] by and between:

**CLIENT:** [Client Company Name], a [State] corporation with principal offices at [Address]

**SERVICE PROVIDER:** [Provider Company Name], a [State] [Entity Type] with principal offices at [Address]

## SCOPE OF LEGAL SERVICES
### 2.1 Services Provided
The Service Provider agrees to provide the following legal services ("Services"):
- Contract review and negotiation
- Legal compliance consultation
- Risk assessment and mitigation strategies
- Regulatory compliance guidance
- Document preparation and review

### 2.2 Service Standards
All Services shall be performed in accordance with:
- Applicable state and federal laws
- Professional standards of the legal profession
- Client's documented requirements and specifications
- Industry best practices for legal service delivery

## COMPENSATION AND PAYMENT TERMS
### 3.1 Fee Structure
- Hourly Rate: $[AMOUNT] per hour for partner-level work
- Associate Rate: $[AMOUNT] per hour for associate-level work
- Paralegal Rate: $[AMOUNT] per hour for paralegal work
- Retainer: $[AMOUNT] due upon execution of this Agreement

### 3.2 Payment Terms
- Invoices rendered monthly within 10 days of month-end
- Payment due within 30 days of invoice date
- Late payment penalty: 1.5% per month on outstanding balances
- Client responsible for reasonable collection costs

## CONFIDENTIALITY AND ATTORNEY-CLIENT PRIVILEGE
### 4.1 Confidentiality Obligations
Both parties acknowledge that confidential information may be disclosed during the performance of this Agreement. Each party agrees to:
- Maintain strict confidentiality of all proprietary information
- Limit access to authorized personnel only
- Return or destroy confidential materials upon termination

### 4.2 Attorney-Client Privilege
The parties acknowledge that communications between Client and Service Provider may be protected by attorney-client privilege and work product doctrine.

## LIMITATION OF LIABILITY
### 5.1 Service Provider Liability
SERVICE PROVIDER'S LIABILITY SHALL BE LIMITED TO THE AMOUNT OF FEES PAID BY CLIENT IN THE 12 MONTHS PRECEDING THE CLAIM. IN NO EVENT SHALL SERVICE PROVIDER BE LIABLE FOR CONSEQUENTIAL, INCIDENTAL, OR PUNITIVE DAMAGES.

### 5.2 Professional Liability Insurance
Service Provider maintains professional liability insurance with minimum coverage of $[AMOUNT] per claim.

## TERMINATION
### 6.1 Termination Rights
Either party may terminate this Agreement:
- With 30 days written notice for convenience
- Immediately for material breach following 10-day cure period
- Immediately upon insolvency or bankruptcy of either party

### 6.2 Post-Termination Obligations
Upon termination:
- Service Provider shall complete work in progress (subject to payment)
- All confidential information shall be returned or destroyed
- Outstanding fees become immediately due and payable

## GOVERNING LAW AND DISPUTE RESOLUTION
This Agreement shall be governed by [State] law. Any disputes shall be resolved through binding arbitration in accordance with [Arbitration Rules].

**SIGNATURES:**

Client: ___________________ Date: _________
[Name], [Title]

Service Provider: ___________________ Date: _________
[Name], [Title]

*This legal document template was generated using the Legal Document Generation (Tuned) model, incorporating specialized legal language, standard clauses, and compliance requirements appropriate for professional service agreements.*`;
    }
    
    if (isPrdTuned) {
      return `# Product Requirements Document (PRD)

## 1. EXECUTIVE SUMMARY

### Product Overview
**Product Name:** [Product Name]  
**Version:** 1.0  
**Release Date:** Q1 2026  
**Product Owner:** [Product Owner Name]  
**Document Version:** 1.0  
**Last Updated:** ${new Date().toLocaleDateString()}

### Vision Statement
This product aims to [define the core vision and value proposition]. The solution addresses critical market needs by [key benefits and differentiation].

### Success Metrics
- **User Adoption:** 10,000+ active users within 6 months
- **Revenue Impact:** $2M ARR by end of Year 1  
- **User Satisfaction:** NPS score >40
- **Performance:** <2s page load time, 99.9% uptime

---

## 2. PRODUCT CONTEXT

### Problem Statement
**Current Pain Points:**
- Users struggle with [specific problem 1]
- Existing solutions lack [capability gap]
- Market opportunity exists for [opportunity description]

**Market Opportunity:**
- Total Addressable Market (TAM): $500M
- Serviceable Addressable Market (SAM): $50M
- Target market segment: [specific segment]

### Competitive Landscape
**Direct Competitors:**
- **Competitor A:** Strong in [area], weak in [area]
- **Competitor B:** Market leader but lacks [differentiation]

**Competitive Advantages:**
- Unique value proposition: [USP]
- Technical differentiation: [technical advantage]
- Go-to-market advantage: [GTM advantage]

---

## 3. USER PERSONAS & USE CASES

### Primary Persona: [Persona Name]
**Demographics:**
- Role: [Job Title]
- Company Size: [Size range]
- Industry: [Industry type]
- Experience Level: [Experience]

**Goals & Motivations:**
- Primary goal: [main objective]
- Success criteria: [how they measure success]
- Current workflow: [existing process]

**Pain Points:**
- Frustration 1: [specific pain point]
- Frustration 2: [specific pain point]
- Time spent on manual tasks: [time estimate]

### Key Use Cases
**Use Case 1: [Primary Use Case]**
- **Actor:** [User type]
- **Trigger:** [What initiates this use case]
- **Flow:** [Step-by-step process]
- **Success Criteria:** [Expected outcome]

**Use Case 2: [Secondary Use Case]**
- **Actor:** [User type]
- **Trigger:** [What initiates this use case]
- **Flow:** [Step-by-step process]
- **Success Criteria:** [Expected outcome]

---

## 4. FUNCTIONAL REQUIREMENTS

### Core Features (MVP)

#### Feature 1: [Core Feature Name]
**Description:** [Detailed feature description]
**User Story:** As a [user type], I want to [action] so that [benefit]
**Acceptance Criteria:**
- Given [condition], when [action], then [expected result]
- Given [condition], when [action], then [expected result]
- Performance requirement: [specific performance criteria]

#### Feature 2: [Core Feature Name]
**Description:** [Detailed feature description]
**User Story:** As a [user type], I want to [action] so that [benefit]
**Acceptance Criteria:**
- Given [condition], when [action], then [expected result]
- Given [condition], when [action], then [expected result]

#### Feature 3: [Integration Feature]
**Description:** [Integration requirements]
**APIs Required:** [List of APIs/services]
**Data Flow:** [How data flows between systems]

### Advanced Features (Post-MVP)
- **Feature A:** [Advanced capability 1]
- **Feature B:** [Advanced capability 2]
- **Feature C:** [Advanced capability 3]

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance Requirements
- **Response Time:** <2 seconds for 95% of requests
- **Throughput:** Support 1,000 concurrent users
- **Scalability:** Handle 10x traffic growth
- **Availability:** 99.9% uptime (8.77 hours downtime/year)

### Security Requirements
- **Authentication:** Multi-factor authentication (MFA)
- **Authorization:** Role-based access control (RBAC)
- **Data Encryption:** AES-256 encryption at rest and in transit
- **Compliance:** SOC 2 Type II, GDPR compliance
- **Audit Logging:** Comprehensive audit trail

### Usability Requirements
- **Accessibility:** WCAG 2.1 AA compliance
- **Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Support:** Responsive design for tablets and smartphones
- **Localization:** Support for English, Spanish, French

### Technical Requirements
- **Database:** PostgreSQL with read replicas
- **Hosting:** Cloud-native (AWS/Azure)
- **APIs:** RESTful APIs with OpenAPI documentation
- **Monitoring:** Application performance monitoring (APM)

---

## 6. USER EXPERIENCE (UX) REQUIREMENTS

### Design Principles
- **Simplicity:** Minimize cognitive load
- **Consistency:** Consistent UI patterns across features
- **Accessibility:** Inclusive design for all users
- **Responsiveness:** Fast, responsive interactions

### Key User Flows
**Onboarding Flow:**
1. Account creation/login
2. Profile setup and preferences
3. Feature introduction tour
4. First successful task completion

**Core Workflow:**
1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]
4. Confirmation and next steps

### UI/UX Specifications
- **Design System:** Use [Design System Name]
- **Component Library:** [Component library]
- **Accessibility:** Screen reader support, keyboard navigation
- **Error Handling:** Clear error messages with suggested actions

---

## 7. TECHNICAL ARCHITECTURE

### System Architecture
**Frontend:**
- Framework: [React/Vue/Angular]
- State Management: [Redux/Vuex/NgRx]
- Build Tool: [Webpack/Vite]

**Backend:**
- Runtime: [Node.js/Python/Java]
- Framework: [Express/Django/Spring]
- Database: [PostgreSQL/MySQL/MongoDB]
- Cache: [Redis/Memcached]

**Infrastructure:**
- Cloud Provider: [AWS/Azure/GCP]
- Container: Docker + Kubernetes
- CI/CD: [GitHub Actions/GitLab CI]
- Monitoring: [Datadog/New Relic]

### Data Model
**Core Entities:**
- **User:** id, email, profile, preferences, created_at
- **Product:** id, name, description, metadata, created_at
- **Activity:** id, user_id, action_type, timestamp, metadata

### Third-Party Integrations
- **Payment Processing:** Stripe/PayPal
- **Analytics:** Google Analytics/Mixpanel
- **Communication:** SendGrid/Twilio
- **Authentication:** Auth0/Firebase Auth

---

## 8. PROJECT TIMELINE & MILESTONES

### Development Phases

**Phase 1: Foundation (Weeks 1-4)**
- Technical architecture setup
- Core authentication and user management
- Basic UI framework implementation
- Database schema and initial migrations

**Phase 2: Core Features (Weeks 5-12)**
- Feature 1 implementation and testing
- Feature 2 implementation and testing
- API development and documentation
- Integration testing

**Phase 3: Advanced Features (Weeks 13-20)**
- Advanced feature implementation
- Performance optimization
- Security hardening
- User acceptance testing

**Phase 4: Launch Preparation (Weeks 21-24)**
- Production environment setup
- Load testing and performance tuning
- Documentation completion
- Launch readiness review

### Key Milestones
- **Week 4:** Technical foundation complete
- **Week 8:** Alpha version (internal testing)
- **Week 16:** Beta version (limited external testing)
- **Week 20:** Release candidate
- **Week 24:** General availability (GA)

---

## 9. RISK ASSESSMENT & MITIGATION

### Technical Risks
**High Priority:**
- **Risk:** Third-party API dependency failure
- **Impact:** Core functionality unavailable
- **Mitigation:** Implement fallback mechanisms and circuit breakers

**Medium Priority:**
- **Risk:** Performance bottlenecks under load
- **Impact:** Poor user experience
- **Mitigation:** Load testing and horizontal scaling architecture

### Business Risks
- **Market Risk:** Competitive product launch
- **Mitigation:** Accelerated feature development and unique differentiation
- **Resource Risk:** Key team member departure
- **Mitigation:** Knowledge documentation and cross-training

---

## 10. SUCCESS CRITERIA & MEASUREMENT

### Launch Metrics
- **Technical:** 99.9% uptime, <2s response time
- **User Adoption:** 1,000 signups in first month
- **User Engagement:** 60% weekly active users
- **Business:** $100K ARR within 6 months

### Long-term Success Metrics
- **User Growth:** 10,000+ active users by month 12
- **Revenue:** $2M ARR by end of Year 1
- **Market Position:** Top 3 in target market segment
- **Customer Satisfaction:** NPS >40, CSAT >4.5

### Monitoring & Analytics
- **Product Analytics:** User behavior tracking, feature adoption
- **Performance Monitoring:** Application and infrastructure metrics
- **Business Metrics:** Revenue, conversion rates, customer acquisition

---

## 11. APPENDICES

### Appendix A: User Research Summary
[Summary of user interviews, surveys, and usability testing]

### Appendix B: Technical Specifications
[Detailed API documentation, database schemas, architecture diagrams]

### Appendix C: Competitive Analysis
[Detailed competitor feature comparison and market positioning]

### Appendix D: Legal & Compliance Requirements
[Privacy policy requirements, terms of service, regulatory compliance]

---

*This PRD was generated using the PRD Model (Fine-tuned) specifically optimized for comprehensive product requirement documentation with technical specifications and business context.*`;
    }
    
    // Default model output (Phi-3-mini or GPT-4 Turbo)
    return `# Marketing Strategy Document

## Executive Summary
This document outlines our comprehensive marketing strategy for Q4 2025, incorporating feedback from the executive team and market analysis data.

## Objectives
- Increase brand awareness by 25%
- Drive lead generation with 40% improvement
- Expand market presence in APAC region
- Launch new product line with integrated campaign

## Target Audience
**Primary Segments:**
- Enterprise customers (500+ employees)
- Technology decision makers
- C-suite executives in Fortune 1000

**Secondary Segments:**
- Mid-market businesses
- Industry influencers
- Partner ecosystem

## Campaign Strategy
### Digital Marketing
- SEO optimization and content marketing
- Social media engagement across LinkedIn, Twitter
- Targeted advertising on industry publications
- Webinar series featuring thought leadership

### Traditional Marketing
- Industry conference participation
- Print advertising in trade publications
- Direct mail campaigns for enterprise prospects
- Partnership marketing initiatives

## Budget Allocation
- Digital Marketing: $850K (60%)
- Events & Conferences: $340K (24%)
- Traditional Marketing: $170K (12%)
- Marketing Operations: $85K (4%)

**Total Budget:** $1.445M

## Timeline
**Phase 1 (Oct-Nov):** Campaign launch and initial execution
**Phase 2 (Nov-Dec):** Optimization and scaling
**Phase 3 (Jan):** Performance analysis and planning for Q1

## Success Metrics
- Lead generation: 2,500 qualified leads
- Website traffic: 40% increase
- Brand awareness: 25% improvement in surveys
- Customer acquisition cost: 15% reduction

## Risk Mitigation
- Market volatility contingency plans
- Budget flexibility for high-performing channels
- Alternative messaging for different market conditions

*This document was generated by applying strategic edits to the base marketing template, incorporating current market data and organizational objectives.*`;
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      generateDocument(inputValue);
      setInputValue('');
    }
  };

  const handlePromptClick = (promptText: string) => {
    setInputValue(promptText);
    
    // Show model suggestion for PRD content
    if (promptText.toLowerCase().includes('prd') || promptText.toLowerCase().includes('product requirement')) {
      setShowModelSuggestion(true);
    }
    
    generateDocument(promptText);
    setInputValue('');
  };

  // Handle model selection and generation
  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setIsFirstTimeMultiModel(false);
    setShowModelSuggestion(false);
  };

  // Handle comparison mode
  const handleCompareModels = async () => {
    setComparisonMode('comparison');
    
    // Generate outputs for both models
    const currentOutput = await generateMockDocument(selectedModel);
    const alternativeModelId = selectedModel === 'phi-3-mini' ? 'prd-tuned' : 'phi-3-mini';
    const alternativeOutput = await generateMockDocument(alternativeModelId);
    
    setComparisonOutputs({
      standard: selectedModel === 'phi-3-mini' ? currentOutput : alternativeOutput,
      tuned: selectedModel !== 'phi-3-mini' ? currentOutput : alternativeOutput
    });
  };

  // Handle selecting version from comparison
  const handleSelectVersion = (modelId: string) => {
    setSelectedModel(modelId);
    setComparisonMode('single');
  };

  // Handle notification click
  const handleNotificationClick = () => {
    setShowNotification(false);
  };

  // Model selector component
  const ModelSelector = () => (
    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Model:</span>
          <select 
            value={selectedModel}
            onChange={(e) => handleModelSelect(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.displayName}
              </option>
            ))}
          </select>
          {isFirstTimeMultiModel && availableModels.length > 1 && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              New: Compare outputs!
            </span>
          )}
        </div>
        {availableModels.length > 1 && (
          <button className="text-xs text-gray-500 hover:text-gray-700">
            ℹ️ Model Info
          </button>
        )}
      </div>
      
      {selectedModel && (
        <p className="text-xs text-gray-600">
          {availableModels.find(m => m.id === selectedModel)?.description}
        </p>
      )}
    </div>
  );

  // Model suggestion component
  const ModelSuggestion = () => (
    showModelSuggestion && (
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <span className="text-amber-600">💡</span>
          <div className="flex-1">
            <p className="text-sm text-amber-800">
              <strong>Suggested:</strong> Try the PRD Model for more specialized PRD creation.
            </p>
            <button 
              onClick={() => handleModelSelect('prd-tuned')}
              className="mt-2 text-xs text-amber-700 underline hover:text-amber-900"
            >
              Use this model
            </button>
          </div>
          <button 
            onClick={() => setShowModelSuggestion(false)}
            className="text-amber-600 hover:text-amber-800"
          >
            ×
          </button>
        </div>
      </div>
    )
  );

  // Comparison view component
  const ComparisonView = () => (
    comparisonMode === 'comparison' && comparisonOutputs.standard && comparisonOutputs.tuned && (
      <div className="grid grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Standard Model Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-t-lg">
            <h3 className="font-medium text-gray-900">Standard Model</h3>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Default</span>
          </div>
          <div className="border border-gray-200 rounded-b-lg p-4 bg-white max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-900 leading-relaxed">
              {comparisonOutputs.standard}
            </pre>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleSelectVersion('standard')}
              variant="outline"
              className="flex-1"
            >
              Use this version
            </Button>
            <Button variant="ghost" size="sm">👍</Button>
            <Button variant="ghost" size="sm">👎</Button>
          </div>
        </div>

        {/* Tuned Model Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-t-lg">
            <h3 className="font-medium text-gray-900">PRD Model</h3>
            <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">Tuned</span>
          </div>
          <div className="border border-blue-200 rounded-b-lg p-4 bg-white max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-900 leading-relaxed">
              {comparisonOutputs.tuned}
            </pre>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleSelectVersion('prd-tuned')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Use this version
            </Button>
            <Button variant="ghost" size="sm">👍</Button>
            <Button variant="ghost" size="sm">👎</Button>
          </div>
        </div>
      </div>
    )
  );

  const openInWord = () => {
    // Simulate Microsoft Graph API integration
    window.open('about:blank', '_blank');
    setTimeout(() => {
      alert('Document opened in Microsoft Word Online\n\nThe document is now available for editing with full Word capabilities.');
    }, 500);
  };

  const openInPages = () => {
    setEditorMode('pages');
  };

  const closeEditor = () => {
    setEditorMode('closed');
  };

  // Activity notification component (Left side)
  const ActivityNotification = () => (
    <div className="fixed top-20 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm">Copilot ++ (Tuning)</h4>
          <p className="text-gray-600 text-xs mt-1">Document Generation in Progress</p>
          <Button 
            variant="link" 
            className="p-0 h-auto text-blue-600 text-xs mt-2"
            onClick={handleNotificationClick}
          >
            Go to Conversation
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-auto"
          onClick={handleNotificationClick}
        >
          ×
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Activity Notification - Left Side */}
      {showNotification && <ActivityNotification />}
      
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Copilot Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <img 
                src="/copilot-logo.svg" 
                alt="M365 Copilot" 
                className="w-6 h-6"
              />
            </div>
            <span className="font-semibold text-gray-900">M365 Copilot</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="relative">
            <Input 
              placeholder="Search" 
              className="pl-8 bg-gray-50 border-gray-200"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Chat Section */}
          <div className="p-2">
            <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
              <MessageSquare className="w-4 h-4 mr-3" />
              <span className="text-sm">Chat</span>
            </div>
          </div>

          {/* Agents Section */}
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2 text-gray-500">
              <span className="text-xs font-medium uppercase tracking-wide">Agents</span>
              <span className="text-xs">▼</span>
            </div>
            
            {/* Agent List */}
            <div className="space-y-1">
              <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                <span className="text-gray-400 mr-3">🔍</span>
                <span className="text-sm">Researcher</span>
              </div>
              <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                <span className="text-gray-400 mr-3">📊</span>
                <span className="text-sm">Analyst</span>
              </div>
              <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                <span className="text-gray-400 mr-3">💬</span>
                <span className="text-sm">Catch-up</span>
              </div>
              <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                <span className="text-gray-400 mr-3">💡</span>
                <span className="text-sm">Idea Coach</span>
              </div>
              <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                <span className="text-gray-400 mr-3">📝</span>
                <span className="text-sm">Prompt Coach</span>
              </div>
              <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                <span className="text-gray-400 mr-3">🎯</span>
                <span className="text-sm">Viva Goals</span>
              </div>
              <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                <span className="text-gray-400 mr-3">👤</span>
                <span className="text-sm">Employee Self-Service</span>
              </div>
              <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                <span className="text-gray-400 mr-3">📈</span>
                <span className="text-sm">Strategy & Research Agent</span>
              </div>
              <div className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded cursor-pointer">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-3">
                  <FileText className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium">Copilot ++ (Tuning)</span>
              </div>
            </div>
          </div>

          {/* All agents link */}
          <div className="p-2">
            <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
              <span className="text-sm">All agents</span>
            </div>
            <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
              <span className="text-sm">Create agent</span>
            </div>
          </div>

          {/* Conversations Section */}
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2 text-gray-500">
              <span className="text-xs font-medium uppercase tracking-wide">Conversations</span>
              <span className="text-xs">▼</span>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">UI/UX Design Planning for ML...</div>
              <div className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">AI Experts and Contacts in Red...</div>
              <div className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">Visualizing Three Milestones F...</div>
              <div className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">Marketing Proposal for TP Cap...</div>
              <div className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">Marketing Proposal Request U...</div>
            </div>
            <div className="px-3 py-2 text-blue-600 text-sm hover:bg-gray-100 rounded cursor-pointer">
              All conversations
            </div>
          </div>

          {/* Pages Section */}
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2 text-gray-500">
              <span className="text-xs font-medium uppercase tracking-wide">Pages</span>
              <span className="text-xs">▼</span>
            </div>
          </div>

          {/* Notebooks Section */}
          <div className="p-2">
            <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
              <span className="text-sm">📓 Notebooks</span>
            </div>
          </div>

          {/* Create Section */}
          <div className="p-2">
            <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
              <span className="text-sm">🧪 Create</span>
            </div>
          </div>

          {/* Apps Section */}
          <div className="p-2">
            <div className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
              <span className="text-sm">📱 Apps</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between mt-4 pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <span className="text-sm font-medium">Tanaya Yadav</span>
            </div>
            <span className="text-gray-400">⋯</span>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 ${editorMode === 'pages' ? 'mr-1/2' : ''}`}>
        {/* Main Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Copilot ++ (Tuning)</h1>
            </div>
            <p className="text-sm text-gray-500">Created by Copilot Tuning</p>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="px-6 py-8 flex flex-col items-center">
          {/* Initial Prompt Area */}
          {messages.length === 0 && (
            <div className="text-center mb-8 max-w-2xl">
              <div className="mb-8">
                <h2 className="text-lg text-gray-600 mb-8">Message Copilot</h2>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-6 mb-8 w-full max-w-4xl">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200'
                } rounded-lg p-4 shadow-sm`}>
                  {message.type === 'user' ? (
                    <p className="text-sm">{message.content}</p>
                  ) : message.isDraft ? (
                    /* Document Output with Actions */
                    <div className="space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-900 leading-relaxed">
                          {message.content}
                        </pre>
                      </div>
                      
                      {/* Document Action Buttons */}
                      <div className="flex space-x-3 pt-4 border-t border-gray-100">
                        <Button 
                          onClick={openInWord}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in Word
                        </Button>
                        <Button 
                          onClick={openInPages}
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <PanelRightOpen className="w-4 h-4 mr-2" />
                          Edit in Pages
                        </Button>

                        {/* Compare Models Button */}
                        {availableModels.length > 1 && comparisonMode === 'single' && (
                          <Button 
                            onClick={handleCompareModels}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            📊 Compare with {selectedModel === 'standard' ? 'PRD Model' : 'Standard Model'}
                          </Button>
                        )}
                      </div>

                      {/* Document Info */}
                      <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <p className="text-xs text-gray-600">Document generated from /template with edits from /edits</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900 whitespace-pre-line">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Processing State */}
            {processingState === 'processing' && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-900">Processing your request...</p>
                      <p className="text-xs text-gray-500">Applying edits to template</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification State */}
            {processingState === 'notified' && (
              <div className="flex justify-start">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-900">Document generation in progress</p>
                      <p className="text-xs text-gray-500">You'll receive a notification when ready</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Model Suggestion */}
          <ModelSuggestion />

          {/* Comparison View */}
          <ComparisonView />

          {/* Input Area */}
          <div className="w-full max-w-4xl">
            {/* Model Selector */}
            <ModelSelector />
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Message Copilot"
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                    disabled={processingState === 'processing' || processingState === 'notified'}
                    className="border-0 bg-transparent focus:ring-0 text-base resize-none min-h-[60px]"
                    style={{ minHeight: '60px' }}
                  />
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">0</span>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!inputValue.trim() || processingState === 'processing' || processingState === 'notified'}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 p-0 rounded-full"
                    >
                      ➤
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prompt Suggestion */}
            {messages.length === 0 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handlePromptClick("Using /PRD_Template and /NewFeatureSpec, create a draft Product Requirements Document")}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-100 transition-colors max-w-md"
                >
                  <div className="text-sm text-gray-700">
                    Using /PRD_Template and /NewFeatureSpec, create a draft Product Requirements Document
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pages Editor Panel (Right Side) */}
      {editorMode === 'pages' && (
        <div className="fixed right-0 top-0 w-1/2 h-full bg-white border-l border-gray-200 shadow-lg z-40">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Pages Editor</h3>
            <Button variant="ghost" size="sm" onClick={closeEditor}>
              ×
            </Button>
          </div>
          <div className="p-4 h-full overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                <Input value="Marketing Strategy Document" className="w-full" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea 
                  className="w-full h-96 p-3 border border-gray-200 rounded-md text-sm font-mono"
                  value={currentDocument || ''}
                  onChange={(e) => setCurrentDocument(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
                <Button variant="outline" className="flex-1">
                  Export to Word
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
