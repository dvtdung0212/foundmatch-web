"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: number;
  title: string;
  description: string;
}

interface ReportStepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  variant?: "lost" | "found";
}

export function ReportStepper({
  steps,
  currentStep,
  onStepClick,
  variant = "lost",
}: ReportStepperProps) {
  const activeBg = variant === "lost" ? "bg-brand-plum text-white" : "bg-brand-found text-white";
  const activeBorder = variant === "lost" ? "border-brand-plum text-brand-plum" : "border-brand-found text-brand-found";

  return (
    <div className="w-full py-4">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex-1 flex items-center relative">
              {/* Step Node */}
              <button
                type="button"
                onClick={() => isCompleted && onStepClick && onStepClick(step.id)}
                disabled={!isCompleted}
                className={cn(
                  "flex items-center gap-3 text-left transition-all z-10",
                  isCompleted ? "cursor-pointer group" : "cursor-default"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all shrink-0 border-2",
                    isCompleted
                      ? `${activeBg} border-transparent shadow-xs`
                      : isCurrent
                      ? `${activeBg} border-white ring-4 ring-primary/15 shadow-sm`
                      : "bg-white border-brand-border text-brand-muted"
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>

                <div className="min-w-0 pr-4">
                  <div
                    className={cn(
                      "text-sm font-bold transition-colors truncate",
                      isCurrent
                        ? "text-brand-heading"
                        : isCompleted
                        ? "text-brand-muted group-hover:text-brand-heading"
                        : "text-brand-muted/70"
                    )}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-brand-muted truncate hidden lg:block">
                    {step.description}
                  </div>
                </div>
              </button>

              {/* Connecting Line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-all",
                    currentStep > step.id ? (variant === "lost" ? "bg-brand-plum" : "bg-brand-found") : "bg-brand-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden flex items-center justify-between p-3 rounded-2xl bg-brand-cream/60 border border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs", activeBg)}>
            {currentStep}
          </div>
          <div>
            <div className="text-xs font-bold text-brand-heading">
              {steps[currentStep - 1]?.title}
            </div>
            <div className="text-[10px] text-brand-muted">
              Bước {currentStep} trên {steps.length}
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "h-1.5 rounded-full transition-all",
                step.id === currentStep
                  ? cn("w-6", variant === "lost" ? "bg-brand-plum" : "bg-brand-found")
                  : step.id < currentStep
                  ? cn("w-2", variant === "lost" ? "bg-brand-plum/60" : "bg-brand-found/60")
                  : "w-2 bg-brand-border"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
