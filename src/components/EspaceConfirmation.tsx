import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, Home, ArrowLeft, ExternalLink, BookOpen, 
  Users, User, Calendar, MessageSquare, Plus, 
  LayoutDashboard, FileText, Settings, AlertCircle 
} from 'lucide-react';

interface Matiere {
  id: string;
  nom: string;
  code: string;
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

export default function EspaceConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const nouvelEspace = location.state?.nouvelEspace as EspacePedagogique | undefined;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (!nouvelEspace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-yellow-600">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Aucun espace trouvé
          </h1>
          <p className="text-gray-600 mb-6">
            Vous êtes arrivé sur cette page sans avoir créé d'espace.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la création
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              Accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Confirmation de création
                </h1>
                <p className="text-gray-500">
                  Votre espace pédagogique a été créé avec succès
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Retour
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Carte de confirmation */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
          <div className="bg-green-500 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  ✅ Création réussie !
                </h2>
                <p className="text-green-100">
                  Votre espace pédagogique est maintenant disponible
                </p>
              </div>
              <div className="text-4xl animate-bounce">🎉</div>
            </div>
          </div>

          <div className="p-8">
            {/* Détails de l'espace */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                    Informations principales
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Nom de l'espace
                      </label>
                      <div className="text-xl font-bold text-gray-900">
                        {nouvelEspace.nom}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Matière
                      </label>
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        {nouvelEspace.matiere.nom} ({nouvelEspace.matiere.code})
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Statut
                      </label>
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${nouvelEspace.is_actif 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {nouvelEspace.is_actif ? '✅ Actif et opérationnel' : '⏸️ En attente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                    Assignations
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Promotion
                      </label>
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <Users className="w-5 h-5 text-purple-500" />
                        {nouvelEspace.promotion_nom || 'Aucune promotion assignée'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Formateur responsable
                      </label>
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <User className="w-5 h-5 text-orange-500" />
                        {nouvelEspace.formateur_principal_nom || 'Aucun formateur assigné'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Date de création
                      </label>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        {formatDate(nouvelEspace.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {nouvelEspace.description && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Description
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {nouvelEspace.description}
                </p>
              </div>
            )}

            {/* ID et informations techniques */}
            <div className="p-6 bg-blue-50 rounded-xl border border-gray-300">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Informations techniques
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ID de l'espace :</span>
                  <code className="bg-gray-800 text-gray-100 px-3 py-1.5 rounded-lg font-mono text-sm">
                    {nouvelEspace.id}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date de dernière mise à jour :</span>
                  <span className="text-gray-800 font-medium">
                    {formatDate(nouvelEspace.updated_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Nombre de formateurs :</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {nouvelEspace.formateurs_count} formateur(s)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Nombre d'étudiants :</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    {nouvelEspace.etudiants_count} étudiant(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.open(`/espace/${nouvelEspace.id}`, '_blank')}
                  className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <ExternalLink className="w-5 h-5" />
                  Accéder à l'espace
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-gray-100 text-gray-800 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-3 border border-gray-300"
                >
                  <Plus className="w-5 h-5" />
                  Créer un autre espace
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Tableau de bord
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Vous pouvez modifier ces paramètres à tout moment depuis le panneau d'administration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conseils rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Ajouter des participants</h4>
            <p className="text-gray-600 text-sm">
              Invitez des étudiants et formateurs à rejoindre cet espace pédagogique.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Déposer des ressources</h4>
            <p className="text-gray-600 text-sm">
              Partagez des cours, exercices et documents avec vos participants.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Personnaliser</h4>
            <p className="text-gray-600 text-sm">
              Configurez les paramètres de votre espace selon vos besoins pédagogiques.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}