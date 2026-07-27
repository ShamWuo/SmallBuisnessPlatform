import React, { useState } from 'react';
import { SalonProvider } from './context/SalonContext';
import { Header } from './components/Header';
import { NoShowPredictorView } from './components/NoShowPredictorView';
import { ComplianceTrackerView } from './components/ComplianceTrackerView';
import { CopilotChat } from './components/CopilotChat';
import { ActionModal } from './components/ActionModal';
import { NewBookingModal } from './components/NewBookingModal';
import { NewComplianceModal } from './components/NewComplianceModal';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'predictor' | 'compliance' | 'copilot'>('predictor');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isNewComplianceOpen, setIsNewComplianceOpen] = useState(false);

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewBooking={() => setIsNewBookingOpen(true)}
        onOpenNewCompliance={() => setIsNewComplianceOpen(true)}
      />

      <main>
        {activeTab === 'predictor' && <NoShowPredictorView />}
        {activeTab === 'compliance' && <ComplianceTrackerView />}
        {activeTab === 'copilot' && <CopilotChat />}
      </main>

      {/* Global Modals */}
      <ActionModal />
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
      />
      <NewComplianceModal
        isOpen={isNewComplianceOpen}
        onClose={() => setIsNewComplianceOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SalonProvider>
      <AppContent />
    </SalonProvider>
  );
}
