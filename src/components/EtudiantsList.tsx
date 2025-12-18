import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
} from "lucide-react";

interface Etudiant {
  id?: string;
  email: string;
  nom: string;
  prenom: string;
  sexe: string;
  telephone: string;
  date_naissance?: string;
  lieu_naissance?: string;
  adresse?: string;
  promotion_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  motDePasse?: string;
}

interface Promotion {
  id: string;
  nom: string;
  annee: string;
}

function EtudiantsList() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredEtudiants, setFilteredEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEtudiant, setEditingEtudiant] = useState<Etudiant | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sexeFilter, setSexeFilter] = useState("");
  const [promotionFilter, setPromotionFilter] = useState("");

  const [formData, setFormData] = useState<Etudiant>({
    email: "",
    nom: "",
    prenom: "",
    sexe: "",
    telephone: "",
    date_naissance: "",
    lieu_naissance: "",
    adresse: "",
    promotion_id: "",
    motDePasse: "",
  });

  const API_URL = "http://127.0.0.1:8000/api/etudiants/";
  const PROMOTIONS_API_URL = "http://127.0.0.1:8000/api/promotions/";

  const fetchEtudiants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des étudiants");
      }

      const data = await response.json();
      const etudiantsList = data.results || data;
      setEtudiants(etudiantsList);
      setFilteredEtudiants(etudiantsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await fetch(PROMOTIONS_API_URL);
      if (response.ok) {
        const data = await response.json();
        setPromotions(data.results || data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des promotions", err);
    }
  };

  useEffect(() => {
    fetchEtudiants();
    fetchPromotions();
  }, []);

  useEffect(() => {
    let result = [...etudiants];

    if (searchTerm) {
      result = result.filter(
        (e) =>
          e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sexeFilter) {
      result = result.filter((e) => e.sexe === sexeFilter);
    }

    if (promotionFilter) {
      result = result.filter((e) => e.promotion_id === promotionFilter);
    }

    setFilteredEtudiants(result);
  }, [searchTerm, sexeFilter, promotionFilter, etudiants]);

  const handleNewEtudiant = () => {
    setEditingEtudiant(null);
    setFormData({
      email: "",
      nom: "",
      prenom: "",
      sexe: "",
      telephone: "",
      date_naissance: "",
      lieu_naissance: "",
      adresse: "",
      promotion_id: "",
      motDePasse: generatePassword(),
    });
    setIsModalOpen(true);
  };

  const handleEditEtudiant = (etudiant: Etudiant) => {
    setEditingEtudiant(etudiant);
    setFormData({
      email: etudiant.email,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      sexe: etudiant.sexe,
      telephone: etudiant.telephone,
      date_naissance: etudiant.date_naissance || "",
      lieu_naissance: etudiant.lieu_naissance || "",
      adresse: etudiant.adresse || "",
      promotion_id: etudiant.promotion_id || "",
      motDePasse: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEtudiant(null);
    setFormData({
      email: "",
      nom: "",
      prenom: "",
      sexe: "",
      telephone: "",
      date_naissance: "",
      lieu_naissance: "",
      adresse: "",
      promotion_id: "",
      motDePasse: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.email ||
      !formData.nom ||
      !formData.prenom ||
      !formData.sexe
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const url = editingEtudiant
        ? `${API_URL}${editingEtudiant.id}/`
        : API_URL;
      const method = editingEtudiant ? "PATCH" : "POST";

      const payload = editingEtudiant
        ? {
            user: {
              email: formData.email,
              nom: formData.nom,
              prenom: formData.prenom,
              sexe: formData.sexe,
              telephone: formData.telephone,
            },
            date_naissance: formData.date_naissance || null,
            lieu_naissance: formData.lieu_naissance || null,
            adresse: formData.adresse || null,
            promotion_id: formData.promotion_id || null,
          }
        : {
            user: {
              email: formData.email,
              nom: formData.nom,
              prenom: formData.prenom,
              sexe: formData.sexe,
              telephone: formData.telephone,
            },
            password: String(formData.motDePasse),
            date_naissance: formData.date_naissance || null,
            lieu_naissance: formData.lieu_naissance || null,
            adresse: formData.adresse || null,
            promotion_id: formData.promotion_id || null,
          };

      if (
        !editingEtudiant &&
        (!formData.motDePasse ||
          String(formData.motDePasse).length < 8 ||
          /^\d+$/.test(String(formData.motDePasse)))
      ) {
        setError(
          "Le mot de passe généré est invalide (min 8 caractères et ne peut pas être uniquement numérique)."
        );
        setSubmitting(false);
        return;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const msg =
          errData && typeof errData === "object"
            ? JSON.stringify(errData)
            : errData?.detail || "Erreur lors de l'enregistrement";
        setError(msg);
        throw new Error(msg);
      }

      await fetchEtudiants();
      handleCloseModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEtudiant = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await fetchEtudiants();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSexeFilter("");
    setPromotionFilter("");
  };

  const generatePassword = (length = 12) => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";

    let pwd = "";
    pwd += upper[Math.floor(Math.random() * upper.length)];
    pwd += lower[Math.floor(Math.random() * lower.length)];
    pwd += digits[Math.floor(Math.random() * digits.length)];
    pwd += symbols[Math.floor(Math.random() * symbols.length)];

    const all = upper + lower + digits + symbols;
    for (let i = 4; i < length; i++) {
      pwd += all[Math.floor(Math.random() * all.length)];
    }

    pwd = pwd
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    if (pwd.length < 8 || /^\d+$/.test(pwd)) return generatePassword(length);
    return pwd;
  };

  const getPromotionName = (promotionId?: string) => {
    if (!promotionId) return "-";
    const promo = promotions.find((p) => p.id === promotionId);
    return promo ? promo.nom : "-";
  };

  return (
    <div className=" m-0 w-full flex-1 p-2 bg-linear-to-br from-gray-50 to-gray-100 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <GraduationCap className="text-purple-600 w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des Étudiants
                </h1>
              </div>
              <p className="text-gray-600 ml-12">
                Gérez vos étudiants et leurs informations académiques
              </p>
            </div>
            <button
              onClick={handleNewEtudiant}
              className="flex items-center gap-3 bg-linear-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={22} />
              <span className="font-semibold">Nouvel Étudiant</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="text-gray-500 w-5 h-5" />
              <h3 className="font-semibold text-gray-700">
                Filtres et Recherche
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom, prénom ou email..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <select
                  value={sexeFilter}
                  onChange={(e) => setSexeFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                >
                  <option value="">Tous les sexes</option>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>

              <div className="flex gap-3">
                <select
                  value={promotionFilter}
                  onChange={(e) => setPromotionFilter(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                >
                  <option value="">Toutes les promotions</option>
                  {promotions.map((promo) => (
                    <option key={promo.id} value={promo.id}>
                      {promo.nom}
                    </option>
                  ))}
                </select>

                {(searchTerm || sexeFilter || promotionFilter) && (
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors border-2 border-gray-300 font-medium"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            {filteredEtudiants.length !== etudiants.length && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg font-medium">
                  {filteredEtudiants.length} résultat
                  {filteredEtudiants.length > 1 ? "s" : ""}
                </div>
                <span className="text-gray-600">
                  sur {etudiants.length} étudiants
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-linear-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 shadow-lg">
            <AlertCircle size={24} className="shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm text-red-600 mt-1">
                Veuillez vérifier vos informations et réessayer.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2
                className="animate-spin text-purple-600 mb-4"
                size={48}
              />
              <p className="text-gray-600">Chargement des étudiants...</p>
            </div>
          ) : filteredEtudiants.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm || sexeFilter || promotionFilter
                  ? "Aucun étudiant trouvé"
                  : "Aucun étudiant enregistré"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || sexeFilter || promotionFilter
                  ? "Aucun étudiant ne correspond à vos critères de recherche."
                  : "Commencez par ajouter votre premier étudiant à la liste."}
              </p>
              <button
                onClick={handleNewEtudiant}
                className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-semibold shadow-lg"
              >
                <Plus size={20} />
                Créer le premier étudiant
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Étudiant
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Promotion
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Date de naissance
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEtudiants.map((etudiant) => (
                    <tr
                      key={etudiant.id}
                      className="hover:bg-linear-to-r hover:from-purple-50/30 hover:to-purple-50/10 transition-all duration-200 group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              etudiant.sexe === "M"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            <span className="font-semibold">
                              {etudiant.prenom.charAt(0)}
                              {etudiant.nom.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 block">
                              {etudiant.prenom} {etudiant.nom}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                etudiant.sexe === "M"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-pink-100 text-pink-800"
                              }`}
                            >
                              {etudiant.sexe === "M" ? "Homme" : "Femme"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-gray-700">
                            {etudiant.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-gray-700">
                            {etudiant.telephone || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                          {getPromotionName(etudiant.promotion_id)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-gray-700">
                            {etudiant.date_naissance
                              ? new Date(
                                  etudiant.date_naissance
                                ).toLocaleDateString("fr-FR")
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditEtudiant(etudiant)}
                            className="p-2.5 bg-linear-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200 hover:shadow-md"
                            title="Modifier"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              etudiant.id && handleDeleteEtudiant(etudiant.id)
                            }
                            className="p-2.5 bg-linear-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200 hover:shadow-md"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  {editingEtudiant ? (
                    <Edit2 className="text-purple-600 w-6 h-6" />
                  ) : (
                    <Plus className="text-purple-600 w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingEtudiant
                      ? "Modifier l'étudiant"
                      : "Créer un nouvel étudiant"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {editingEtudiant
                      ? "Modifiez les informations de l'étudiant"
                      : "Remplissez les informations du nouvel étudiant"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    placeholder="Jean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse e-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="jean.dupont@etudiant.fr"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    placeholder="01 23 45 67 89"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sexe <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                  >
                    <option value="">Sélectionnez le sexe</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="date_naissance"
                    value={formData.date_naissance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lieu de naissance
                  </label>
                  <input
                    type="text"
                    name="lieu_naissance"
                    value={formData.lieu_naissance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    placeholder="Paris, France"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse
                </label>
                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="123 Rue de l'Université, 75000 Paris"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Promotion
                  </label>
                  <select
                    name="promotion_id"
                    value={formData.promotion_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                  >
                    <option value="">Sélectionnez une promotion</option>
                    {promotions.map((promo) => (
                      <option key={promo.id} value={promo.id}>
                        {promo.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {!editingEtudiant && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mot de passe généré
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="motDePasse"
                        value={formData.motDePasse}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                        placeholder="Mot de passe"
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            motDePasse: generatePassword(),
                          }))
                        }
                        className="px-4 py-3 bg-linear-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-medium"
                      >
                        Régénérer
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Le mot de passe doit contenir au moins 8 caractères et ne
                      pas être uniquement numérique.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="font-medium">Erreur</span>
                  </div>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Enregistrement...
                    </>
                  ) : editingEtudiant ? (
                    "Mettre à jour"
                  ) : (
                    "Créer l'étudiant"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EtudiantsList;
