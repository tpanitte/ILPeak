// src/features/ILPrograms/create-wizard/CreateProgramWizard.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Step1Config, ConfigFormData } from "./Step1Config";
import { Step2Review } from "./Step2Review";
import { generateProposedSchedule } from "./utils";

// Feature Imports
import { createProgramAction } from "../actions"; 
import { ProgramSession } from "../schema";

// IMPORT THE DEBUGGER
import { getDebugSessions, DEBUG_CONFIG } from "./debug";
// TOGGLE THIS: Set to 'true' to skip Step 1 and load image data
const IS_DEBUG = true;

export function CreateProgramWizard() {
  const router = useRouter();

  // State
  const [step, setStep] = useState<1 | 2>(IS_DEBUG ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [configData, setConfigData] = useState<ConfigFormData | null>(
    IS_DEBUG ? DEBUG_CONFIG : null
  );
  const [sessions, setSessions] = useState<ProgramSession[]>(IS_DEBUG ? getDebugSessions() : []);

  // Handlers
  const handleConfigComplete = (data: ConfigFormData) => {
    setConfigData(data);
    const proposed = generateProposedSchedule(data);
    setSessions(proposed);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = async (finalSessions: ProgramSession[]) => {
    if (!configData) return;
    setIsSubmitting(true);

    try {
      const result = await createProgramAction({
        name: configData.name,
        semester: "Spring 2026", // You can make this dynamic later if needed
        classroomDay: configData.classroomDay,
        sessions: finalSessions,
      });

      if (result.success) {
        toast.success(`Program "${configData.name}" created successfully`);
        router.push("/admin/programs");
      }
    } catch (error: any) {
      console.error("Failed to create program", error);
      toast.error(error.message || "Failed to create program");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Program</h1>
        <p className="text-muted-foreground">
          {step === 1
            ? "Step 1: Define schedule parameters and constraints."
            : "Step 2: Review and adjust the generated timeline."}
        </p>
      </div>

      <div className="flex justify-center w-full">
        {step === 1 && (
          <div className="w-full max-w-3xl">
            <Step1Config
              onNext={handleConfigComplete}
              defaultValues={configData || undefined}
            />
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-5xl">
            <Step2Review 
              sessions={sessions}
              isSubmitting={isSubmitting}
              onCreate={handleCreate}
              onBack={() => setStep(1)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
