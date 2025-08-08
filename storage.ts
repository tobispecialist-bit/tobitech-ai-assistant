import {
  users,
  posts,
  emailCampaigns,
  visualizations,
  chatConversations,
  analytics,
  taskReminders,
  formSubmissions,
  connectedPlatforms,
  contentTemplates,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type EmailCampaign,
  type InsertEmailCampaign,
  type Visualization,
  type InsertVisualization,
  type ChatConversation,
  type InsertChatConversation,
  type Analytics,
  type InsertAnalytics,
  type TaskReminder,
  type InsertTaskReminder,
  type FormSubmission,
  type InsertFormSubmission,
  type ConnectedPlatform,
  type InsertConnectedPlatform,
  type ContentTemplate,
  type InsertContentTemplate,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(id: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getUserPosts(userId: string): Promise<Post[]>;
  updatePostStatus(id: string, status: string): Promise<Post>;
  
  // Email campaign operations
  createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign>;
  getUserEmailCampaigns(userId: string): Promise<EmailCampaign[]>;
  updateCampaignStatus(id: string, status: string): Promise<EmailCampaign>;
  
  // Visualization operations
  createVisualization(viz: InsertVisualization): Promise<Visualization>;
  getUserVisualizations(userId: string): Promise<Visualization[]>;
  deleteVisualization(id: string): Promise<void>;
  
  // Chat operations
  createChatConversation(chat: InsertChatConversation): Promise<ChatConversation>;
  getUserChatConversation(userId: string): Promise<ChatConversation | undefined>;
  updateChatConversation(id: string, messages: any[]): Promise<ChatConversation>;
  
  // Analytics operations
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getUserAnalytics(userId: string, platform?: string, startDate?: Date, endDate?: Date): Promise<Analytics[]>;
  
  // Task reminder operations
  createTaskReminder(reminder: InsertTaskReminder): Promise<TaskReminder>;
  getUserTaskReminders(userId: string): Promise<TaskReminder[]>;
  updateTaskCompletion(id: string, completed: boolean): Promise<TaskReminder>;
  
  // Form submission operations
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  getUserFormSubmissions(userId: string, status?: string): Promise<FormSubmission[]>;
  updateFormSubmissionStatus(id: string, status: string): Promise<FormSubmission>;
  
  // Connected platform operations
  createConnectedPlatform(platform: InsertConnectedPlatform): Promise<ConnectedPlatform>;
  getUserConnectedPlatforms(userId: string): Promise<ConnectedPlatform[]>;
  updatePlatformStatus(id: string, isActive: boolean): Promise<ConnectedPlatform>;
  
  // Content template operations
  createContentTemplate(template: InsertContentTemplate): Promise<ContentTemplate>;
  getUserContentTemplates(userId: string, platform?: string): Promise<ContentTemplate[]>;
  deleteContentTemplate(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }

  async updatePostStatus(id: string, status: string): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({ status })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  // Email campaign operations
  async createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign> {
    const [newCampaign] = await db.insert(emailCampaigns).values(campaign).returning();
    return newCampaign;
  }

  async getUserEmailCampaigns(userId: string): Promise<EmailCampaign[]> {
    return await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.userId, userId))
      .orderBy(desc(emailCampaigns.createdAt));
  }

  async updateCampaignStatus(id: string, status: string): Promise<EmailCampaign> {
    const [campaign] = await db
      .update(emailCampaigns)
      .set({ status, sentAt: status === 'sent' ? new Date() : undefined })
      .where(eq(emailCampaigns.id, id))
      .returning();
    return campaign;
  }

  // Visualization operations
  async createVisualization(viz: InsertVisualization): Promise<Visualization> {
    const [newViz] = await db.insert(visualizations).values(viz).returning();
    return newViz;
  }

  async getUserVisualizations(userId: string): Promise<Visualization[]> {
    return await db
      .select()
      .from(visualizations)
      .where(eq(visualizations.userId, userId))
      .orderBy(desc(visualizations.createdAt));
  }

  async deleteVisualization(id: string): Promise<void> {
    await db.delete(visualizations).where(eq(visualizations.id, id));
  }

  // Chat operations
  async createChatConversation(chat: InsertChatConversation): Promise<ChatConversation> {
    const [newChat] = await db.insert(chatConversations).values(chat).returning();
    return newChat;
  }

  async getUserChatConversation(userId: string): Promise<ChatConversation | undefined> {
    const [chat] = await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(desc(chatConversations.updatedAt))
      .limit(1);
    return chat;
  }

  async updateChatConversation(id: string, messages: any[]): Promise<ChatConversation> {
    const [chat] = await db
      .update(chatConversations)
      .set({ messages, updatedAt: new Date() })
      .where(eq(chatConversations.id, id))
      .returning();
    return chat;
  }

  // Analytics operations
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db.insert(analytics).values(analyticsData).returning();
    return newAnalytics;
  }

  async getUserAnalytics(userId: string, platform?: string, startDate?: Date, endDate?: Date): Promise<Analytics[]> {
    let whereClause = eq(analytics.userId, userId);
    
    if (platform) {
      whereClause = and(whereClause, eq(analytics.platform, platform));
    }
    
    if (startDate && endDate) {
      whereClause = and(
        whereClause,
        gte(analytics.date, startDate),
        lte(analytics.date, endDate)
      );
    }
    
    return await db
      .select()
      .from(analytics)
      .where(whereClause)
      .orderBy(desc(analytics.date));
  }

  // Task reminder operations
  async createTaskReminder(reminderData: InsertTaskReminder): Promise<TaskReminder> {
    const [newReminder] = await db.insert(taskReminders).values(reminderData).returning();
    return newReminder;
  }

  async getUserTaskReminders(userId: string): Promise<TaskReminder[]> {
    return await db
      .select()
      .from(taskReminders)
      .where(eq(taskReminders.userId, userId))
      .orderBy(desc(taskReminders.scheduledFor));
  }

  async updateTaskCompletion(id: string, completed: boolean): Promise<TaskReminder> {
    const [updated] = await db
      .update(taskReminders)
      .set({ completed })
      .where(eq(taskReminders.id, id))
      .returning();
    return updated;
  }

  // Form submission operations
  async createFormSubmission(submissionData: InsertFormSubmission): Promise<FormSubmission> {
    const [newSubmission] = await db.insert(formSubmissions).values(submissionData).returning();
    return newSubmission;
  }

  async getUserFormSubmissions(userId: string, status?: string): Promise<FormSubmission[]> {
    let whereClause = eq(formSubmissions.userId, userId);
    
    if (status) {
      whereClause = and(whereClause, eq(formSubmissions.status, status));
    }
    
    return await db
      .select()
      .from(formSubmissions)
      .where(whereClause)
      .orderBy(desc(formSubmissions.createdAt));
  }

  async updateFormSubmissionStatus(id: string, status: string): Promise<FormSubmission> {
    const [updated] = await db
      .update(formSubmissions)
      .set({ status })
      .where(eq(formSubmissions.id, id))
      .returning();
    return updated;
  }

  // Connected platform operations
  async createConnectedPlatform(platformData: InsertConnectedPlatform): Promise<ConnectedPlatform> {
    const [newPlatform] = await db.insert(connectedPlatforms).values(platformData).returning();
    return newPlatform;
  }

  async getUserConnectedPlatforms(userId: string): Promise<ConnectedPlatform[]> {
    return await db
      .select()
      .from(connectedPlatforms)
      .where(eq(connectedPlatforms.userId, userId))
      .orderBy(desc(connectedPlatforms.createdAt));
  }

  async updatePlatformStatus(id: string, isActive: boolean): Promise<ConnectedPlatform> {
    const [updated] = await db
      .update(connectedPlatforms)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(connectedPlatforms.id, id))
      .returning();
    return updated;
  }

  // Content template operations
  async createContentTemplate(templateData: InsertContentTemplate): Promise<ContentTemplate> {
    const [newTemplate] = await db.insert(contentTemplates).values(templateData).returning();
    return newTemplate;
  }

  async getUserContentTemplates(userId: string, platform?: string): Promise<ContentTemplate[]> {
    let whereClause = eq(contentTemplates.userId, userId);
    
    if (platform) {
      whereClause = and(whereClause, eq(contentTemplates.platform, platform));
    }
    
    return await db
      .select()
      .from(contentTemplates)
      .where(whereClause)
      .orderBy(desc(contentTemplates.createdAt));
  }

  async deleteContentTemplate(id: string): Promise<void> {
    await db.delete(contentTemplates).where(eq(contentTemplates.id, id));
  }
}

export const storage = new DatabaseStorage();
