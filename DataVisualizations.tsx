import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BarChart3, PieChart, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function DataVisualizations() {
  const chartData = [
    {
      title: "Engagement Trends",
      type: "line",
      icon: BarChart3,
      change: "+12.5%",
      changeType: "positive",
      description: "This week vs last week",
    },
    {
      title: "Platform Performance",
      type: "pie",
      icon: PieChart,
      platforms: [
        { name: "Instagram", percentage: 45 },
        { name: "TikTok", percentage: 32 },
        { name: "Facebook", percentage: 23 },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {chartData.map((chart, index) => (
        <Card key={index} className="group hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">{chart.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Export Data</DropdownMenuItem>
                <DropdownMenuItem>Share Chart</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            {/* Mock Chart Area */}
            <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <chart.icon className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Interactive chart will be rendered here</p>
              </div>
            </div>
            
            {/* Chart Details */}
            {chart.change && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{chart.description}</span>
                <span className={`font-semibold ${
                  chart.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {chart.change}
                </span>
              </div>
            )}
            
            {chart.platforms && (
              <div className="space-y-2">
                {chart.platforms.map((platform) => (
                  <div key={platform.name} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{platform.name}</span>
                    <span className="font-medium">{platform.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
            
            <Button
              variant="link"
              className="p-0 h-auto mt-4 text-primary hover:text-primary/80"
              size="sm"
            >
              View Details →
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
