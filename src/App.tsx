import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FormateursList from './components/FormateursList';
import EtudiantsList from './components/EtudiantsList';
import ConsultationEspaces from './components/ConsultationEspaces';
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'formateur':
        return <FormateursList />;
      case 'promotion':
        return (
          <div className="ml-10 w-full flex-1 p-8 bg-linear-to-br from-gray-50 to-gray-100">
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
        return (
          <ConsultationEspaces />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex left-0  absolute bottom-0 h-screen w-screen overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;