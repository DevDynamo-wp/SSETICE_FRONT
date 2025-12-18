import React, { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, X, Loader2, AlertCircle, Search,
  Calendar, GraduationCap, Info, Eye, BookOpen
} from "lucide-react";

interface Promotion {
  id?: string;
  nom: string;
  filiere: string;
  periode: string;
  description: string;
}

function PromotionList() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filiereFilter, setFiliereFilter] = useState("");
  const [formData, setFormData] = useState<Promotion>({ nom: "", filiere: "", periode: "", description: "" });

  const API_URL = "http://127.0.0.1:8000/api/promotion/";

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erreur de chargement");
      const data = await response.json();
      const list = data.results || data;
      setPromotions(list);
      setFilteredPromotions(list);
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromotions(); }, []);

  // --- LOGIQUE D'AJOUT ET MODIFICATION (SUBMIT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const method = editingPromotion ? "PUT" : "POST";
    const url = editingPromotion ? `${API_URL}${editingPromotion.id}/` : API_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      await fetchPromotions(); // Recharger la liste
      setIsModalOpen(false); // Fermer le modal
      setFormData({ nom: "", filiere: "", periode: "", description: "" });
    } catch (err) {
      setError("Impossible d'enregistrer la promotion.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- LOGIQUE DE SUPPRESSION ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette promotion ?")) return;

    try {
      const response = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      
      setPromotions(promotions.filter((p) => p.id !== id));
      setFilteredPromotions(filteredPromotions.filter((p) => p.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  // Filtres
  useEffect(() => {
    let result = promotions.filter(p => 
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.filiere.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filiereFilter) result = result.filter(p => p.filiere === filiereFilter);
    setFilteredPromotions(result);
  }, [searchTerm, filiereFilter, promotions]);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-7xl w-full mx-auto">
        
        {/* HEADER & FILTRES */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8 border border-slate-200">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><GraduationCap size={28} /></div>
              <div>
                <h1 className="text-3xl font-black text-slate-900">Gestion Promotions</h1>
                <p className="text-slate-500">Ajoutez et modifiez vos cohortes</p>
              </div>
            </div>
            {/* BOUTON AJOUT */}
            <button
              onClick={() => { setEditingPromotion(null); setFormData({nom:"", filiere:"", periode:"", description:""}); setIsModalOpen(true); }}
              className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100"
            >
              <Plus size={24} /> Nouveau
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <select value={filiereFilter} onChange={(e) => setFiliereFilter(e.target.value)} className="px-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Toutes les filières</option>
              {[...new Set(promotions.map(p => p.filiere))].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* TABLEAU */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-bold text-slate-500 tracking-widest">
                  <th className="px-8 py-5">Promotion</th>
                  <th className="px-8 py-5">Filière</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPromotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-900">{promo.nom}</td>
                    <td className="px-8 py-6 text-indigo-600 font-bold">{promo.filiere}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        {/* BOUTON OEIL */}
                        <button onClick={() => { setSelectedPromo(promo); setIsViewOpen(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"><Eye size={18} /></button>
                        {/* BOUTON MODIF */}
                        <button onClick={() => { setEditingPromotion(promo); setFormData(promo); setIsModalOpen(true); }} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"><Edit2 size={18} /></button>
                        {/* BOUTON SUPPR */}
                        <button onClick={() => promo.id && handleDelete(promo.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL FORMULAIRE (AJOUT / MODIF) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black">{editingPromotion ? "Modifier" : "Ajouter"} Promotion</h2>
              <button type="button" onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400"/></button>
            </div>
            <div className="space-y-4">
              <input required placeholder="Nom (ex: Master 1)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
              <input required placeholder="Filière (ex: Informatique)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={formData.filiere} onChange={(e) => setFormData({...formData, filiere: e.target.value})} />
              <input required placeholder="Période (ex: 2024-2025)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={formData.periode} onChange={(e) => setFormData({...formData, periode: e.target.value})} />
              <textarea placeholder="Description" rows={3} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <button type="submit" disabled={submitting} className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
              {submitting ? <Loader2 className="animate-spin mx-auto"/> : (editingPromotion ? "Mettre à jour" : "Enregistrer")}
            </button>
          </form>
        </div>
      )}

      {/* MODAL OEIL (DÉTAILS) */}
      {isViewOpen && selectedPromo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Info size={32}/></div>
            <h3 className="text-2xl font-black text-slate-900">{selectedPromo.nom}</h3>
            <p className="text-blue-600 font-bold mb-4">{selectedPromo.filiere}</p>
            <p className="text-slate-500 italic mb-8">"{selectedPromo.description || "Pas de description"}"</p>
            <button onClick={() => setIsViewOpen(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromotionList;