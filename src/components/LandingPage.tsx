import React, { useState } from 'react';
import { UserSession } from '../types';
import { 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Database, 
  Zap, 
  Lock, 
  User, 
  Mail, 
  Key, 
  Compass,
  FileText,
  AlertCircle
} from 'lucide-react';

interface LandingPageProps {
  onLogin: (session: UserSession) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState<string>('aris.thorne@biopharm.global');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [name, setName] = useState<string>('Dr. Aris Thorne');
  const [error, setError] = useState<string | null>(null);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your organizational email.');
      return;
    }
    const session: UserSession = {
      name: name.trim() || 'Dr. Aris Thorne',
      email: email.trim(),
      role: 'Head of Medical Affairs',
      avatarInitials: (name.trim() || 'Aris Thorne').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      organization: 'Global Hematology BioPharma Inc.'
    };
    onLogin(session);
  };

  const handleQuickDemo = () => {
    const defaultSession: UserSession = {
      name: 'Dr. Aris Thorne',
      email: 'aris.thorne@biopharm.global',
      role: 'Head of Medical Affairs',
      avatarInitials: 'AT',
      organization: 'Global Hematology BioPharma Inc.'
    };
    onLogin(defaultSession);
  };

  return (
    <div className="landing-page-root">
      {/* Top Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="sidebar-logo-icon" style={{ width: '34px', height: '34px' }}>
            <Activity size={20} />
          </div>
          <div className="landing-brand-text">
            <span className="brand-name">Nova Orbit</span>
            <span className="brand-badge">Biopharma Intelligence</span>
          </div>
        </div>

        <div className="landing-nav-links">
          <a href="#features" className="nav-link">Intelligence Feeds</a>
          <a href="#architecture" className="nav-link">Grounded Copilot</a>
          <a href="#sources" className="nav-link">Verified Sources</a>
        </div>

        <div className="landing-nav-actions">
          <button 
            className="btn-secondary-outline"
            onClick={() => {
              setAuthMode('signin');
              setShowAuthModal(true);
            }}
          >
            Sign In
          </button>
          <button 
            className="btn-primary-gradient"
            onClick={() => {
              setAuthMode('signup');
              setShowAuthModal(true);
            }}
          >
            Start Free Pilot <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-glow-blob" />
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={14} color="#0F9B8E" />
            <span>Next-Gen Biopharma Signal Intelligence</span>
          </div>

          <h1 className="hero-title">
            From Inbox Noise to <br />
            <span className="hero-gradient-text">Strategic Therapeutic Signal</span>
          </h1>

          <p className="hero-subtitle">
            Nova Orbit continuously synthesizes clinical trials (NCT), PubMed literature, FDA/EMA regulatory decisions, and pharmacovigilance safety databases into actionable, cross-functional executive intelligence.
          </p>

          <div className="hero-cta-group">
            <button 
              className="btn-hero-primary"
              onClick={handleQuickDemo}
            >
              <Zap size={16} /> Enter Live Platform (Demo)
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={() => {
                setAuthMode('signin');
                setShowAuthModal(true);
              }}
            >
              Sign In with BioPharma SSO
            </button>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats-row">
            <div className="stat-card">
              <span className="stat-value">99.8%</span>
              <span className="stat-label">Source Verification Rate</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">&lt; 15 min</span>
              <span className="stat-label">Regulatory Signal Latency</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">6 Core</span>
              <span className="stat-label">Strategic Intelligence Axes</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">100%</span>
              <span className="stat-label">Grounded AI Ground Truth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Props / Feature Grid */}
      <section id="features" className="landing-features">
        <div className="section-header">
          <span className="section-badge">Platform Capabilities</span>
          <h2 className="section-title">Designed for Cross-Functional Biopharma Teams</h2>
          <p className="section-desc">
            Bridging clinical discovery, regulatory compliance, safety surveillance, and commercial market access.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'rgba(15, 155, 142, 0.15)', color: '#0F9B8E' }}>
              <Activity size={22} />
            </div>
            <h3>Clinical Trials & Protocol Radar</h3>
            <p>Direct tracking of Phase 1–3 endpoints, patient enrollment milestones, and breakthrough bleeding rate readouts across global registries.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'rgba(46, 95, 219, 0.15)', color: '#2E5FDB' }}>
              <BarChart3 size={22} />
            </div>
            <h3>Market Evolution Radar</h3>
            <p>Real-time 6-axis signal density analysis indexing competitive pipeline movements, pricing shifts, and European HTA reimbursement decisions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'rgba(220, 38, 38, 0.15)', color: '#DC2626' }}>
              <ShieldCheck size={22} />
            </div>
            <h3>Pharmacovigilance Surveillance</h3>
            <p>Early automated detection of safety alerts from EMA PRAC, WHO VigiBase, and FDA FAERS adverse event reports before public escalation.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'rgba(124, 77, 255, 0.15)', color: '#7C4DFF' }}>
              <Database size={22} />
            </div>
            <h3>Verified Source Citations</h3>
            <p>Every single signal carries verifiable NCT identifiers, PubMed PMIDs, or FDA/EMA case report anchors with zero fabricated IDs.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="sidebar-logo-icon" style={{ width: '28px', height: '28px' }}>
              <Activity size={16} />
            </div>
            <span style={{ fontWeight: 800, color: '#F8FAFC' }}>Nova Orbit</span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            © {new Date().getFullYear()} Nova Orbit Biopharma Intelligence Inc. All rights reserved. Medical & Regulatory Decision Support.
          </span>
        </div>
      </footer>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal-card" onClick={e => e.stopPropagation()}>
            <div className="auth-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="sidebar-logo-icon" style={{ width: '32px', height: '32px' }}>
                  <Activity size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>Nova Orbit</h3>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Strategic Biopharma Access Gate</span>
                </div>
              </div>
            </div>

            <div className="auth-tabs">
              <button 
                className={`auth-tab ${authMode === 'signin' ? 'active' : ''}`}
                onClick={() => setAuthMode('signin')}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => setAuthMode('signup')}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="auth-error-banner">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authMode === 'signup' && (
                <div className="form-group">
                  <label>Full Name & Title</label>
                  <div className="input-with-icon">
                    <User size={15} color="#94A3B8" />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="e.g. Dr. Aris Thorne"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Organizational Email</label>
                <div className="input-with-icon">
                  <Mail size={15} color="#94A3B8" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="name@biopharm.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Key size={15} color="#94A3B8" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit">
                {authMode === 'signin' ? 'Access Intelligence Dashboard' : 'Complete Registration'}
                <ArrowRight size={15} />
              </button>
            </form>

            <div className="auth-divider">
              <span>OR QUICK DEMO</span>
            </div>

            <button 
              type="button" 
              className="btn-demo-login"
              onClick={handleQuickDemo}
            >
              <Zap size={14} color="#0F9B8E" />
              Sign in as <strong>Dr. Aris Thorne (Head of Medical Affairs)</strong>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
