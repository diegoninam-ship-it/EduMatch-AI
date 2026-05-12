import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export function StatCard({ title, value, icon: Icon, trend, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-[#1E3A8A]",
    purple: "bg-purple-100 text-[#7C3AED]",
    green: "bg-green-100 text-[#10B981]",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 mt-2">{trend}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
