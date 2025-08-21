import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { GameInterface } from "@/components/game-interface";
import { useMedicalCase } from "@/hooks/use-medical-cases";

export default function Game() {
  const { id } = useParams<{ id: string }>();
  const { data: medicalCase, isLoading, error } = useMedicalCase(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading medical case...</p>
        </div>
      </div>
    );
  }

  if (error || !medicalCase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-red-700">Medical case not found or failed to load.</p>
            <a href="/training" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
              Return to Training
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Navigation />
      <GameInterface medicalCase={medicalCase} />
    </div>
  );
}
