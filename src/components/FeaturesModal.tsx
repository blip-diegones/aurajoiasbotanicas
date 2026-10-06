import React from "react";
import { FeaturesSectionWithHoverEffectsDemo } from "@/components/demo";
import { X, Sparkles } from "lucide-react";

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeaturesModal: React.FC<FeaturesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2825]/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-3xl p-6 sm:p-8 border border-[#E7DECB] shadow-elevated relative my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E7DECB] sticky top-0 bg-white z-20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#AD8D62]" />
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#2D2825]">
                Diferenciais & Tecnologia Aura
              </h2>
              <p className="text-xs text-[#75583E]">
                Componente FeaturesSectionWithHoverEffects integrado
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#75583E] hover:text-[#2D2825] hover:bg-[#FAF8F5] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-4">
          <FeaturesSectionWithHoverEffectsDemo />
        </div>
      </div>
    </div>
  );
};
