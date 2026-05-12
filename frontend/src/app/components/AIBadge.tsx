import { Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";

interface AIBadgeProps {
  className?: string;
}

export function AIBadge({ className }: AIBadgeProps) {
  return (
    <Badge className={`bg-gradient-to-r from-[#7C3AED] to-[#1E3A8A] text-white ${className}`}>
      <Sparkles className="w-3 h-3 mr-1" />
      IA
    </Badge>
  );
}
