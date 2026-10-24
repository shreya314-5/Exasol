import React, { useState } from 'react';
import { CallProvider } from './context/CallContext';
import { Header } from './components/common/Header';
import { ModelDisclaimer } from './components/common/ModelDisclaimer';
import { Navigation, ActiveTab } from './components/common/Navigation';
import { ToastContainer } from './components/common/Toast';

// Core Views
import { LiveCallMonitor } from './components/liveCall/LiveCallMonitor';
import { AgentDesktopView } from './components/agentDesktop/AgentDesktopView';
import { PolicyBuilderView } from './components/policyBuilder/PolicyBuilderView';
import { FileAnalyzerView } from './components/fileAnalyzer/FileAnalyzerView';
import { EnrollmentConsentView } from './components/enrollment/EnrollmentConsentView';
import { PrivacyComplianceView } from './components/privacy/PrivacyComplianceView';
import { IntegrationsApiView } from './components/integrations/IntegrationsApiView';
import { AnalyticsDashboardView } from './components/analytics/AnalyticsDashboardView';

import { Shield, Lock, Radio, Server } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('live_monitor');

  return (
    <div className="min-h-screen bg-console-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Top Model Architecture & Simulated Disclaimer Banner */}
      <ModelDisclaimer />

      {/* 2. Enterprise Console Header */}
      <Header />

      {/* 3. Navigation Tab Bar */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. Active View Router */}
      <main className="flex-1 py-4">
        {activeTab === 'live_monitor' && <LiveCallMonitor />}
        {activeTab === 'agent_desktop' && <AgentDesktopView />}
        {activeTab === 'policy_builder' && <PolicyBuilderView />}
        {activeTab === 'file_analyzer' && <FileAnalyzerView />}
        {activeTab === 'enrollment' && <EnrollmentConsentView />}
        {activeTab === 'privacy_compliance' && <PrivacyComplianceView />}
        {activeTab === 'integrations' && <IntegrationsApiView />}
        {activeTab === 'analytics' && <AnalyticsDashboardView />}
      </main>

      {/* 5. Enterprise Console Footer */}
      <footer className="bg-console-900 border-t border-console-800/80 py-4 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>VoiceShield AI Enterprise v3.2</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Certified</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">
              Zero Raw Audio Persistence
            </span>
          </div>

          <div className="text-[11px] text-slate-400 text-center md:text-right">
            <span>Probabilistic Model Notice: Anti-spoofing indices are likelihood estimates.</span>
          </div>
        </div>
      </footer>

      {/* 6. Stateful Toast Container */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CallProvider>
      <AppContent />
    </CallProvider>
  );
};

export default App;
