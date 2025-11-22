import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Plus, X, Zap } from "lucide-react";
import { toast } from "sonner";

interface CreateBountyModalProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (bounty: any) => void;
}

export function CreateBountyModal({ open, onClose, onCreate }: CreateBountyModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    split: "70",
    duration: "",
  });

  const [requirements, setRequirements] = useState<string[]>([""]);

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const handleRemoveRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.amount || !formData.duration) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const validRequirements = requirements.filter(req => req.trim() !== "");
    if (validRequirements.length === 0) {
      toast.error("Ajoutez au moins une exigence");
      return;
    }

    // Créer la bounty
    const bounty = {
      ...formData,
      requirements: validRequirements,
    };

    if (onCreate) {
      onCreate(bounty);
    }

    toast.success("Bounty créée avec succès !");
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      amount: "",
      split: "70",
      duration: "",
    });
    setRequirements([""]);
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[80vh] flex flex-col p-0">
        <div className="px-6 pt-6 pb-4 border-b border-slate-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              Créer une nouvelle bounty
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-400">
              Créez une nouvelle bounty pour encourager les streamers à promouvoir votre projet.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Titre de la bounty *
            </Label>
            <Input
              id="title"
              placeholder="Ex: Promotion de Sui 8192 - Jeu puzzle blockchain"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre projet et vos objectifs..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
            />
          </div>

          {/* Requirements Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">
                Exigences du contrat *
              </Label>
              <Button
                type="button"
                onClick={handleAddRequirement}
                size="sm"
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une exigence
              </Button>
            </div>

            <div className="space-y-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 flex gap-2 items-center">
                    <span className="text-purple-400 font-semibold text-sm mt-2">
                      {index + 1}.
                    </span>
                    <Input
                      placeholder="Ex: Stream de 3 heures minimum"
                      value={requirement}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRequirement(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-xs">
              Ajoutez des exigences claires pour votre bounty (durée de stream, mentions, hashtags, etc.)
            </p>
          </div>

          {/* Amount and Split */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-slate-300">
                Montant total (SUI) *
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="100"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="split" className="text-slate-300">
                Split streamer (%)
              </Label>
              <Input
                id="split"
                type="number"
                min="0"
                max="100"
                value={formData.split}
                onChange={(e) => setFormData({ ...formData, split: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
              <p className="text-slate-500 text-xs">
                Le streamer recevra {formData.split}% des donations
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-slate-300">
              Durée de la bounty *
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="14"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <p className="text-slate-500 text-xs">
              Nombre de jours avant expiration
            </p>
          </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              Créer la bounty
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}