import React, { useState, useEffect } from "react";
import { Product, CategoryFilter } from "@/types/product";
import { initialProducts } from "@/data/initialProducts";
import { Header } from "@/components/Header";
import { ExpandableProductList } from "@/components/ExpandableProductList";
import { CartDrawer, CartItem } from "@/components/CartDrawer";
import { ManagerDashboard } from "@/components/ManagerDashboard";
import { FeaturesModal } from "@/components/FeaturesModal";
import {
  Sparkles,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  ListFilter,
  LayoutGrid,
  List,
  Lock,
  Heart,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export function App() {
  // Estado dos produtos com persistência local
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("aura_joias_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Falha ao carregar produtos salvos", e);
      }
    }
    return initialProducts;
  });

  // Salvar no localStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem("aura_joias_products", JSON.stringify(products));
  }, [products]);

  // Filtros e busca
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Sacola de compras
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("aura_joias_cart");
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error("Falha ao carregar sacola", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("aura_joias_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isFeaturesDemoOpen, setIsFeaturesDemoOpen] = useState(false);

  // Manipulação da Sacola
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Checkout rápido de 1 produto para WhatsApp
  const handleQuickWhatsapp = (product: Product) => {
    const message = `Olá Aura Jóias Botânicas! Gostei muito da peça: ${product.name} (${product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}). Gostaria de tirar dúvidas sobre disponibilidade e envio!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5511999999999?text=${encoded}`, "_blank");
  };

  // Gerenciamento de Anúncios (Gerente)
  const handleSaveProduct = (updatedOrNew: Product) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === updatedOrNew.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = updatedOrNew;
        return copy;
      }
      return [updatedOrNew, ...prev];
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleTogglePause = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPaused: !p.isPaused } : p))
    );
  };

  const handleResetProducts = () => {
    setProducts(initialProducts);
  };

  // Filtragem dos produtos para a loja (excluindo os pausados)
  const availableProducts = products.filter((p) => !p.isPaused);

  const filteredProducts = availableProducts.filter((product) => {
    const matchesCategory =
      activeCategory === "Todas"
        ? true
        : product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.botanicSpecimen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2825] flex flex-col selection:bg-[#E7DECB] selection:text-[#2D2825]">
      {/* HEADER PRINCIPAL */}
      <Header
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenManager={() => setIsManagerOpen(true)}
        onOpenFeaturesDemo={() => setIsFeaturesDemoOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* HERO SECTION CLEAN & BOTÂNICA */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:pt-14 sm:pb-16 px-4 bg-gradient-to-b from-[#FAF8F5] via-[#F4F0E8]/70 to-[#FAF8F5] border-b border-[#E7DECB]/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7DECB] text-xs font-medium text-[#75583E] shadow-soft">
            <Leaf className="w-3.5 h-3.5 text-[#4D8767]" />
            <span>Colheita Consciente & Prata 925 Legítima</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#2D2825] font-normal tracking-tight leading-tight">
            A natureza eternizada em{" "}
            <span className="italic font-medium text-[#75583E]">
              joias com alma
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#5C4633] max-w-2xl mx-auto leading-relaxed">
            Flores, folhas e sementes reais preservadas em transparência
            cristalina e montadas artesanalmente em joalheria nobre. Cada peça é
            única e irrepetível.
          </p>

          {/* Selos de Confiança Clean */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#75583E]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#AD8D62]" />
              <span>Design botânico autoral</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-[#4D8767]" />
              <span>Espécimes botânicos reais</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#AD8D62]" />
              <span>Resina com proteção UV atóxica</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PRINCIPAL DA LOJA VIRTUAL */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 space-y-6">
        {/* BARRA DE CONTROLE: CATEGORIAS E MODO DE VISUALIZAÇÃO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E7DECB]">
          {/* Filtros de Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {(["Todas", "Colares", "Aneis"] as CategoryFilter[]).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    activeCategory === category
                      ? "bg-[#2D2825] text-white shadow-soft"
                      : "bg-white text-[#75583E] hover:bg-[#E7DECB]/50 border border-[#E7DECB]"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>

          {/* Contador e Alternador de Visão */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs text-[#75583E]">
            <span>
              Mostrando <strong>{filteredProducts.length}</strong> de{" "}
              {availableProducts.length} peças
            </span>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E7DECB]">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-[#FAF8F5] text-[#2D2825]"
                    : "text-[#94734E] hover:text-[#2D2825]"
                }`}
                title="Modo Lista com Expansão Animada"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#FAF8F5] text-[#2D2825]"
                    : "text-[#94734E] hover:text-[#2D2825]"
                }`}
                title="Modo Grade de Vitrine"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* INSTRUÇÃO SUTIL DE UX MOBILE FIRST */}
        <div className="bg-[#F4F0E8]/70 border border-[#E7DECB] rounded-2xl p-3 sm:p-4 text-xs text-[#5C4633] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#AD8D62] shrink-0" />
            <span>
              <strong>Experiência Tátil:</strong> Toque em qualquer linha da lista abaixo para expandi-la em um card completo com imagens e detalhes.
            </span>
          </div>
        </div>

        {/* LISTAGEM PRINCIPAL DE PRODUTOS */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#E7DECB] text-center space-y-3">
            <Leaf className="w-8 h-8 text-[#94734E] mx-auto" />
            <h3 className="font-serif text-xl font-medium text-[#2D2825]">
              Nenhuma joia encontrada
            </h3>
            <p className="text-xs text-[#75583E] max-w-sm mx-auto">
              Tente buscar por outro termo ou selecione a categoria "Todas" para
              visualizar todas as opções ativas.
            </p>
            <button
              onClick={() => {
                setActiveCategory("Todas");
                setSearchTerm("");
              }}
              className="mt-2 px-4 py-2 bg-[#2D2825] text-white text-xs rounded-xl hover:bg-[#443427] transition-all"
            >
              Ver Todas as Joias
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* MODO LISTA QUE SE EXPANDE EM CARD (REQUISITO PRINCIPAL) */
          <ExpandableProductList
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onOpenQuickWhatsapp={handleQuickWhatsapp}
          />
        ) : (
          /* MODO GRADE ALTERNATIVO */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#E7DECB] overflow-hidden shadow-soft hover:shadow-card transition-shadow flex flex-col"
              >
                <div className="aspect-square relative overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {product.isFeatured && (
                    <span className="absolute top-3 right-3 bg-[#2D2825]/90 text-white text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-full">
                      Destaque
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[#75583E] tracking-wider uppercase">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-[#2D2825] mt-0.5 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#75583E] mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E7DECB] flex items-center justify-between">
                    <div>
                      <span className="text-base font-semibold text-[#2D2825]">
                        {product.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-[#FAF8F5] hover:bg-[#E7DECB] text-[#2D2825] rounded-xl border border-[#E7DECB] transition-colors"
                        title="Adicionar à Sacola"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleQuickWhatsapp(product)}
                        className="px-3 py-1.5 bg-[#3B6D51] hover:bg-[#305742] text-white rounded-xl text-xs font-medium transition-colors"
                      >
                        Pedir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* RODAPÉ ELEGANTE E MINIMALISTA */}
      <footer className="border-t border-[#E7DECB] bg-white py-12 px-4 mt-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#75583E]">
          {/* Identidade */}
          <div className="space-y-3">
            <span className="font-serif text-2xl text-[#2D2825] block">
              Aura Jóias Botânicas
            </span>
            <p className="leading-relaxed text-[#5C4633]">
              Joalheria botânica contemporânea. Cada peça é um relicário natural
              confeccionado em prata de lei 925 e resina de qualidade joalheira.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/aurajoiasbotanicas/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#2D2825] hover:text-[#4D8767] font-medium"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@aurajoiasbotanicas</span>
              </a>
            </div>
          </div>

          {/* Cuidados e Envio */}
          <div className="space-y-2">
            <h4 className="font-serif text-base text-[#2D2825] font-semibold">
              Cuidados & Envio
            </h4>
            <ul className="space-y-1.5 text-[#5C4633]">
              <li>• Produção botânica 100% artesanal</li>
              <li>• Envio seguro para todo o Brasil</li>
              <li>• Embalagem cuidadosa e protegida</li>
              <li>• Peças antialérgicas e sem níquel</li>
            </ul>
          </div>

          {/* Contato & Gerência */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-[#2D2825] font-semibold">
              Atendimento Personalizado
            </h4>
            <p className="text-[#5C4633]">
              Dúvidas ou encomendas especiais sob medida? Fale conosco diretamente
              pelo WhatsApp.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsManagerOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] text-[#94734E] hover:text-[#2D2825] transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Acesso do Gerente (Senha 1234)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto pt-8 mt-8 border-t border-[#E7DECB]/60 text-center text-[11px] text-[#94734E]/80">
          © {new Date().getFullYear()} Aura Jóias Botânicas. Todos os direitos
          reservados.
        </div>
      </footer>

      {/* SACOLA DE COMPRAS LATERAL */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* PAINEL DO GERENTE (SENHA: 1234) */}
      {isManagerOpen && (
        <ManagerDashboard
          products={products}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onTogglePause={handleTogglePause}
          onResetProducts={handleResetProducts}
          onClose={() => setIsManagerOpen(false)}
        />
      )}

      {/* MODAL DO COMPONENTE FEATURES SOLICITADO */}
      <FeaturesModal
        isOpen={isFeaturesDemoOpen}
        onClose={() => setIsFeaturesDemoOpen(false)}
      />
    </div>
  );
}

export default App;
