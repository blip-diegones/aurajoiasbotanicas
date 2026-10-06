import React, { useState } from "react";
import { Product } from "@/types/product";
import {
  Lock,
  Unlock,
  Plus,
  Play,
  Pause,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
  Filter,
  ArrowLeft,
  Sparkles,
  Leaf,
  Layers,
  RotateCcw,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag,
} from "lucide-react";

interface ManagerDashboardProps {
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onTogglePause: (id: string) => void;
  onResetProducts: () => void;
  onClose: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  onTogglePause,
  onResetProducts,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("aura_manager_auth") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);

  // Estados de gestão
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);

  // Formulário
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    subtitle: "",
    category: "Colares",
    price: 180,
    originalPrice: undefined,
    image: "/products/colar-cafe.jpg",
    description: "",
    botanicSpecimen: "",
    material: "Cordão Regulável & Resina Cristalina UV",
    dimensions: "Pingente: 2,5 cm | Cordão ajustável",
    isPaused: false,
    isFeatured: false,
    stock: 5,
  });

  // Imagens reais disponíveis no acervo
  const presetImages = [
    { label: "Colar Café", path: "/products/colar-cafe.jpg" },
    { label: "Colar Margarida", path: "/products/colar-margarida.jpg" },
    { label: "Colar Trevo", path: "/products/colar-trevo.jpg" },
    { label: "Colar Erva-Doce", path: "/products/colar-erva-doce.jpg" },
    { label: "Colar Gota Flora", path: "/products/colar-botanico-1.jpg" },
    { label: "Colar Prisma", path: "/products/colar-botanico-3.jpg" },
    { label: "Anel Solitário", path: "/products/anel-botanico-1.jpg" },
    { label: "Trio Anéis", path: "/products/anel-botanico-2.jpg" },
    { label: "Anel Aliança", path: "/products/anel-botanico-3.jpg" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === "1234") {
      setIsAuthenticated(true);
      sessionStorage.setItem("aura_manager_auth", "true");
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("aura_manager_auth");
    setPasswordInput("");
  };

  const openCreateModal = () => {
    setFormData({
      id: "prod-" + Date.now(),
      name: "",
      subtitle: "",
      category: "Colares",
      price: 180,
      originalPrice: undefined,
      image: presetImages[0].path,
      description: "",
      botanicSpecimen: "",
      material: "Cordão Regulável & Resina Cristalina UV",
      dimensions: "Pingente: 2,5 cm | Cordão ajustável",
      isPaused: false,
      isFeatured: false,
      stock: 5,
      createdAt: new Date().toISOString().split("T")[0],
    });
    setEditingProduct(null);
    setIsCreatingNew(true);
  };

  const openEditModal = (product: Product) => {
    setFormData({ ...product });
    setEditingProduct(product);
    setIsCreatingNew(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) return;

    const saved: Product = {
      id: formData.id || "prod-" + Date.now(),
      name: formData.name || "Novo Anúncio Botânico",
      subtitle: formData.subtitle || "Biojoia Artesanal Botânica",
      category: (formData.category as any) || "Colares",
      price: Number(formData.price) || 0,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      image: formData.image || "/products/colar-cafe.jpg",
      additionalImages: formData.additionalImages || [],
      description:
        formData.description ||
        "Peça artesanal botânica com cordão regulável e flor natural eternizada.",
      botanicSpecimen: formData.botanicSpecimen || "Espécime silvestre",
      material: formData.material || "Cordão Regulável & Resina Cristalina UV",
      dimensions: formData.dimensions || "Padrão Aura",
      isPaused: !!formData.isPaused,
      isFeatured: !!formData.isFeatured,
      stock: Number(formData.stock) || 1,
      createdAt: formData.createdAt || new Date().toISOString().split("T")[0],
    };

    onSaveProduct(saved);
    setIsCreatingNew(false);
    setEditingProduct(null);
  };

  // Filtragem
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? !p.isPaused
        : p.isPaused;
    return matchesSearch && matchesStatus;
  });

  const totalActive = products.filter((p) => !p.isPaused).length;
  const totalPaused = products.filter((p) => p.isPaused).length;

  // TELA DE LOGIN (SENHA: 1234)
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2825]/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 sm:p-8 border border-[#E7DECB] shadow-elevated relative animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#75583E] hover:text-[#2D2825] p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#E7DECB] flex items-center justify-center text-[#75583E] shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl text-[#2D2825] font-semibold">
                Área do Gerente
              </h2>
              <p className="text-xs text-[#75583E] mt-1">
                Acesse o painel para gerenciar anúncios, preços e visibilidade
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#443427] mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="Digite 1234"
                  autoFocus
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    authError
                      ? "border-red-400 bg-red-50/50 text-red-900 focus:ring-1 focus:ring-red-400"
                      : "border-[#E7DECB] bg-[#FAF8F5] text-[#2D2825] focus:ring-1 focus:ring-[#4D8767] focus:bg-white"
                  }`}
                />
              </div>
              {authError && (
                <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Senha incorreta. A senha é 1234.</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#2D2825] hover:bg-[#443427] text-white rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-[#C4AA84]" />
              <span>Entrar no Painel</span>
            </button>

            <div className="text-center pt-2">
              <span className="text-[11px] text-[#94734E]/80">
                Dica de demonstração: senha padrão <strong>1234</strong>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // PAINEL AUTENTICADO
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FAF8F5] p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* BARRA SUPERIOR DO PAINEL */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E7DECB] shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FAF8F5] text-[#75583E] hover:text-[#2D2825] rounded-xl border border-[#E7DECB] transition-colors"
              title="Voltar para a Loja"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4D8767] animate-pulse" />
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2D2825]">
                  Gestão de Anúncios Aura
                </h1>
              </div>
              <p className="text-xs text-[#75583E] mt-0.5">
                Painel administrativo de produtos, catálogo e visibilidade
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onResetProducts}
              className="px-3 py-2 text-xs text-[#75583E] hover:text-[#2D2825] border border-[#E7DECB] rounded-xl hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
              title="Restaurar anúncios de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Restaurar Padrão</span>
            </button>

            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#3B6D51] hover:bg-[#305742] text-white rounded-xl text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Anúncio</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-[#94734E] hover:text-[#2D2825] hover:bg-stone-100 rounded-xl transition-colors"
              title="Desconectar da gerência"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E7DECB] shadow-soft">
            <span className="text-[11px] font-semibold text-[#75583E] tracking-wider uppercase">
              Total de Peças
            </span>
            <div className="text-2xl font-serif font-bold text-[#2D2825] mt-1">
              {products.length}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E7DECB] shadow-soft">
            <span className="text-[11px] font-semibold text-[#4D8767] tracking-wider uppercase">
              Anúncios Ativos
            </span>
            <div className="text-2xl font-serif font-bold text-[#3B6D51] mt-1">
              {totalActive}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E7DECB] shadow-soft">
            <span className="text-[11px] font-semibold text-[#94734E] tracking-wider uppercase">
              Pausados
            </span>
            <div className="text-2xl font-serif font-bold text-[#94734E] mt-1">
              {totalPaused}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E7DECB] shadow-soft">
            <span className="text-[11px] font-semibold text-[#AD8D62] tracking-wider uppercase">
              Destaques
            </span>
            <div className="text-2xl font-serif font-bold text-[#AD8D62] mt-1">
              {products.filter((p) => p.isFeatured).length}
            </div>
          </div>
        </div>

        {/* FILTROS E BUSCA */}
        <div className="bg-white p-4 rounded-2xl border border-[#E7DECB] shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#94734E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar anúncio no painel..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7DECB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4D8767] focus:bg-white text-[#2D2825]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-[#2D2825] text-white"
                  : "bg-[#FAF8F5] text-[#5C4633] hover:bg-[#E7DECB]"
              }`}
            >
              Todos ({products.length})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === "active"
                  ? "bg-[#3B6D51] text-white"
                  : "bg-[#FAF8F5] text-[#5C4633] hover:bg-[#E7DECB]"
              }`}
            >
              Ativos ({totalActive})
            </button>
            <button
              onClick={() => setStatusFilter("paused")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === "paused"
                  ? "bg-[#94734E] text-white"
                  : "bg-[#FAF8F5] text-[#5C4633] hover:bg-[#E7DECB]"
              }`}
            >
              Pausados ({totalPaused})
            </button>
          </div>
        </div>

        {/* LISTAGEM DE GESTÃO DOS ANÚNCIOS */}
        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-[#E7DECB] text-center space-y-2">
              <ShoppingBag className="w-8 h-8 text-[#94734E] mx-auto" />
              <p className="text-sm text-[#443427] font-medium">
                Nenhum anúncio encontrado com os filtros atuais.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  product.isPaused
                    ? "border-amber-200/80 bg-amber-50/20 opacity-80"
                    : "border-[#E7DECB] hover:border-[#D7C7AA]"
                }`}
              >
                {/* Detalhes do item */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-[#E7DECB] bg-[#FAF8F5] relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.isPaused && (
                      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center">
                        <Pause className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-lg font-medium text-[#2D2825] truncate">
                        {product.name}
                      </h3>
                      {product.isPaused ? (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Pausado
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Ativo na Loja
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#F4F0E8] text-[#75583E] border border-[#E7DECB]">
                          Destaque
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#75583E] truncate mt-0.5">
                      {product.category} • {product.botanicSpecimen}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-[#2D2825]">
                        {product.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <span className="text-[11px] text-[#75583E]">
                        (Estoque: {product.stock} un)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações Rápidas: Pausar/Ativar, Editar, Excluir */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#E7DECB]/60">
                  {/* Botão Pausar / Despausar */}
                  <button
                    onClick={() => onTogglePause(product.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                      product.isPaused
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                    }`}
                    title={product.isPaused ? "Reativar Anúncio" : "Pausar Anúncio"}
                  >
                    {product.isPaused ? (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Ativar</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pausar</span>
                      </>
                    )}
                  </button>

                  {/* Botão Editar */}
                  <button
                    onClick={() => openEditModal(product)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#443427] bg-[#FAF8F5] hover:bg-[#E7DECB] border border-[#E7DECB] transition-colors flex items-center gap-1.5"
                    title="Editar informações do produto"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#75583E]" />
                    <span>Editar</span>
                  </button>

                  {/* Botão Excluir */}
                  {showDeleteConfirmId === product.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onDeleteProduct(product.id);
                          setShowDeleteConfirmId(null);
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirmId(null)}
                        className="px-2 py-1.5 rounded-xl text-xs text-[#75583E] hover:bg-stone-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirmId(product.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Excluir anúncio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO DE ANÚNCIO */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D2825]/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-7 border border-[#E7DECB] shadow-elevated my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7DECB]">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#2D2825]">
                  {editingProduct ? "Editar Anúncio" : "Novo Anúncio da Coleção"}
                </h2>
                <p className="text-xs text-[#75583E] mt-0.5">
                  Preencha os detalhes da biojoia botânica para atualizar a loja
                </p>
              </div>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="text-[#75583E] hover:text-[#2D2825] p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#443427] mb-1">
                    Nome da Peça *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Colar Flor de Lavanda"
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DECB] text-xs text-[#2D2825] focus:outline-none focus:ring-1 focus:ring-[#4D8767] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#443427] mb-1">
                    Subtítulo Poético
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    placeholder="Ex: Pétalas Preservadas em Resina"
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DECB] text-xs text-[#2D2825] focus:outline-none focus:ring-1 focus:ring-[#4D8767] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#443427] mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.category || "Colares"}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DECB] text-xs text-[#2D2825] focus:outline-none focus:ring-1 focus:ring-[#4D8767] bg-[#FAF8F5]"
                  >
                    <option value="Colares">Colares</option>
                    <option value="Aneis">Anéis</option>
                    <option value="Brincos">Brincos</option>
                    <option value="Conjuntos">Conjuntos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#443427] mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) })
                    }
                    placeholder="189.00"
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DECB] text-xs text-[#2D2825] focus:outline-none focus:ring-1 focus:ring-[#4D8767] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#443427] mb-1">
                    Espécime Botânico
                  </label>
                  <input
                    type="text"
                    value={formData.botanicSpecimen || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, botanicSpecimen: e.target.value })
                    }
                    placeholder="Ex: Lavandula angustifolia"
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DECB] text-xs text-[#2D2825] focus:outline-none focus:ring-1 focus:ring-[#4D8767] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#443427] mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    value={formData.material || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, material: e.target.value })
                    }
                    placeholder="Cordão Regulável & Resina Cristalina UV"
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DECB] text-xs text-[#2D2825] focus:outline-none focus:ring-1 focus:ring-[#4D8767] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Seletor de Foto do Acervo Real */}
              <div>
                <label className="block text-xs font-medium text-[#443427] mb-1.5">
                  Foto do Produto (Escolha do acervo real ou informe caminho)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {presetImages.map((img) => (
                    <button
                      key={img.path}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.path })}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        formData.image === img.path
                          ? "border-[#4D8767] ring-2 ring-[#4D8767]/30 scale-105"
                          : "border-[#E7DECB] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.path}
                        alt={img.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="/products/colar-cafe.jpg ou URL"
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DECB] text-xs text-[#2D2825] focus:outline-none focus:ring-1 focus:ring-[#4D8767] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#443427] mb-1">
                  Descrição Artesanal
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Conte sobre o processo de colheita, preservação e história da peça..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DECB] text-xs text-[#2D2825] focus:outline-none focus:ring-1 focus:ring-[#4D8767] bg-[#FAF8F5]"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="rounded text-[#4D8767] focus:ring-[#4D8767] w-4 h-4"
                  />
                  <span className="text-xs text-[#443427] font-medium">
                    Destacar na vitrine
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isPaused || false}
                    onChange={(e) =>
                      setFormData({ ...formData, isPaused: e.target.checked })
                    }
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs text-[#443427] font-medium">
                    Pausar anúncio imediatamente
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E7DECB]">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#75583E] hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2D2825] hover:bg-[#443427] text-white rounded-xl text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#C4AA84]" />
                  <span>Salvar Anúncio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
