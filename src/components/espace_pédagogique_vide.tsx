import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, GraduationCap, CheckCircle, 
  AlertCircle, Loader2, Plus, X, ChevronDown, ListTodo,
  Users
} from 'lucide-react';

interface Matiere {
  id: string;
  nom: string;
  code: string;
  description: string | null;
}

interface Promotion {
  id: string;
  nom: string;
  description: string | null;
}

interface EspacePedagogique {
  id: string;
  nom: string;
  matiere: Matiere;
  promotion: string | null;
  promotion_nom: string | null;
  formateur_principal: string | null;
  formateur_principal_nom: string | null;
  description: string;
  is_actif: boolean;
  created_at: string;
  updated_at: string;
  formateurs_count: number;
  etudiants_count: number;
}

interface PayloadCreateEspace {
  nom: string;
  matiere: string;
  promotion?: string;
  description: string;
}

export default function PedagogicalSpaceForm() {
  const navigate = useNavigate();
  
  // États du formulaire
  const [nom, setNom] = useState('');
  const [matiereId, setMatiereId] = useState<string>('');
  const [promotionId, setPromotionId] = useState<string>('');
  const [description, setDescription] = useState('');
  
  // États pour les données
  const [matieresDisponibles, setMatieresDisponibles] = useState<Matiere[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // États pour l'ajout de matière
  const [newMatiereNom, setNewMatiereNom] = useState('');
  const [newMatiereCode, setNewMatiereCode] = useState('');
  
  // État pour le mode de sélection de matière
  const [modeMatiere, setModeMatiere] = useState<'select' | 'input'>('select');

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  // Fonction pour extraire le tableau de données de la réponse API
  const extractDataArray = <T,>(response: unknown): T[] => {
    if (Array.isArray(response)) {
      return response as T[];
    } else if (response && typeof response === 'object' && 'results' in response && Array.isArray((response as {results: unknown}).results)) {
      return (response as {results: T[]}).results;
    } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as {data: unknown}).data)) {
      return (response as {data: T[]}).data;
    } else if (response && typeof response === 'object') {
      return [response as T];
    }
    return [];
  };

  // Charger toutes les données
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const [promotionsRes, espacesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/promotion/`),
        fetch(`${API_BASE_URL}/espace-pedagogique/espaces/`)
      ]);

      if (!promotionsRes.ok) {
        throw new Error(`Erreur promotions: ${promotionsRes.status}`);
      }
      if (!espacesRes.ok) {
        throw new Error(`Erreur espaces: ${espacesRes.status}`);
      }

      const promotionsData = await promotionsRes.json();
      const espacesData = await espacesRes.json();

      // Extraire les tableaux de données
      const promotionsArray = extractDataArray<Promotion>(promotionsData);
      const espacesArray = extractDataArray<EspacePedagogique>(espacesData);

      setPromotions(promotionsArray);
      
      // Extraire les matières uniques des espaces
      const matieresUniques: Matiere[] = [];
      const matieresMap = new Map<string, Matiere>();
      
      espacesArray.forEach((espace) => {
        if (espace.matiere && espace.matiere.id && !matieresMap.has(espace.matiere.id)) {
          matieresMap.set(espace.matiere.id, espace.matiere);
          matieresUniques.push(espace.matiere);
        }
      });
      
      setMatieresDisponibles(matieresUniques);
      
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError(`Erreur lors du chargement des données: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Charger les données initiales
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!nom.trim()) {
      setError('Le nom de l\'espace est obligatoire');
      return;
    }
    
    // Déterminer la valeur de matière à envoyer
    let matiereValue = '';
    
    if (modeMatiere === 'select') {
      if (!matiereId) {
        setError('Veuillez sélectionner une matière');
        return;
      }
      matiereValue = matiereId;
    } else {
      if (!newMatiereNom.trim()) {
        setError('Veuillez saisir le nom de la matière');
        return;
      }
      matiereValue = newMatiereNom.trim();
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      // Construction du payload avec le type correct
      const payload: PayloadCreateEspace = {
        nom: nom.trim(),
        matiere: matiereValue,
        description: description.trim() || ''
      };

      // Ajouter la promotion si sélectionnée
      if (promotionId && promotionId !== '') {
        payload.promotion = promotionId;
      }

      console.log('📤 Envoi à l\'API:', payload);

      const response = await fetch(`${API_BASE_URL}/espace-pedagogique/espaces/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Gestion robuste de la réponse
      if (!response.ok) {
        let errorMessage = `Erreur serveur: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          console.error('Erreur API détaillée:', errorData);
          
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.matiere) {
            errorMessage = `Erreur matière: ${Array.isArray(errorData.matiere) ? errorData.matiere.join(', ') : errorData.matiere}`;
          } else if (errorData.promotion) {
            errorMessage = `Erreur promotion: ${Array.isArray(errorData.promotion) ? errorData.promotion.join(', ') : errorData.promotion}`;
          }
        } catch {
          const text = await response.text();
          console.error('Réponse texte (non JSON):', text);
          errorMessage = `${errorMessage}\n${text.substring(0, 200)}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Réponse API:', data);

      const nouvelEspace = data as EspacePedagogique;
      
      // Redirection
      navigate('/espace/confirmation', {
        state: { nouvelEspace }
      });

    } catch (err: unknown) {
      console.error('❌ Erreur création:', err);
      if (err instanceof Error) {
        setError(`❌ ${err.message}`);
      } else {
        setError('❌ Erreur inconnue lors de la création');
      }
      setSubmitting(false);
    }
  };

  const handleAddMatiere = () => {
    if (!newMatiereNom.trim() || !newMatiereCode.trim()) {
      setError('Veuillez remplir tous les champs pour la matière');
      return;
    }

    const nouvelleMatiere: Matiere = {
      id: `temp-${Date.now()}`,
      nom: newMatiereNom.trim(),
      code: newMatiereCode.trim().toUpperCase(),
      description: null
    };
    
    setMatieresDisponibles(prev => [...prev, nouvelleMatiere]);
    setMatiereId(nouvelleMatiere.id);
    setModeMatiere('select');
    setNewMatiereNom('');
    setNewMatiereCode('');
    
    setSuccess(`✅ Matière "${nouvelleMatiere.nom}" ajoutée à la liste !`);
  };

  const resetForm = () => {
    setNom('');
    setMatiereId('');
    setPromotionId('');
    setDescription('');
    setError('');
    setSuccess('');
    setNewMatiereNom('');
    setNewMatiereCode('');
    setModeMatiere('select');
  };

  const getMatiereNom = (matiereId: string) => {
    const matiere = matieresDisponibles.find(m => m.id === matiereId);
    return matiere ? `${matiere.nom} (${matiere.code})` : "Inconnue";
  };

  const getPromotionNom = (promotionId: string) => {
    const promotion = promotions.find(p => p.id === promotionId);
    return promotion ? promotion.nom : "Inconnue";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Création d'Espaces Pédagogiques</h1>
              <p className="text-sm text-gray-500">Créez vos espaces pédagogiques en temps réel</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Formulaire de création */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Créer un nouvel espace pédagogique
          </h2>
          
          {/* Messages de succès/erreur */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{success}</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Nom de l'espace */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'espace pédagogique <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={nom}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNom(e.target.value)}
                  placeholder="Ex: Algorithmique Avancée - Groupe A"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={submitting}
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Donnez un nom significatif à votre espace pédagogique
              </p>
            </div>

            {/* Sélection de la matière */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matière <span className="text-red-500">*</span>
              </label>
              
              {modeMatiere === 'select' ? (
                <>
                  <div className="flex gap-2 mb-3">
                    <div className="relative flex-1">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={matiereId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMatiereId(e.target.value)}
                        disabled={submitting}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                        required
                      >
                        <option value="">Sélectionnez une matière</option>
                        {matieresDisponibles.map((matiere) => (
                          <option key={matiere.id} value={matiere.id}>
                            {matiere.nom} ({matiere.code})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setModeMatiere('input')}
                      disabled={submitting}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium whitespace-nowrap flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Autre matière
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {matieresDisponibles.length} matière(s) disponible(s)
                  </p>
                </>
              ) : (
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 mb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ListTodo className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-gray-900">Saisir une nouvelle matière</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModeMatiere('select')}
                      className="text-gray-500 hover:text-gray-700"
                      disabled={submitting}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de la matière <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newMatiereNom}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMatiereNom(e.target.value)}
                        placeholder="Ex: Intelligence Artificielle"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code de la matière <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newMatiereCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMatiereCode(e.target.value)}
                        placeholder="Ex: IA, WEB, BD..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={handleAddMatiere}
                      disabled={submitting || !newMatiereNom.trim() || !newMatiereCode.trim()}
                      className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
                    >
                      Ajouter la matière
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Promotion (optionnelle) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Promotion assignée <span className="text-gray-400 text-xs">(optionnel)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPromotionId('')}
                  className="text-xs text-blue-600 hover:text-blue-800"
                  disabled={submitting || !promotionId}
                >
                  Effacer la sélection
                </button>
              </div>
              
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={promotionId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPromotionId(e.target.value)}
                  disabled={submitting}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="">Aucune promotion (créer un espace vide)</option>
                  {promotions.map((promotion) => (
                    <option key={promotion.id} value={promotion.id}>
                      {promotion.nom}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Sélectionnez une promotion pour y assigner cet espace
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-gray-400 text-xs">(optionnel)</span>
              </label>
              <textarea
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Description de l'espace pédagogique..."
                rows={4}
                disabled={submitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Décrivez l'objectif ou le contenu de cet espace pédagogique
              </p>
            </div>

            {/* Récapitulatif */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Récapitulatif de la création</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Espace :</span>
                  <span className="font-medium">{nom || "Non renseigné"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Matière :</span>
                  <span className="font-medium">
                    {modeMatiere === 'select' 
                      ? (matiereId ? getMatiereNom(matiereId) : "Non sélectionnée")
                      : newMatiereNom || "Non renseignée"
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Promotion :</span>
                  <span className="font-medium">
                    {promotionId ? getPromotionNom(promotionId) : "Aucune"}
                  </span>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting || !nom.trim() || (modeMatiere === 'select' ? !matiereId : !newMatiereNom.trim())}
                className="flex-1 bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Créer l'espace pédagogique
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="px-8 py-3.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Réinitialiser
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}