import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  TrendingUp, Users, Target, BarChart3, Plus, MessageSquare, Lightbulb, 
  Calendar, Bell, Globe, Smartphone, Share2, Settings, CheckCircle2,
  Instagram, Facebook, Twitter, MessageCircle, Play, Send, Menu, X
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AIAssistantFloat } from "@/components/AIAssistant";
import { useState } from "react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized", 
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: dashboardData } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: isAuthenticated,
  });

  const { data: platforms } = useQuery({
    queryKey: ['/api/platforms'],
    enabled: isAuthenticated,
  });

  const { data: reminders } = useQuery({
    queryKey: ['/api/reminders'],
    enabled: isAuthenticated,
  });

  const { data: contentSuggestions } = useQuery({
    queryKey: ['/api/content-suggestions'],
    enabled: isAuthenticated,
  });

  const { data: formSubmissions } = useQuery({
    queryKey: ['/api/form-submissions'],
    enabled: isAuthenticated,
  });

  const completeReminderMutation = useMutation({
    mutationFn: (data: { id: string; completed: boolean }) =>
      apiRequest("PATCH", `/api/reminders/${data.id}/complete`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({
        title: "Reminder Updated",
        description: "Task status has been updated successfully.",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Enhanced sample data for TOBI TECH AI
  const analyticsData = [
    { name: 'Mon', Instagram: 2400, Facebook: 1400, Twitter: 1200, TikTok: 800, WhatsApp: 300 },
    { name: 'Tue', Instagram: 1398, Facebook: 2210, Twitter: 1800, TikTok: 967, WhatsApp: 450 },
    { name: 'Wed', Instagram: 9800, Facebook: 2290, Twitter: 1400, TikTok: 1200, WhatsApp: 380 },
    { name: 'Thu', Instagram: 3908, Facebook: 2000, Twitter: 1600, TikTok: 1100, WhatsApp: 420 },
    { name: 'Fri', Instagram: 4800, Facebook: 2181, Twitter: 1900, TikTok: 1300, WhatsApp: 500 },
    { name: 'Sat', Instagram: 3800, Facebook: 2500, Twitter: 1700, TikTok: 1400, WhatsApp: 390 },
    { name: 'Sun', Instagram: 4300, Facebook: 2100, Twitter: 1500, TikTok: 1000, WhatsApp: 350 },
  ];

  const platformData = [
    { name: 'Instagram', value: 35, color: '#E1306C', connected: true },
    { name: 'Facebook', value: 25, color: '#1877F2', connected: true },
    { name: 'Twitter/X', value: 20, color: '#000000', connected: false },
    { name: 'TikTok', value: 15, color: '#000000', connected: true },
    { name: 'WhatsApp', value: 5, color: '#25D366', connected: false },
  ];

  const PlatformIcon = ({ name }: { name: string }) => {
    switch (name) {
      case 'Instagram': return <Instagram className="w-4 h-4" />;
      case 'Facebook': return <Facebook className="w-4 h-4" />;
      case 'Twitter/X': return <Twitter className="w-4 h-4" />;
      case 'TikTok': return <Play className="w-4 h-4" />;
      case 'WhatsApp': return <MessageCircle className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Mobile Header with Hamburger Menu */}
      <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            TOBI TECH AI
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
              <Share2 className="w-4 h-4 mr-2" />
              Content
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
              <Globe className="w-4 h-4 mr-2" />
              Platforms
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
              <Bell className="w-4 h-4 mr-2" />
              Automation
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
              <Lightbulb className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome back, {user?.firstName || 'Creator'}!
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Your AI-powered marketing automation hub
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Reach</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-white">{dashboardData?.stats?.totalViews || '45.2K'}</div>
              <p className="text-xs text-gray-400">
                <span className="text-green-400">+24.5%</span> this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Engagement</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-white">{dashboardData?.stats?.engagementRate || '8.7%'}</div>
              <p className="text-xs text-gray-400">
                <span className="text-green-400">+3.2%</span> this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Conversions</CardTitle>
              <Target className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-white">{dashboardData?.stats?.conversions || '342'}</div>
              <p className="text-xs text-gray-400">
                <span className="text-green-400">+15.8%</span> this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-white">${dashboardData?.stats?.revenue || '12.4K'}</div>
              <p className="text-xs text-gray-400">
                <span className="text-green-400">+28.1%</span> this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-900 border-gray-800">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="content" className="text-xs md:text-sm">Content</TabsTrigger>
            <TabsTrigger value="platforms" className="text-xs md:text-sm">Platforms</TabsTrigger>
            <TabsTrigger value="automation" className="text-xs md:text-sm">Automation</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs md:text-sm">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Weekly Performance</CardTitle>
                  <CardDescription className="text-gray-400">Platform engagement over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Area type="monotone" dataKey="Instagram" stackId="1" stroke="#E1306C" fill="#E1306C" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Facebook" stackId="1" stroke="#1877F2" fill="#1877F2" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="TikTok" stackId="1" stroke="#000000" fill="#666666" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="WhatsApp" stackId="1" stroke="#25D366" fill="#25D366" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Platform Distribution</CardTitle>
                  <CardDescription className="text-gray-400">Where your audience is most engaged</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformData.map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <PlatformIcon name={platform.name} />
                          <span className="text-sm font-medium text-white">{platform.name}</span>
                          {platform.connected && (
                            <Badge variant="secondary" className="text-xs bg-green-900 text-green-300">Connected</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${platform.value}%`,
                                backgroundColor: platform.color 
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 min-w-[35px]">{platform.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Connected Platforms</CardTitle>
                <CardDescription className="text-gray-400">Manage your social media integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Instagram', 'Facebook', 'Twitter/X', 'TikTok', 'WhatsApp', 'Telegram'].map((platform) => {
                    const isConnected = platforms?.some((p: any) => p.platform === platform && p.isActive);
                    return (
                      <Card key={platform} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <PlatformIcon name={platform} />
                              <span className="font-medium text-white">{platform}</span>
                            </div>
                            {isConnected ? (
                              <Badge className="bg-green-900 text-green-300">Connected</Badge>
                            ) : (
                              <Badge variant="outline" className="border-gray-600 text-gray-400">Disconnected</Badge>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant={isConnected ? "outline" : "default"}
                            className={isConnected ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "bg-purple-600 hover:bg-purple-700"}
                          >
                            {isConnected ? 'Manage' : 'Connect'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Reminders */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Bell className="w-5 h-5 mr-2" />
                    Daily Reminders
                  </CardTitle>
                  <CardDescription className="text-gray-400">Automated task tracking and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reminders?.slice(0, 5).map((reminder: any) => (
                      <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => completeReminderMutation.mutate({ 
                              id: reminder.id, 
                              completed: !reminder.completed 
                            })}
                            className="p-1 h-auto"
                          >
                            <CheckCircle2 className={`w-4 h-4 ${reminder.completed ? 'text-green-400' : 'text-gray-500'}`} />
                          </Button>
                          <div>
                            <p className={`text-sm font-medium ${reminder.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                              {reminder.title}
                            </p>
                            <p className="text-xs text-gray-400">{reminder.type}</p>
                          </div>
                        </div>
                        <Badge variant={reminder.completed ? "secondary" : "default"} className="text-xs">
                          {reminder.completed ? 'Done' : 'Pending'}
                        </Badge>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No reminders set up yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Form Submissions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Send className="w-5 h-5 mr-2" />
                    Form Submissions
                  </CardTitle>
                  <CardDescription className="text-gray-400">Google Forms integration monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formSubmissions?.slice(0, 5).map((submission: any) => (
                      <div key={submission.id} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={submission.status === 'converted' ? 'default' : 'secondary'} className="text-xs">
                            {submission.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">New lead submission</p>
                        {submission.adGenerated && (
                          <Badge className="mt-2 bg-purple-900 text-purple-300">AI Ad Generated</Badge>
                        )}
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-400">
                        <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No form submissions yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    TOBI TECH AI Insights
                  </CardTitle>
                  <CardDescription className="text-gray-400">Personalized recommendations from your AI assistant</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.insights?.slice(0, 3).map((insight: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg border-l-4 border-purple-500">
                        <Badge variant="secondary" className="mb-2 bg-purple-900 text-purple-300">
                          {insight.type}
                        </Badge>
                        <h4 className="font-medium text-white mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-400">{insight.description}</p>
                        <div className="mt-2 text-xs text-purple-400">
                          Confidence: {(insight.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    )) || (
                      <div className="p-4 bg-gray-800 rounded-lg border-l-4 border-purple-500">
                        <Badge variant="secondary" className="mb-2 bg-purple-900 text-purple-300">optimization</Badge>
                        <h4 className="font-medium text-white mb-1">Best posting times identified</h4>
                        <p className="text-sm text-gray-400">Your audience is most active between 2-4 PM and 7-9 PM. Schedule posts during these peak engagement windows.</p>
                        <div className="mt-2 text-xs text-purple-400">Confidence: 87%</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">AI Content Suggestions</CardTitle>
                  <CardDescription className="text-gray-400">Platform-specific content ideas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentSuggestions?.slice(0, 3).map((suggestion: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {suggestion.platform}
                          </Badge>
                          <span className="text-xs text-gray-400">{suggestion.bestTime}</span>
                        </div>
                        <p className="text-sm text-white mb-3">{suggestion.content}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {suggestion.hashtags?.map((tag: string, tagIndex: number) => (
                            <span key={tagIndex} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Use Template
                        </Button>
                      </div>
                    )) || (
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="border-gray-600 text-gray-300">Instagram</Badge>
                          <span className="text-xs text-gray-400">2:30 PM</span>
                        </div>
                        <p className="text-sm text-white mb-3">Share behind-the-scenes content of your creative process today!</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">#creative</span>
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">#process</span>
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">#inspiration</span>
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Use Template</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant */}
      <AIAssistantFloat />
    </div>
  );
}