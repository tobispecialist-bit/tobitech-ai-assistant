import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, BarChart3, Zap, Users, Brain, TrendingUp, Shield, 
  Bot, Instagram, Facebook, Twitter, MessageCircle, Play, Share2,
  Calendar, Bell, Lightbulb, Crown, Sparkles
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Bot className="w-8 h-8 text-purple-400 mr-3" />
            <Badge className="bg-purple-600 text-white px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Marketing Automation
            </Badge>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Meet{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TOBI TECH AI
            </span>
            <br />
            Your Marketing Assistant
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Automate your social media marketing across Instagram, Facebook, Twitter/X, TikTok, WhatsApp, and Telegram. 
            Get AI-powered insights, content suggestions, and automated reminders to grow your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 bg-purple-600 hover:bg-purple-700" asChild>
              <a href="/api/login">
                Start 3-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 border-gray-700 text-white hover:bg-gray-800">
              Watch Demo
            </Button>
          </div>

          {/* Platform Icons */}
          <div className="flex items-center justify-center space-x-6 text-gray-400">
            <p className="text-sm">Works with:</p>
            <Instagram className="w-6 h-6" />
            <Facebook className="w-6 h-6" />
            <Twitter className="w-6 h-6" />
            <Play className="w-6 h-6" />
            <MessageCircle className="w-6 h-6" />
            <Share2 className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to dominate social media
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              TOBI TECH AI combines advanced automation, intelligent insights, and multi-platform management 
              to help store owners, marketers, and creators scale their reach effortlessly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <Bot className="h-10 w-10 text-purple-400 mb-4" />
                <CardTitle className="text-white">AI Assistant</CardTitle>
                <CardDescription className="text-gray-400">
                  Chat with TOBI TECH AI for personalized marketing strategies, content ideas, and performance insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <Share2 className="h-10 w-10 text-blue-400 mb-4" />
                <CardTitle className="text-white">Multi-Platform Publishing</CardTitle>
                <CardDescription className="text-gray-400">
                  Schedule and publish content across Instagram, Facebook, Twitter/X, TikTok, WhatsApp, and Telegram.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <Calendar className="h-10 w-10 text-green-400 mb-4" />
                <CardTitle className="text-white">Smart Scheduling</CardTitle>
                <CardDescription className="text-gray-400">
                  AI-optimized posting times and automated content scheduling for maximum engagement.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-pink-400 mb-4" />
                <CardTitle className="text-white">Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time performance tracking, audience insights, and conversion analytics across all platforms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <Bell className="h-10 w-10 text-orange-400 mb-4" />
                <CardTitle className="text-white">Daily Reminders</CardTitle>
                <CardDescription className="text-gray-400">
                  Never miss important marketing tasks with automated reminders and task management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-yellow-400 mb-4" />
                <CardTitle className="text-white">Content Suggestions</CardTitle>
                <CardDescription className="text-gray-400">
                  AI-generated content ideas, hashtag recommendations, and platform-specific optimizations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by creators and businesses worldwide
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-white">Sarah J.</h4>
                    <p className="text-gray-400 text-sm">E-commerce Store Owner</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "TOBI TECH AI helped me increase my Instagram engagement by 300% in just 2 months. 
                  The automated posting and AI insights are game-changers!"
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-white">Mike T.</h4>
                    <p className="text-gray-400 text-sm">Digital Marketer</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "The form integration is incredible. I get notified instantly when someone submits 
                  a lead form, and the AI even generates follow-up ads automatically."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-white">Alex R.</h4>
                    <p className="text-gray-400 text-sm">Content Creator</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "Managing 6 social media platforms was overwhelming until I found TOBI TECH AI. 
                  Now everything runs automatically while I focus on creating content."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <Crown className="w-12 h-12 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to transform your marketing?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of creators and businesses using TOBI TECH AI to automate their social media success.
          </p>
          
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">$39/month</div>
              <div className="text-gray-400">USD (Card)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">₦15,000/month</div>
              <div className="text-gray-400">NGN (Bank Transfer)</div>
            </div>
          </div>

          <Badge className="bg-green-600 text-white px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            3-Day Free Trial • No Credit Card Required
          </Badge>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-purple-600 hover:bg-purple-700" asChild>
              <a href="/api/login">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 border-gray-700 text-white hover:bg-gray-800" asChild>
              <a href="/subscribe">
                View Pricing
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Bot className="w-6 h-6 text-purple-400 mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TOBI TECH AI
            </span>
          </div>
          <p className="text-gray-400 mb-4">
            AI-powered marketing automation for the modern creator
          </p>
          <div className="flex items-center justify-center space-x-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}