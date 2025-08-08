import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { BarChart3, Calendar, Search, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QuickActions() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Action Started",
      description: `${action} functionality will be implemented soon.`,
    });
  };

  const actions = [
    {
      icon: BarChart3,
      label: "Create Chart",
      action: "Chart creation",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Calendar,
      label: "Schedule Post",
      action: "Post scheduling",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Search,
      label: "Analyze Data",
      action: "Data analysis",
      color: "bg-green-500/10 text-green-500",
    },
    {
      icon: Mail,
      label: "Email Campaign",
      action: "Email campaign",
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Button
            key={action.action}
            variant="ghost"
            className="h-auto p-0 hover:scale-105 transition-transform"
            onClick={() => handleAction(action.action)}
          >
            <Card className="w-full hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.label}
                </div>
              </CardContent>
            </Card>
          </Button>
        ))}
      </div>
    </div>
  );
}
