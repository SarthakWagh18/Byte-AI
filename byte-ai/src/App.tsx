import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Dashboard } from './components/pages/Dashboard';
import { Competitors } from './components/pages/Competitors';
import { Investigations } from './components/pages/Investigations';
import { Research } from './components/pages/Research';
import { Patents } from './components/pages/Patents';
import { Trends } from './components/pages/Trends';
import { Alerts } from './components/pages/Alerts';
import { Watchlists } from './components/pages/Watchlists';
import { Settings } from './components/pages/Settings';
import { EvidenceGraph } from './components/pages/EvidenceGraph';
import { AIAnalyst } from './components/chat/AIAnalyst';

export type Page =
  | 'dashboard'
  | 'analyst'
  | 'investigations'
  | 'competitors'
  | 'research'
  | 'patents'
  | 'trends'
  | 'alerts'
  | 'watchlists'
  | 'evidence'
  | 'settings';

function App() {
  const [activePage, setActivePage] = useState<Page>('analyst');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analyst':
        return <AIAnalyst />;
      case 'investigations':
        return <Investigations />;
      case 'competitors':
        return <Competitors />;
      case 'research':
        return <Research />;
      case 'patents':
        return <Patents />;
      case 'trends':
        return <Trends />;
      case 'alerts':
        return <Alerts />;
      case 'watchlists':
        return <Watchlists />;
      case 'evidence':
        return <EvidenceGraph />;
      case 'settings':
        return <Settings />;
      default:
        return <AIAnalyst />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-white">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />
      <div className="ml-[250px] min-h-screen">
        <TopBar />
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
