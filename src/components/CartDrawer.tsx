import React from "react";
import { Product } from "@/types/product";
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight, Sparkles } from "lucide-react";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckoutWhatsapp = () => {
    if (items.length === 0) return;

    let message = "Olá Aura Jóias Botânicas! Gostaria de fazer o pedido das seguintes peças exclusivas:\n\n";

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} (Qtd: ${item.quantity}) - ${item.product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
      message += `   Espécime: ${item.product.botanicSpecimen}\n`;
    });

    message += `\nTotal do Pedido: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
    message += "\n\nPoderia me informar sobre o frete e formas de pagamento?";

    const encoded = encodeURIComponent(message);
    // Link direto para WhatsApp Web / Mobile
    window.open(`https://wa.me/5511999999999?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#2D2825]/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E7DECB] shadow-elevated flex flex-col animate-in slide-in-from-right duration-300">
          {/* Topo da Sacola */}
          <div className="p-5 border-b border-[#E7DECB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4D8767]" />
              <h2 className="font-serif text-xl font-medium text-[#2D2825]">
                Sua Sacola de Biojoias
              </h2>
              <span className="text-xs bg-[#FAF8F5] text-[#75583E] px-2 py-0.5 rounded-full border border-[#E7DECB]">
                {items.length} {items.length === 1 ? "item" : "itens"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#75583E] hover:text-[#2D2825] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E7DECB] flex items-center justify-center text-[#94734E]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#2D2825]">
                  Sua sacola está vazia
                </h3>
                <p className="text-xs text-[#75583E] max-w-xs">
                  Toque em qualquer peça da lista para expandir seus detalhes e adicioná-la à sua sacola.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-[#2D2825] text-white rounded-xl text-xs font-medium hover:bg-[#443427] transition-all"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-[#E7DECB] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E7DECB] bg-white">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base font-medium text-[#2D2825] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#75583E] truncate">
                      {item.product.botanicSpecimen}
                    </p>
                    <div className="text-xs font-semibold text-[#2D2825] mt-1">
                      {item.product.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E7DECB]/60">
                      <div className="flex items-center gap-2 border border-[#E7DECB] bg-white rounded-lg px-1.5 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1 text-[#75583E] hover:text-[#2D2825]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium text-[#2D2825] px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 text-[#75583E] hover:text-[#2D2825]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rodapé e Fechamento */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E7DECB] bg-[#FAF8F5] space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#75583E]">
                  <span>Subtotal</span>
                  <span>
                    {total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#75583E]">
                  <span>Certificado de Garantia & Estojo</span>
                  <span className="text-[#4D8767] font-medium">Incluso</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold text-[#2D2825] pt-2 border-t border-[#E7DECB]">
                  <span>Total</span>
                  <span>
                    {total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutWhatsapp}
                className="w-full py-3.5 px-4 bg-[#3B6D51] hover:bg-[#305742] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Finalizar Pedido pelo WhatsApp</span>
              </button>

              <p className="text-[11px] text-center text-[#75583E]">
                Atendimento humanizado e personalizado diretamente pelo WhatsApp.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
