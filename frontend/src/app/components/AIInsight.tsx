import { Brain, Info } from "lucide-react";
import { Alert } from "./ui/alert";

interface AIInsightProps {
  title: string;
  description: string;
  type?: "info" | "success" | "warning";
}

export function AIInsight({ title, description, type = "info" }: AIInsightProps) {
  const colors = {
    info: "border-blue-200 bg-blue-50",
    success: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
  };

  return (
    <Alert className={`${colors[type]} border-l-4`}>
      <div className="flex gap-3">
        <div className="mt-0.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#1E3A8A] flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{title}</h4>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Alert>
  );
}
