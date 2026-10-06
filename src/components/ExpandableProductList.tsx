import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/product";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Leaf,
  ShieldCheck,
  Ruler,
  Check,
  Eye,
} from "lucide-react";

interface ExpandableProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenQuickWhatsapp: (product: Product) => void;
}

export const ExpandableProductList: React.FC<ExpandableProductListProps> = ({
  products,
  onAddToCart,
  onOpenQuickWhatsapp,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedImageMap, setSelectedImageMap] = useState<Record<string, string>>({});
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAddToCartWithFeedback = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 1500);
  };

  const getCurrentImage = (product: Product) => {
    return selectedImageMap[product.id] || product.image;
  };

  const selectThumbImage = (productId: string, imgUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageMap((prev) => ({ ...prev, [productId]: imgUrl }));
  };

  return (
    <div className="w-full space-y-3">
      {products.map((product, index) => {
        const isExpanded = expandedId === product.id;
        const currentImg = getCurrentImage(product);
        const allImages = [product.image, ...(product.additionalImages || [])];
        const formattedIndex = String(index + 1).padStart(2, "0");

        return (
          <motion.div
            key={product.id}
            layout
            transition={{
              layout: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] },
            }}
            className={`w-full rounded-2xl transition-shadow border ${
              isExpanded
                ? "bg-white border-[#D7C7AA] shadow-elevated overflow-hidden ring-1 ring-[#D7C7AA]/50"
                : "bg-white/80 hover:bg-white border-[#E7DECB] shadow-soft hover:shadow-card cursor-pointer"
            }`}
          >
            {/* LINHA DE LISTA (SEMPRE CLICÁVEL PARA EXPANDIR/RECOLHER) */}
            <div
              onClick={() => toggleExpand(product.id)}
              className="p-4 sm:p-5 flex items-center justify-between gap-3 select-none"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {/* Índice numérico sutil */}
                <span className="text-xs font-mono text-[#94734E]/60 font-semibold w-5 text-center shrink-0">
                  {formattedIndex}
                </span>

                {/* Miniatura circular do produto real */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border border-[#E7DECB] bg-[#FAF8F5] relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
                    loading="lazy"
                  />
                  {product.isFeatured && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#AD8D62] border border-white rounded-full" />
                  )}
                </div>

                {/* Nome e Categoria */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-[#2D2825] leading-snug truncate">
                      {product.name}
                    </h3>
                    {product.isFeatured && (
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#F4F0E8] text-[#75583E] border border-[#E7DECB] hidden sm:inline-block">
                        Destaque
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#75583E] truncate mt-0.5">
                    {product.subtitle}
                  </p>
                </div>
              </div>

              {/* Preço e Botão de Expansão */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-sm sm:text-base font-medium text-[#2D2825]">
                    {product.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  {product.originalPrice && (
                    <p className="text-[10px] line-through text-[#94734E]/70 hidden xs:block">
                      {product.originalPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  )}
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isExpanded
                      ? "bg-[#2D2825] text-white"
                      : "bg-[#F4F0E8] text-[#5C4633] hover:bg-[#E7DECB]"
                  }`}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>

            {/* CONTEÚDO EXPANDIDO: VIRA UM CARD COMPLETO EM ANIMAÇÃO */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
                  className="border-t border-[#E7DECB] bg-[#FAF8F5]/60"
                >
                  <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* LADO VISUAL: FOTO PRINCIPAL & MINIATURAS REAIS */}
                      <div className="space-y-3">
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[#E7DECB] bg-white shadow-inner group">
                          <img
                            src={currentImg}
                            alt={product.name}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            <span className="bg-[#2D2825]/85 backdrop-blur-sm text-[#FAF8F5] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">
                              Prata 925
                            </span>
                            <span className="bg-[#4D8767]/90 backdrop-blur-sm text-white text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Leaf className="w-3 h-3" />
                              Botânica Natural
                            </span>
                          </div>
                        </div>

                        {/* Galeria de miniaturas se tiver mais de uma foto */}
                        {allImages.length > 1 && (
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {allImages.map((img, i) => (
                              <button
                                key={i}
                                onClick={(e) => selectThumbImage(product.id, img, e)}
                                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                                  currentImg === img
                                    ? "border-[#4D8767] ring-1 ring-[#4D8767]/40 scale-105"
                                    : "border-[#E7DECB] opacity-70 hover:opacity-100"
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`${product.name} ângulo ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* LADO DE INFORMAÇÕES: DETALHES BOTÂNICOS E AÇÕES */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-[#75583E] font-medium tracking-wide uppercase">
                            <span>{product.category}</span>
                            <span>•</span>
                            <span>Peça Exclusiva</span>
                          </div>
                          <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2825] mt-1 font-medium leading-tight">
                            {product.name}
                          </h2>
                          <p className="text-sm text-[#75583E] mt-1 italic">
                            {product.subtitle}
                          </p>
                        </div>

                        {/* Preço e Parcelamento */}
                        <div className="p-3.5 bg-white rounded-xl border border-[#E7DECB]">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-semibold text-[#2D2825]">
                              {product.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm line-through text-[#94734E]/70">
                                {product.originalPrice.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#5C4633] mt-0.5">
                            Em até 3x sem juros de{" "}
                            {(product.price / 3).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </p>
                        </div>

                        {/* Descrição Completa */}
                        <p className="text-sm text-[#443427] leading-relaxed">
                          {product.description}
                        </p>

                        {/* Ficha Técnica Botânica */}
                        <div className="space-y-2 text-xs bg-white/70 p-3.5 rounded-xl border border-[#E7DECB]">
                          <div className="flex items-start gap-2 text-[#443427]">
                            <Leaf className="w-4 h-4 text-[#4D8767] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-[#2D2825]">
                                Espécime Botânico:{" "}
                              </span>
                              <span>{product.botanicSpecimen}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-[#443427]">
                            <ShieldCheck className="w-4 h-4 text-[#AD8D62] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-[#2D2825]">
                                Material:{" "}
                              </span>
                              <span>{product.material}</span>
                            </div>
                          </div>
                          {product.dimensions && (
                            <div className="flex items-start gap-2 text-[#443427]">
                              <Ruler className="w-4 h-4 text-[#75583E] shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-[#2D2825]">
                                  Dimensões:{" "}
                                </span>
                                <span>{product.dimensions}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Botões de Ação */}
                        <div className="pt-2 space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* Botão de Pedido via WhatsApp */}
                            <button
                              onClick={() => onOpenQuickWhatsapp(product)}
                              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3B6D51] hover:bg-[#305742] text-white rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Pedir pelo WhatsApp</span>
                            </button>

                            {/* Botão Adicionar à Sacola */}
                            <button
                              onClick={(e) => handleAddToCartWithFeedback(product, e)}
                              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#2D2825] hover:bg-[#443427] text-white rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
                            >
                              {addedAnimationId === product.id ? (
                                <>
                                  <Check className="w-4 h-4 text-[#A7F3D0]" />
                                  <span>Adicionado!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-4 h-4 text-[#C4AA84]" />
                                  <span>Adicionar à Sacola</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Botão Sutil para Recolher */}
                          <button
                            onClick={() => toggleExpand(product.id)}
                            className="w-full py-2 text-center text-xs text-[#75583E] hover:text-[#2D2825] transition-colors flex items-center justify-center gap-1"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Recolher para lista</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
