import { useQuery } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Lightbulb } from "lucide-react";

interface DashboardData {
  stats: {
    totalViews: number;
    engagement: number;
    conversions: number;
    revenue: number;
  };
  insights: {
    type: string;
    title: string;
    description: string;
    confidence: number;
  };
}

export function DashboardHero() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-96 mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="h-8 bg-white/20 rounded mb-1"></div>
                    <div className="h-3 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-primary to-secondary text-white">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome back!</h2>
            <p className="text-indigo-100 mb-6">Here's your creative data insights for today</p>
            
            {/* AI Suggestions */}
            {data?.insights && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-6">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="text-white w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{data.insights.title}</h3>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          AI
                        </Badge>
                      </div>
                      <p className="text-sm text-indigo-100">{data.insights.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">
                  {data?.stats.totalViews.toLocaleString() || "0"}
                </div>
                <div className="text-xs text-indigo-100">Total Views</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">
                  {data?.stats.engagement || "0"}%
                </div>
                <div className="text-xs text-indigo-100">Engagement</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">
                  {data?.stats.conversions.toLocaleString() || "0"}
                </div>
                <div className="text-xs text-indigo-100">Conversions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">
                  ${(data?.stats.revenue || 0).toLocaleString()}
                </div>
                <div className="text-xs text-indigo-100">Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
