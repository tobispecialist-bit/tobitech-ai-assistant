import { useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, CreditCard, Building2, Crown, Sparkles, Zap, 
  MessageSquare, BarChart3, Share2, Bot, Calendar, Bell
} from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Missing VITE_STRIPE_PUBLIC_KEY - Stripe payments will be disabled');
}
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard',
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to TOBI TECH AI Pro!",
        description: "Your subscription is now active.",
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {isLoading ? "Processing..." : "Subscribe Now"}
      </Button>
    </form>
  );
};

const BankTransferForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBankTransfer = async () => {
    setIsLoading(true);
    try {
      // Here you would integrate with Flutterwave, Paystack, or other bank transfer APIs
      toast({
        title: "Bank Transfer Instructions",
        description: "Please check your email for bank transfer details and instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process bank transfer request. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Bank Transfer Details</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Account Name:</span>
            <span className="font-medium">TOBI TECH AI LTD</span>
          </div>
          <div className="flex justify-between">
            <span>Account Number:</span>
            <span className="font-medium">1234567890</span>
          </div>
          <div className="flex justify-between">
            <span>Bank:</span>
            <span className="font-medium">First Bank Nigeria</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium text-purple-400">₦15,000/month</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
          <p className="text-amber-300 text-sm">
            <strong>Important:</strong> Please include your email address as the transfer reference 
            so we can activate your account quickly.
          </p>
        </div>
      </div>

      <Button 
        onClick={handleBankTransfer}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Building2 className="w-4 h-4 mr-2" />
        {isLoading ? "Processing..." : "Confirm Bank Transfer"}
      </Button>
    </div>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const { toast } = useToast();

  useEffect(() => {
    if (paymentMethod === 'card' && stripePromise) {
      // Create subscription for card payment
      apiRequest("POST", "/api/get-or-create-subscription")
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Subscription error:", error);
          toast({
            title: "Setup Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [paymentMethod, toast]);

  const features = [
    {
      icon: <Bot className="w-5 h-5" />,
      title: "TOBI TECH AI Assistant",
      description: "Advanced AI-powered marketing insights and content generation"
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: "Multi-Platform Publishing",
      description: "Instagram, Facebook, Twitter/X, TikTok, WhatsApp, Telegram"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Advanced Analytics",
      description: "Real-time performance tracking and audience insights"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Smart Scheduling",
      description: "AI-optimized posting times for maximum engagement"
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Automated Reminders",
      description: "Never miss important marketing tasks or deadlines"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Form Integration",
      description: "Google Forms monitoring with automatic ad generation"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-purple-400 mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TOBI TECH AI Pro
            </h1>
          </div>
          <p className="text-xl text-gray-400 mb-6">
            Supercharge your marketing with AI-powered automation
          </p>
          
          {/* Pricing */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">$39/month</div>
              <div className="text-gray-400">USD (Card Payment)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">₦15,000/month</div>
              <div className="text-gray-400">NGN (Bank Transfer)</div>
            </div>
          </div>

          {/* 3-Day Free Trial Badge */}
          <Badge className="bg-green-600 text-white px-4 py-2 text-lg mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            3-Day Free Trial Included
          </Badge>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="text-purple-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-center">Choose Your Payment Method</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Select your preferred payment option to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'bank')}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="card" className="data-[state=active]:bg-purple-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Card Payment
                </TabsTrigger>
                <TabsTrigger value="bank" className="data-[state=active]:bg-green-600">
                  <Building2 className="w-4 h-4 mr-2" />
                  Bank Transfer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="mt-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Secure Card Payment</h3>
                  <p className="text-gray-400">$39/month • Instant activation • Cancel anytime</p>
                </div>

                {stripePromise && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <SubscribeForm />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    {paymentMethod === 'card' && (
                      <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bank" className="mt-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Bank Transfer (Nigeria)</h3>
                  <p className="text-gray-400">₦15,000/month • 24-hour activation • Local banking</p>
                </div>
                <BankTransferForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">What's Included in Your Free Trial</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Full access to AI assistant
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Connect all social platforms
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Advanced analytics dashboard
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Automated content scheduling
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Form integration monitoring
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                24/7 customer support
              </div>
            </div>
            
            <div className="mt-6 text-xs text-gray-500">
              <p>No setup fees • Cancel anytime • 30-day money-back guarantee</p>
              <p className="mt-2">By subscribing, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}