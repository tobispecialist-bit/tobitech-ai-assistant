import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { chatWithAI, generateInsights, generateContentSuggestions, analyzeContentPerformance } from "./openai";
import { 
  insertPostSchema, 
  insertEmailCampaignSchema, 
  insertVisualizationSchema,
  insertTaskReminderSchema,
  insertFormSubmissionSchema,
  insertConnectedPlatformSchema,
  insertContentTemplateSchema,
} from "@shared/schema";

// Initialize Stripe if secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard data
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Generate sample analytics data for demo
      const sampleAnalytics = [
        { platform: 'Instagram', metric: 'views', value: 2400, date: new Date() },
        { platform: 'Instagram', metric: 'engagement', value: 18, date: new Date() },
        { platform: 'Facebook', metric: 'conversions', value: 156, date: new Date() },
        { platform: 'TikTok', metric: 'revenue', value: 3200, date: new Date() },
      ];
      
      // Get AI insights based on sample data
      const insights = await generateInsights(sampleAnalytics);
      
      // Get recent posts and campaigns
      const recentPosts = await storage.getUserPosts(userId);
      const recentCampaigns = await storage.getUserEmailCampaigns(userId);
      
      res.json({
        stats: {
          totalViews: 2400,
          engagement: 18,
          conversions: 156,
          revenue: 3200
        },
        insights: insights.length > 0 ? insights[0] : {
          type: 'suggestion',
          title: "Today's AI Insights",
          description: "Your Instagram engagement is up 23% this week. Consider posting similar content at 2 PM for optimal reach.",
          confidence: 0.85
        },
        recentPosts: recentPosts.slice(0, 5),
        recentCampaigns: recentCampaigns.slice(0, 3)
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Posts routes
  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPostSchema.parse({ ...req.body, userId });
      
      const post = await storage.createPost(validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getUserPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Email campaigns routes
  app.post('/api/campaigns', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertEmailCampaignSchema.parse({ ...req.body, userId });
      
      const campaign = await storage.createEmailCampaign(validatedData);
      res.json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(400).json({ message: "Failed to create campaign" });
    }
  });

  app.get('/api/campaigns', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const campaigns = await storage.getUserEmailCampaigns(userId);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Visualizations routes
  app.post('/api/visualizations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertVisualizationSchema.parse({ ...req.body, userId });
      
      const visualization = await storage.createVisualization(validatedData);
      res.json(visualization);
    } catch (error) {
      console.error("Error creating visualization:", error);
      res.status(400).json({ message: "Failed to create visualization" });
    }
  });

  app.get('/api/visualizations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const visualizations = await storage.getUserVisualizations(userId);
      res.json(visualizations);
    } catch (error) {
      console.error("Error fetching visualizations:", error);
      res.status(500).json({ message: "Failed to fetch visualizations" });
    }
  });

  // AI Chat routes
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;
      
      // Get or create conversation
      let conversation = await storage.getUserChatConversation(userId);
      if (!conversation) {
        conversation = await storage.createChatConversation({
          userId,
          messages: []
        });
      }
      
      const messages = conversation.messages as any[] || [];
      messages.push({ role: 'user', content: message });
      
      // Get AI response
      const aiResponse = await chatWithAI(messages);
      messages.push({ role: 'assistant', content: aiResponse });
      
      // Update conversation
      await storage.updateChatConversation(conversation.id, messages);
      
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get('/api/chat/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversation = await storage.getUserChatConversation(userId);
      res.json({ messages: conversation?.messages || [] });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Content suggestions
  app.get('/api/content-suggestions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const recentAnalytics = await storage.getUserAnalytics(userId);
      
      const suggestions = await generateContentSuggestions(user, recentAnalytics);
      res.json(suggestions);
    } catch (error) {
      console.error("Error generating content suggestions:", error);
      res.status(500).json({ message: "Failed to generate content suggestions" });
    }
  });

  // Task reminder routes
  app.post("/api/reminders", isAuthenticated, async (req: any, res) => {
    try {
      const reminderData = insertTaskReminderSchema.parse(req.body);
      const userId = req.user.claims.sub;
      
      const reminder = await storage.createTaskReminder({
        ...reminderData,
        userId
      });
      
      res.json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ message: "Failed to create reminder" });
    }
  });

  app.get("/api/reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminders = await storage.getUserTaskReminders(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.patch("/api/reminders/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      
      const reminder = await storage.updateTaskCompletion(id, completed);
      res.json(reminder);
    } catch (error) {
      console.error("Error updating reminder:", error);
      res.status(500).json({ message: "Failed to update reminder" });
    }
  });

  // Form submission routes
  app.post("/api/form-submissions", async (req, res) => {
    try {
      const submissionData = insertFormSubmissionSchema.parse(req.body);
      const submission = await storage.createFormSubmission(submissionData);
      res.json(submission);
    } catch (error) {
      console.error("Error creating form submission:", error);
      res.status(500).json({ message: "Failed to create form submission" });
    }
  });

  app.get("/api/form-submissions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { status } = req.query;
      
      const submissions = await storage.getUserFormSubmissions(userId, status as string);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching form submissions:", error);
      res.status(500).json({ message: "Failed to fetch form submissions" });
    }
  });

  // Connected platform routes
  app.post("/api/platforms", isAuthenticated, async (req: any, res) => {
    try {
      const platformData = insertConnectedPlatformSchema.parse(req.body);
      const userId = req.user.claims.sub;
      
      const platform = await storage.createConnectedPlatform({
        ...platformData,
        userId
      });
      
      res.json(platform);
    } catch (error) {
      console.error("Error connecting platform:", error);
      res.status(500).json({ message: "Failed to connect platform" });
    }
  });

  app.get("/api/platforms", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const platforms = await storage.getUserConnectedPlatforms(userId);
      res.json(platforms);
    } catch (error) {
      console.error("Error fetching platforms:", error);
      res.status(500).json({ message: "Failed to fetch platforms" });
    }
  });

  // Content template routes
  app.post("/api/content-templates", isAuthenticated, async (req: any, res) => {
    try {
      const templateData = insertContentTemplateSchema.parse(req.body);
      const userId = req.user.claims.sub;
      
      const template = await storage.createContentTemplate({
        ...templateData,
        userId
      });
      
      res.json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.get("/api/content-templates", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { platform } = req.query;
      
      const templates = await storage.getUserContentTemplates(userId, platform as string);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // AI insights route
  app.post("/api/ai/insights", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analyticsData = await storage.getUserAnalytics(userId);
      
      const insights = await generateInsights(analyticsData);
      res.json(insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  // Stripe payment routes (if configured)
  if (stripe) {
    app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        let user = await storage.getUser(userId);
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (user.stripeSubscriptionId) {
          const subscription = await stripe!.subscriptions.retrieve(user.stripeSubscriptionId);
          
          res.json({
            subscriptionId: subscription.id,
            clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          });
          return;
        }
        
        if (!user.email) {
          return res.status(400).json({ message: 'No user email on file' });
        }

        const customer = await stripe!.customers.create({
          email: user.email,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        });

        const subscription = await stripe!.subscriptions.create({
          customer: customer.id,
          items: [{
            price: process.env.STRIPE_PRICE_ID || 'price_1234567890', // Default price ID
          }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        await storage.updateUserStripeInfo(userId, customer.id, subscription.id);
    
        res.json({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
      } catch (error: any) {
        console.error("Stripe subscription error:", error);
        return res.status(400).json({ error: { message: error.message } });
      }
    });
  }

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'chat') {
          // Handle real-time chat messages
          const aiResponse = await chatWithAI([{ role: 'user', content: data.message }]);
          
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'chat_response',
              message: aiResponse
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to process message'
          }));
        }
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
