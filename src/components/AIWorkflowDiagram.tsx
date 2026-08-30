import React, { useState } from 'react';
import { 
  Radar, 
  Filter, 
  Tags, 
  FileText, 
  BarChart3, 
  Send, 
  ChevronRight,
  Database,
  Cpu,
  Layers,
  LayoutDashboard
} from 'lucide-react';

export const AIWorkflowDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      step: 1,
      name: 'Detect',
      desc: 'Real-time monitoring of clinical trials, regulatory filings, & literature',
      icon: <Radar size={16} color="#0F9B8E" />,
      detail: 'Scans 15+ automated data sources every 15 minutes including ClinicalTrials.gov, FDA FAERS, PubMed, and EMA releases.'
    },
    {
      step: 2,
      name: 'Preprocess & Extract',
      desc: 'Deduplication, noise filtering, & entity extraction',
      icon: <Filter size={16} color="#2E5FDB" />,
      detail: 'Normalizes unstructured clinical data, removes duplicate wire reports, and extracts structured trial design parameters.'
    },
    {
      step: 3,
      name: 'Classify',
      desc: 'Categorize into Clinical, Regulatory, Safety, or Market',
      icon: <Tags size={16} color="#7C4DFF" />,
      detail: 'Domain-trained Haemophilia NLP classifier maps signals to specific therapeutic categories and Haemophilia types (A, B, VWD).'
    },
    {
      step: 4,
      name: 'Summarize',
      desc: 'Generate concise, evidence-backed executive summary',
      icon: <FileText size={16} color="#F59E0B" />,
      detail: 'Produces a 2-3 sentence plain-language strategic rationale ("Why it matters") for executive decision makers.'
    },
    {
      step: 5,
      name: 'Score',
      desc: 'Multi-factor score (0-100) across 6 strategic vectors',
      icon: <BarChart3 size={16} color="#DC2626" />,
      detail: 'Evaluates Source Reliability (/20), Clinical Significance (/20), Competitive (/20), Market (/20), Regulatory (/10), and Novelty (/10).'
    },
    {
      step: 6,
      name: 'Route',
      desc: 'Automated routing to functional leads & action teams',
      icon: <Send size={16} color="#16A34A" />,
      detail: 'Tags relevant departments (Medical Affairs, Regulatory, Safety, R&D) and triggers high-priority alerts for critical signals.'
    }
  ];

  return (
    <div className="workflow-section">
      <div className="card-title" style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="#2E5FDB" />
          <span>AI Intelligence Engine Workflow</span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#7C4DFF', background: 'rgba(124, 77, 255, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
          Autonomous Pipeline
        </span>
      </div>

      <p style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '16px' }}>
        Continuous 6-stage transformation from unstructured global web & clinical data into actionable strategic signals:
      </p>

      {/* 6 Step Interactive Horizontal Workflow */}
      <div className="workflow-steps-container">
        {steps.map((s) => (
          <div 
            key={s.step} 
            className={`workflow-step-card ${activeStep === s.step ? 'active' : ''}`}
            onMouseEnter={() => setActiveStep(s.step)}
            onMouseLeave={() => setActiveStep(null)}
            style={{
              borderColor: activeStep === s.step ? '#2E5FDB' : '#E2E8F0',
              backgroundColor: activeStep === s.step ? '#FFFFFF' : '#F8FAFC'
            }}
          >
            <div className="workflow-step-num">{s.step}</div>
            <div style={{ marginBottom: '4px' }}>{s.icon}</div>
            <div className="workflow-step-name">{s.name}</div>
            <div className="workflow-step-desc">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Step Detail Explanation box when hovered */}
      {activeStep && (
        <div style={{
          marginTop: '12px',
          padding: '10px 14px',
          backgroundColor: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#0369A1'
        }}>
          <strong>Stage {activeStep} Detail:</strong> {steps.find(s => s.step === activeStep)?.detail}
        </div>
      )}

      {/* Underlying Pipeline Concept */}
      <div style={{
        marginTop: '18px',
        paddingTop: '14px',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '11.5px',
        color: '#64748B',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontWeight: 700, color: '#334155' }}>Underlying Pipeline Architecture:</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Database size={12} /> Data Sources</span>
        <ChevronRight size={12} />
        <span>Ingestion</span>
        <ChevronRight size={12} />
        <span>Preprocess</span>
        <ChevronRight size={12} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#2E5FDB' }}><Cpu size={12} /> AI Engine</span>
        <ChevronRight size={12} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Layers size={12} /> Knowledge Store</span>
        <ChevronRight size={12} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#0F9B8E' }}><LayoutDashboard size={12} /> Executive Radar</span>
      </div>
    </div>
  );
};
