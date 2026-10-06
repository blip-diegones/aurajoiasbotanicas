import React from "react";
import { ShoppingBag, Lock, Sparkles, Search } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenManager: () => void;
  onOpenFeaturesDemo: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenManager,
  onOpenFeaturesDemo,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7DECB] transition-all">
      {/* Top Banner de aviso de frete / garantia */}
      <div className="bg-[#2D2825] text-[#FAF8F5] text-[11px] font-medium tracking-widest uppercase py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#C4AA84]" />
        <span>Joalheria Botânica Artesanal • Prata 925 & Flores Naturais Eternizadas</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Identidade Visual */}
        <div className="flex flex-col">
          <a href="#" className="group inline-flex flex-col">
            <span className="font-serif text-2xl sm:text-3xl tracking-wide text-[#2D2825] group-hover:text-[#4D8767] transition-colors leading-none">
              Aura
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#75583E] font-medium mt-0.5">
              Jóias Botânicas
            </span>
          </a>
        </div>

        {/* Barra de Busca (Desktop / Tablet) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-6 relative">
          <Search className="w-4 h-4 text-[#94734E] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por flor, colar, anel..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/70 border border-[#E7DECB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#4D8767] focus:bg-white transition-all text-[#2D2825] placeholder:text-[#94734E]/60"
          />
        </div>

        {/* Ações do Topo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Link Instagram Oficial */}
          <a
            href="https://www.instagram.com/aurajoiasbotanicas/"
            target="_blank"
            rel="noopener noreferrer"
            title="Siga no Instagram @aurajoiasbotanicas"
            className="p-2 text-[#75583E] hover:text-[#2D2825] hover:bg-[#E7DECB]/40 rounded-full transition-colors flex items-center gap-1.5 text-xs"
          >
            <InstagramIcon className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px] font-medium tracking-wide">@aurajoiasbotanicas</span>
          </a>

          {/* Botão Ver Diferenciais / Componente */}
          <button
            onClick={onOpenFeaturesDemo}
            title="Ver diferenciais da marca"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#75583E] hover:text-[#2D2825] hover:bg-[#E7DECB]/50 border border-[#E7DECB] rounded-full transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#AD8D62]" />
            <span>Diferenciais</span>
          </button>

          {/* Área do Gerente */}
          <button
            onClick={onOpenManager}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#5C4633] hover:text-[#2D2825] hover:bg-[#E7DECB]/60 rounded-full transition-colors border border-transparent hover:border-[#E7DECB]"
            title="Acesso da Gerência (Senha 1234)"
          >
            <Lock className="w-3.5 h-3.5 text-[#94734E]" />
            <span className="hidden sm:inline">Gerente</span>
          </button>

          {/* Sacola de Compras */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 bg-[#2D2825] hover:bg-[#443427] text-white px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm active:scale-95"
            title="Ver Sacola de Compras"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C4AA84]" />
            <span className="hidden xs:inline">Sacola</span>
            {cartCount > 0 && (
              <span className="ml-0.5 bg-[#4D8767] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Barra de Busca no Mobile */}
      <div className="md:hidden px-4 pb-2.5 pt-0.5">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#94734E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por flor, colar, anel ou detalhe..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/80 border border-[#E7DECB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#4D8767] focus:bg-white text-[#2D2825] placeholder:text-[#94734E]/60 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};
