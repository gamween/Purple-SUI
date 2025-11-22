import { Check } from "lucide-react";
import { cn } from "../ui/utils";

interface Step {
  label: string;
  completed: boolean;
  active: boolean;
}

interface ProgressStepperProps {
  steps: Step[];
}

export function ProgressStepper({ steps }: ProgressStepperProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-4">
          {/* Step Circle */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                step.completed
                  ? "bg-green-500/20 border-green-500 text-green-400"
                  : step.active
                  ? "bg-purple-500/20 border-purple-500 text-purple-400 animate-pulse"
                  : "bg-slate-800 border-slate-700 text-slate-500"
              )}
            >
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{index + 1}</span>
              )}
            </div>
          </div>

          {/* Step Label */}
          <div className="flex-1">
            <p
              className={cn(
                "transition-colors duration-300",
                step.completed
                  ? "text-green-400"
                  : step.active
                  ? "text-white"
                  : "text-slate-500"
              )}
            >
              {step.label}
            </p>
            {step.completed && (
              <p className="text-xs text-slate-500 mt-0.5">Terminé ✓</p>
            )}
            {step.active && !step.completed && (
              <p className="text-xs text-purple-400 mt-0.5">En cours...</p>
            )}
          </div>

          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div className="absolute left-[35px] mt-14">
              <div
                className={cn(
                  "w-0.5 h-8 transition-colors duration-300",
                  step.completed ? "bg-green-500/50" : "bg-slate-700"
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}