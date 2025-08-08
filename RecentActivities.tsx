import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart3, Share, Mail, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: 'visualization' | 'post' | 'email' | 'analysis';
  title: string;
  description: string;
  timestamp: Date;
  status?: string;
}

export function RecentActivities() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'visualization',
      title: 'New visualization created',
      description: '"Q4 Social Media Performance"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      type: 'post',
      title: 'Instagram post scheduled',
      description: 'for 3:00 PM today',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'scheduled',
    },
    {
      id: '3',
      type: 'email',
      title: 'Email campaign sent',
      description: 'to 1,247 subscribers',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      status: 'completed',
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'visualization':
        return BarChart3;
      case 'post':
        return Share;
      case 'email':
        return Mail;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'visualization':
        return 'bg-primary/10 text-primary';
      case 'post':
        return 'bg-green-500/10 text-green-500';
      case 'email':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {activity.status && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(activity.status)}`}
                        >
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
