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
  Users,
  UserCog,
  Mail,
  Phone,
} from "lucide-react";

interface Formateur {
  id?: string;
  email: string;
  nom: string;
  prenom: string;
  sexe: string;
  telephone: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  motDePasse: string | number | readonly string[] | undefined;
}

function FormateursList() {
  const [formateurs, setFormateurs] = useState<Formateur[]>([]);
  const [filteredFormateurs, setFilteredFormateurs] = useState<Formateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormateur, setEditingFormateur] = useState<Formateur | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sexeFilter, setSexeFilter] = useState("");

  const [formData, setFormData] = useState<Formateur>({
    email: "",
    nom: "",
    prenom: "",
    sexe: "",
    telephone: "",
    motDePasse: "",
  });

  const API_URL = "http://127.0.0.1:8000/api/formateurs/";

  const fetchFormateurs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des formateurs");
      }

      const data = await response.json();
      const formateursList = data.results || data;
      setFormateurs(formateursList);
      setFilteredFormateurs(formateursList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormateurs();
  }, []);

  useEffect(() => {
    let result = [...formateurs];

    if (searchTerm) {
      result = result.filter(
        (f) =>
          f.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sexeFilter) {
      result = result.filter((f) => f.sexe === sexeFilter);
    }

    setFilteredFormateurs(result);
  }, [searchTerm, sexeFilter, formateurs]);

  const handleNewFormateur = () => {
    setEditingFormateur(null);
    setFormData({
      email: "",
      nom: "",
      prenom: "",
      sexe: "",
      telephone: "",
      motDePasse: generatePassword(), // <-- mot de passe auto-généré
    });
    setIsModalOpen(true);
  };

  const handleEditFormateur = (formateur: Formateur) => {
    setEditingFormateur(formateur);
    setFormData({
      email: formateur.email,
      nom: formateur.nom,
      prenom: formateur.prenom,
      sexe: formateur.sexe,
      telephone: formateur.telephone,
      motDePasse: formateur.motDePasse,
    });
    setIsModalOpen(true);
  };

  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFormateur(null);
    setFormData({
      email: "",
      nom: "",
      prenom: "",
      sexe: "",
      telephone: "",
      motDePasse: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      const url = editingFormateur
        ? `${API_URL}${editingFormateur.id}/`
        : API_URL;

      const method = editingFormateur ? "PATCH" : "POST";

      // Build payload to match backend
      const payload = editingFormateur
        ? {
            user: {
              email: formData.email,
              nom: formData.nom,
              prenom: formData.prenom,
              sexe: formData.sexe,
              telephone: formData.telephone,
            },
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
          };

      // client-side password check (creation)
      if (
        !editingFormateur &&
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

      await fetchFormateurs();
      handleCloseModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFormateur = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce formateur ?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await fetchFormateurs();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSexeFilter("");
  };

  // Génère un mot de passe sécurisé conforme aux validateurs Django
  const generatePassword = (length = 12) => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";

    // Guarantee at least one char from each set
    let pwd = "";
    pwd += upper[Math.floor(Math.random() * upper.length)];
    pwd += lower[Math.floor(Math.random() * lower.length)];
    pwd += digits[Math.floor(Math.random() * digits.length)];
    pwd += symbols[Math.floor(Math.random() * symbols.length)];

    const all = upper + lower + digits + symbols;
    for (let i = 4; i < length; i++) {
      pwd += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle the characters
    pwd = pwd
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    // Safety checks: length >= 8 and not numeric-only
    if (pwd.length < 8 || /^\d+$/.test(pwd)) return generatePassword(length);
    return pwd;
  };

  return (
    <div className="m-auto w-auto flex-1 p-6 bg-linear-to-br from-gray-50 to-gray-100 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <UserCog className="text-blue-600 w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des Formateurs
                </h1>
              </div>
              <p className="text-gray-600 ml-12">
                Gérez vos formateurs et leurs informations
              </p>
            </div>
            <button
              onClick={handleNewFormateur}
              className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={22} />
              <span className="font-semibold">Nouveau Formateur</span>
            </button>
          </div>

          {/* Filters Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="text-gray-500 w-5 h-5" />
              <h3 className="font-semibold text-gray-700">
                Filtres et Recherche
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <select
                    value={sexeFilter}
                    onChange={(e) => setSexeFilter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Tous les sexes</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                </div>

                {(searchTerm || sexeFilter) && (
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors border-2 border-gray-300 font-medium"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            {filteredFormateurs.length !== formateurs.length && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
                  {filteredFormateurs.length} résultat
                  {filteredFormateurs.length > 1 ? "s" : ""}
                </div>
                <span className="text-gray-600">
                  sur {formateurs.length} formateurs
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 shadow-lg">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm text-red-600 mt-1">
                Veuillez vérifier vos informations et réessayer.
              </p>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-600">Chargement des formateurs...</p>
            </div>
          ) : filteredFormateurs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm || sexeFilter
                  ? "Aucun formateur trouvé"
                  : "Aucun formateur enregistré"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || sexeFilter
                  ? "Aucun formateur ne correspond à vos critères de recherche."
                  : "Commencez par ajouter votre premier formateur à la liste."}
              </p>
              <button
                onClick={handleNewFormateur}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
              >
                <Plus size={20} />
                Créer le premier formateur
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Prénom
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Sexe
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFormateurs.map((formateur) => (
                    <tr
                      key={formateur.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-blue-50/10 transition-all duration-200 group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              formateur.sexe === "M"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            <span className="font-semibold">
                              {formateur.prenom.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {formateur.prenom}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-medium text-gray-900">
                          {formateur.nom}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-gray-700">
                            {formateur.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-gray-700">
                            {formateur.telephone || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                            formateur.sexe === "M"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-pink-100 text-pink-800 border border-pink-200"
                          }`}
                        >
                          {formateur.sexe === "M" ? "👨 Homme" : "👩 Femme"}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditFormateur(formateur)}
                            className="p-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 hover:shadow-md group/edit"
                            title="Modifier"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              formateur.id &&
                              handleDeleteFormateur(formateur.id)
                            }
                            className="p-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200 hover:shadow-md group/delete"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  {editingFormateur ? (
                    <Edit2 className="text-blue-600 w-6 h-6" />
                  ) : (
                    <Plus className="text-blue-600 w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingFormateur
                      ? "Modifier le formateur"
                      : "Créer un nouveau formateur"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {editingFormateur
                      ? "Modifiez les informations du formateur"
                      : "Remplissez les informations du nouveau formateur"}
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="jean.dupont@universite.fr"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="">Sélectionnez le sexe</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                  </select>
                </div>
              </div>

              {!editingFormateur && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mot de passe généré <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={String(formData.motDePasse || "")}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          String(formData.motDePasse || "")
                        )
                      }
                      className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                      Copier
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          motDePasse: generatePassword(),
                        }))
                      }
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                    >
                      Regénérer
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Un mot de passe sécurisé est généré automatiquement (min 8
                    caractères).
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold border-2 border-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  {submitting && <Loader2 className="animate-spin" size={20} />}
                  {editingFormateur ? "Mettre à jour" : "Créer le formateur"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormateursList;
