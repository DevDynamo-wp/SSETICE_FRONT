import { Users, BookOpen, GraduationCap, TrendingUp, Calendar, Bell, Activity } from 'lucide-react';

function Dashboard() {
  const stats = [
    { 
      label: 'Formateurs', 
      value: '12', 
      icon: Users, 
      color: 'from-blue-500 to-blue-600', 
      change: '+2',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Promotions', 
      value: '8', 
      icon: GraduationCap, 
      color: 'from-green-500 to-green-600', 
      change: '+1',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    { 
      label: 'Étudiants', 
      value: '245', 
      icon: Users, 
      color: 'from-purple-500 to-purple-600', 
      change: '+15',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    { 
      label: 'Cours', 
      value: '32', 
      icon: BookOpen, 
      color: 'from-orange-500 to-orange-600', 
      change: '+3',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
  ];

  const recentActivities = [
    { 
      user: 'Jean Dupont', 
      action: 'a ajouté un nouveau cours', 
      time: 'Il y a 2 heures', 
      type: 'add',
      avatar: 'JD',
      color: 'bg-blue-500'
    },
    { 
      user: 'Marie Curie', 
      action: 'a mis à jour ses informations', 
      time: 'Il y a 1 jour', 
      type: 'update',
      avatar: 'MC',
      color: 'bg-green-500'
    },
    { 
      user: 'Pierre Martin', 
      action: 'a créé une nouvelle promotion', 
      time: 'Il y a 2 jours', 
      type: 'create',
      avatar: 'PM',
      color: 'bg-purple-500'
    },
    { 
      user: 'Sophie Bernard', 
      action: 'a ajouté 5 étudiants', 
      time: 'Il y a 3 jours', 
      type: 'add',
      avatar: 'SB',
      color: 'bg-orange-500'
    },
  ];

  const upcomingEvents = [
    { title: 'Réunion pédagogique', date: '23 Déc', time: '14:00', color: 'bg-blue-100 text-blue-700' },
    { title: 'Examen L3 Info', date: '25 Déc', time: '09:00', color: 'bg-purple-100 text-purple-700' },
    { title: 'Conseil de classe', date: '27 Déc', time: '15:30', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="w-full p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Notifications */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Tableau de bord
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Mercredi 18 Décembre 2025
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">3 nouvelles notifications</span>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Welcome Card + Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full opacity-10 -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Bienvenue Administrateur 👋</h2>
                </div>
                <p className="mb-6 opacity-90 text-blue-50 leading-relaxed">
                  Gérez efficacement vos formateurs, promotions et étudiants depuis cette plateforme. 
                  Consultez les dernières activités et statistiques importantes.
                </p>
                <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Voir le rapport complet →
                </button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Activités récentes</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Voir tout →
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${activity.color} flex-shrink-0`}>
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        <span className="font-semibold">{activity.user}</span>
                        <span className="text-gray-600 ml-1">{activity.action}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'add' ? 'bg-green-100 text-green-700' :
                      activity.type === 'update' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {activity.type === 'add' ? '+ Ajout' : activity.type === 'update' ? '↻ Mise à jour' : '✎ Création'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions + Events + Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-200 group">
                  <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">Ajouter un formateur</span>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-xl hover:from-green-100 hover:to-green-200 transition-all border border-green-200 group">
                  <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">Créer une promotion</span>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all border border-purple-200 group">
                  <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">Ajouter un cours</span>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all border border-orange-200 group">
                  <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">Importer des étudiants</span>
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Événements à venir
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className={`px-3 py-2 rounded-lg text-center min-w-[60px] ${event.color}`}>
                      <div className="text-xs font-semibold">{event.date}</div>
                      <div className="text-xs mt-1">{event.time}</div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">État du système</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">API Serveur</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    En ligne
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Base de données</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Connectée
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Stockage</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    64% utilisé
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Dernière sauvegarde</span>
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