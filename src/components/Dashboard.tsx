import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

function Dashboard() {
  const stats = [
    { label: 'Formateurs', value: '12', icon: Users, color: 'from-blue-500 to-blue-600', change: '+2' },
    { label: 'Promotions', value: '8', icon: GraduationCap, color: 'from-green-500 to-green-600', change: '+1' },
    { label: 'Étudiants', value: '245', icon: Users, color: 'from-purple-500 to-purple-600', change: '+15' },
    { label: 'Cours', value: '32', icon: BookOpen, color: 'from-orange-500 to-orange-600', change: '+3' },
  ];

  const recentActivities = [
    { user: 'Jean Dupont', action: 'a ajouté un nouveau cours', time: 'Il y a 2 heures', type: 'add' },
    { user: 'Marie Curie', action: 'a mis à jour ses informations', time: 'Il y a 1 jour', type: 'update' },
    { user: 'Pierre Martin', action: 'a créé une nouvelle promotion', time: 'Il y a 2 jours', type: 'create' },
    { user: 'Sophie Bernard', action: 'a ajouté 5 étudiants', time: 'Il y a 3 jours', type: 'add' },
  ];

  return (
    <div className="ml-10 w-full flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">Bienvenue sur la plateforme de gestion académique</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Welcome Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Bienvenue Administrateur 👋</h2>
              <p className="mb-6 opacity-90">
                Gérez efficacement vos formateurs, promotions et étudiants depuis cette plateforme. 
                Consultez les dernières activités et statistiques importantes.
              </p>
              <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                Voir le rapport complet
              </button>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Activités récentes</h3>
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'add' ? 'bg-green-100 text-green-600' :
                      activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'add' ? '+' : activity.type === 'update' ? '↻' : '✎'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Ajouter un formateur</span>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors border border-green-200">
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-medium">Créer une promotion</span>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors border border-purple-200">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Ajouter un cours</span>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors border border-orange-200">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Importer des étudiants</span>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">État du système</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Serveur</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">En ligne</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base de données</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">Connectée</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stockage</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">64% utilisé</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Dernière sauvegarde</span>
                  <span className="text-sm text-gray-500">Il y a 2h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;