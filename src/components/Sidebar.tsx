import { useState } from 'react';
import {
  Home,
  UserCog,
  Users,
  GraduationCap,
  BookOpen,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

// Interface pour les items de menu
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

// Items du menu (simplifiés selon les nouvelles options)
const menuItems: MenuItem[] = [
  { id: '1', label: 'Dashboard', icon: Home, path: '/' },
  { id: '2', label: 'Formateur', icon: UserCog, path: '/formateur' },
  { id: '3', label: 'Promotion', icon: Users, path: '/promotion' },
  { id: '4', label: 'Etudiant', icon: GraduationCap, path: '/etudiant' },
  { id: '5', label: 'Espace pédagogique', icon: BookOpen, path: '/espace' }
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('1');

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    console.log(`Navigation vers: ${menuItems.find(item => item.id === itemId)?.path}`);
  };

  return (
    <div
      className={`
        ${isOpen ? 'w-72' : 'w-20'}
        h-screen ml-0 absolute bottom-0 left-0
        bg-linear-to-b from-slate-900 via-slate-800 to-slate-900
        text-white transition-all duration-300 ease-in-out
        shadow-2xl flex flex-col border-r border-slate-700
      `}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center w-full'}`}>
          <div className="bg-linear-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          {isOpen && (
            <div>
              <h2 className="font-bold text-lg bg-linear-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Gestion Académique
              </h2>
              <p className="text-xs text-slate-300">Plateforme de gestion</p>
            </div>
          )}
        </div>
        {isOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 relative
                    ${isActive
                      ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }
                    ${!isOpen && 'justify-center px-3'}
                    group
                  `}
                >
                  <div className="relative">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {isActive && (
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-full"></div>
                    )}
                  </div>
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left font-medium text-sm">
                        {item.label}
                      </span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </>
                  )}
                  
                  {/* Tooltip pour mode réduit */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle button pour mode réduit */}
      {!isOpen && (
        <div className="p-4 flex justify-center border-t border-slate-700">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors hover:scale-110"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={`p-4 border-t border-slate-700 ${!isOpen && 'flex justify-center'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            A
          </div>
          {isOpen && (
            <div className="flex-1">
              <p className="font-semibold text-sm">Administrateur</p>
              <p className="text-xs text-slate-300">admin@academy.fr</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;