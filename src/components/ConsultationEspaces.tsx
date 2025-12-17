import React, { useMemo, useState } from "react";
import { Eye, Pencil, Trash2, Layers, Users, UserCheck, X } from "lucide-react";

const initialEspaces = [
  { id: 1, nom: "Algorithmique Avancée", matiere: "Informatique", formateur: "Jean Dupont", promotions: ["L3 Informatique 2022/2023"], etudiants: 32 },
  { id: 2, nom: "Bases de données", matiere: "Informatique", formateur: "Sophie Martin", promotions: ["L2 Informatique 2023/2024"], etudiants: 45 },
  { id: 3, nom: "Développement Web", matiere: "Informatique", formateur: "Thomas Leroy", promotions: ["L2 Informatique 2023/2024", "L3 Informatique 2022/2023"], etudiants: 58 },
  { id: 4, nom: "Analyse mathématique", matiere: "Mathématiques", formateur: "Marie Dubois", promotions: ["L1 Mathématiques 2024/2025"], etudiants: 68 },
  { id: 5, nom: "Algèbre linéaire", matiere: "Mathématiques", formateur: "Pierre Bernard", promotions: ["L1 Mathématiques 2024/2025"], etudiants: 65 },
  { id: 6, nom: "Mécanique quantique", matiere: "Physique", formateur: "Claire Petit", promotions: ["L1 Physique 2024/2025"], etudiants: 42 },
  { id: 7, nom: "Chimie organique", matiere: "Chimie", formateur: "Lucas Roux", promotions: ["L2 Chimie 2023/2024"], etudiants: 38 },
  { id: 8, nom: "Intelligence Artificielle", matiere: "Informatique", formateur: "Jean Dupont", promotions: ["M1 Informatique 2023/2024"], etudiants: 28 },
];

/* Composants internes */

const Modal = ({ title, children, onClose, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Fermer">
        <X size={18} />
      </button>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div>{children}</div>
      {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
    </div>
  </div>
);

const Filtres = ({ search, setSearch, matiere, setMatiere, promotion, setPromotion, espaces, onReset }) => {
  const matieres = useMemo(() => [...new Set(espaces.map(e => e.matiere))], [espaces]);
  const promotions = useMemo(() => [...new Set(espaces.flatMap(e => e.promotions))], [espaces]);

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Recherche</label>
        <input
          type="text"
          placeholder="Rechercher un espace, formateur ou promotion..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Matière</label>
        <select
          value={matiere}
          onChange={e => setMatiere(e.target.value)}
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Toutes les matières</option>
          {matieres.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Promotion</label>
        <select
          value={promotion}
          onChange={e => setPromotion(e.target.value)}
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Toutes les promotions</option>
          {promotions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <button onClick={onReset} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Réinitialiser
      </button>
    </div>
  );
};

const TableauEspaces = ({ espaces, onView, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th className="px-4 py-3 text-left">Nom de l'espace</th>
          <th className="px-4 py-3 text-left">Matière</th>
          <th className="px-4 py-3 text-left">Formateur</th>
          <th className="px-4 py-3 text-left">Promotion(s)</th>
          <th className="px-4 py-3 text-left">Étudiants</th>
          <th className="px-4 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {espaces.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center py-6 text-gray-500">Aucun espace trouvé</td>
          </tr>
        ) : espaces.map(e => (
          <tr key={e.id} className="hover:bg-gray-50 transition">
            <td className="px-4 py-3 font-semibold text-gray-800">{e.nom}</td>
            <td className="px-4 py-3">{e.matiere}</td>
            <td className="px-4 py-3">{e.formateur}</td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {e.promotions.map((p, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">{p}</span>
                ))}
              </div>
            </td>
            <td className="px-4 py-3">{e.etudiants}</td>
            <td className="px-4 py-3 flex gap-4">
              <button onClick={() => onView(e)} title="Voir les détails" className="text-green-600 hover:text-green-800">
                <Eye size={18} />
              </button>
              <button onClick={() => onEdit(e)} title="Modifier" className="text-yellow-500 hover:text-yellow-700">
                <Pencil size={18} />
              </button>
              <button onClick={() => onDelete(e)} title="Supprimer" className="text-red-600 hover:text-red-800">
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ResumeStats = ({ espaces }) => {
  const totalEtudiants = useMemo(() => espaces.reduce((s, e) => s + e.etudiants, 0), [espaces]);
  const formateursActifs = useMemo(() => [...new Set(espaces.map(e => e.formateur))].length, [espaces]);

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded p-6 text-center transition-card">
        <Layers className="mx-auto text-blue-500 mb-2" />
        <h2 className="text-3xl font-bold text-blue-500">{espaces.length}</h2>
        <p className="text-gray-600">Total d'espaces</p>
      </div>
      <div className="bg-white shadow rounded p-6 text-center transition-card">
        <Users className="mx-auto text-green-500 mb-2" />
        <h2 className="text-3xl font-bold text-green-500">{totalEtudiants}</h2>
        <p className="text-gray-600">Total d'étudiants</p>
      </div>
      <div className="bg-white shadow rounded p-6 text-center transition-card">
        <UserCheck className="mx-auto text-purple-500 mb-2" />
        <h2 className="text-3xl font-bold text-purple-500">{formateursActifs}</h2>
        <p className="text-gray-600">Formateurs actifs</p>
      </div>
    </div>
  );
};

/* Composant principal */

const ConsultationEspaces = () => {
  const [espaces, setEspaces] = useState(initialEspaces);
  const [search, setSearch] = useState("");
  const [matiere, setMatiere] = useState("");
  const [promotion, setPromotion] = useState("");

  // Modale: type = 'view' | 'edit' | 'delete'
  const [modal, setModal] = useState({ type: null, data: null });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return espaces.filter(e => {
      const matchSearch =
        q === "" ||
        [e.nom, e.matiere, e.formateur, ...e.promotions]
          .some(f => f.toString().toLowerCase().includes(q));
      const matchMatiere = matiere === "" || e.matiere === matiere;
      const matchPromotion = promotion === "" || e.promotions.includes(promotion);
      return matchSearch && matchMatiere && matchPromotion;
    });
  }, [espaces, search, matiere, promotion]);

  const openView = (e) => setModal({ type: "view", data: e });
  const openEdit = (e) => setModal({ type: "edit", data: { ...e } });
  const openDelete = (e) => setModal({ type: "delete", data: e });
  const closeModal = () => setModal({ type: null, data: null });

  const saveEdit = () => {
    const e = modal.data;
    if (!e.nom.trim()) return alert("Le nom de l'espace est requis.");
    setEspaces(prev => prev.map(x => (x.id === e.id ? { ...e, promotions: Array.isArray(e.promotions) ? e.promotions : [] } : x)));
    closeModal();
  };

  const confirmDelete = () => {
    setEspaces(prev => prev.filter(x => x.id !== modal.data.id));
    closeModal();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Consultation des espaces pédagogiques
      </h1>

      <Filtres
        search={search} setSearch={setSearch}
        matiere={matiere} setMatiere={setMatiere}
        promotion={promotion} setPromotion={setPromotion}
        espaces={espaces}
        onReset={() => { setSearch(""); setMatiere(""); setPromotion(""); }}
      />

      <TableauEspaces
        espaces={filtered}
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <ResumeStats espaces={filtered} />

      {/* Modale Voir */}
      {modal.type === "view" && (
        <Modal title="Détails de l'espace" onClose={closeModal}
          footer={[
            <button key="close" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Fermer</button>,
            <button key="edit" onClick={() => openEdit(modal.data)} className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600">Modifier</button>
          ]}
        >
          <div className="space-y-2">
            <p><strong>Nom:</strong> {modal.data.nom}</p>
            <p><strong>Matière:</strong> {modal.data.matiere}</p>
            <p><strong>Formateur:</strong> {modal.data.formateur}</p>
            <p><strong>Promotions:</strong> {modal.data.promotions.join(", ")}</p>
            <p><strong>Étudiants:</strong> {modal.data.etudiants}</p>
          </div>
        </Modal>
      )}

      {/* Modale Modifier */}
      {modal.type === "edit" && (
        <Modal title="Modifier l'espace" onClose={closeModal}
          footer={[
            <button key="cancel" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Annuler</button>,
            <button key="save" onClick={saveEdit} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Enregistrer</button>
          ]}
        >
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm text-gray-600">Nom</label>
            <input
              type="text"
              value={modal.data.nom}
              onChange={e => setModal(m => ({ ...m, data: { ...m.data, nom: e.target.value } }))}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="text-sm text-gray-600">Matière</label>
            <input
              type="text"
              value={modal.data.matiere}
              onChange={e => setModal(m => ({ ...m, data: { ...m.data, matiere: e.target.value } }))}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="text-sm text-gray-600">Formateur</label>
            <input
              type="text"
              value={modal.data.formateur}
              onChange={e => setModal(m => ({ ...m, data: { ...m.data, formateur: e.target.value } }))}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="text-sm text-gray-600">Promotions (séparées par des virgules)</label>
            <input
              type="text"
              value={modal.data.promotions.join(", ")}
              onChange={e =>
                setModal(m => ({
                  ...m,
                  data: { ...m.data, promotions: e.target.value.split(",").map(p => p.trim()).filter(Boolean) }
                }))
              }
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="text-sm text-gray-600">Nombre d'étudiants</label>
            <input
              type="number"
              min="0"
              value={modal.data.etudiants}
              onChange={e => setModal(m => ({ ...m, data: { ...m.data, etudiants: Number(e.target.value) || 0 } }))}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </Modal>
      )}

      {/* Modale Supprimer */}
      {modal.type === "delete" && (
        <Modal title="Confirmer la suppression" onClose={closeModal}
          footer={[
            <button key="cancel" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Annuler</button>,
            <button key="delete" onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Supprimer</button>
          ]}
        >
          <p>Voulez-vous vraiment supprimer l'espace <strong>{modal.data.nom}</strong> ? Cette action est irréversible.</p>
        </Modal>
      )}

      {/* Effet hover des cartes si absent */}
      <style>{`
        .transition-card { transition: transform .18s ease, box-shadow .18s ease; }
        .transition-card:hover { transform: translateY(-6px); box-shadow: 0 10px 20px rgba(0,0,0,.08); }
      `}</style>
    </div>
  );
};

export default ConsultationEspaces;
