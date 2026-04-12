import { Suspense } from "react";
import EMICalculator from "@/components/ui/EMICalculator";

export default function EMICalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 py-12" />}>
      <EMICalculator />
    </Suspense>
  );
}

export const metadata = {
  title: "EMI Calculator | Real Estate India",
  description: "Calculate your monthly EMI for home loans in India. Plan your property purchase with accurate EMI calculations.",
};
