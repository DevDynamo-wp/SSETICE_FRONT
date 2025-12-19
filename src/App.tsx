import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PedagogicalSpaceForm from './components/espace_pédagogique_vide';
import EspaceConfirmation from './components/EspaceConfirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PedagogicalSpaceForm />} />
        <Route path="/espace/confirmation" element={<EspaceConfirmation />} />
        {/* Vous pouvez ajouter d'autres routes ici */}
      </Routes>
    </Router>
  );
}

export default App;