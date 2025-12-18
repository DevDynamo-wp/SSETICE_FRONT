import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FormateursList from './components/FormateursList';
import EtudiantsList from './components/EtudiantsList';
import ConsultationEspaces from './components/ConsultationEspaces';
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'formateur':
        return <FormateursList />;
      case 'promotion':
        return (
          <div className="w-full p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Promotions</h1>
                <p className="text-gray-600">Gestion des promotions (à venir)</p>
              </div>
            </div>
          </div>
        );
      case 'etudiant':
        return <EtudiantsList />;
      case 'espace':
        return <ConsultationEspaces />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      {/* Main content with dynamic margin based on sidebar state */}
      <main 
        className={`
          min-h-screen transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'ml-72' : 'ml-20'}
        `}
      >
        <div className="w-full">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;