import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIInsight {
  type: 'suggestion' | 'trend' | 'optimization' | 'alert';
  title: string;
  description: string;
  confidence: number;
}

export interface ContentSuggestion {
  platform: string;
  content: string;
  hashtags: string[];
  bestTime: string;
  reasoning: string;
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  if (!openai) {
    return "AI assistant is currently unavailable. Please configure your OpenAI API key in the environment settings.";
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are TOBI TECH AI, a helpful marketing automation assistant for creative professionals. You help analyze data, provide insights, and suggest content strategies. Be friendly, professional, and provide actionable advice."
        },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function generateInsights(analyticsData: any[]): Promise<AIInsight[]> {
  if (!openai) {
    return [{
      type: 'alert',
      title: 'AI Insights Unavailable',
      description: 'Please configure your OpenAI API key to enable AI-powered insights.',
      confidence: 0
    }];
  }
  
  try {
    const dataString = JSON.stringify(analyticsData.slice(0, 50)); // Limit data size
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a data analysis expert. Analyze the provided social media and marketing analytics data and generate actionable insights. Respond with JSON in this format: { 'insights': [{ 'type': 'suggestion|trend|optimization|alert', 'title': string, 'description': string, 'confidence': number }] }"
        },
        {
          role: "user",
          content: `Analyze this analytics data and provide insights: ${dataString}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"insights": []}');
    return result.insights || [];
  } catch (error) {
    console.error("Failed to generate insights:", error);
    return [];
  }
}

export async function generateContentSuggestions(userProfile: any, recentData: any[]): Promise<ContentSuggestion[]> {
  if (!openai) {
    return [
      {
        platform: 'Instagram',
        content: 'Share behind-the-scenes content of your creative process today!',
        hashtags: ['#creative', '#process', '#inspiration'],
        bestTime: '2:00 PM',
        reasoning: 'Default suggestion while AI is unavailable'
      }
    ];
  }
  
  try {
    const context = {
      profile: userProfile,
      recentPerformance: recentData.slice(0, 20)
    };
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media content strategist. Based on the user's profile and recent performance data, suggest 3-5 content ideas for different platforms. Respond with JSON in this format: { 'suggestions': [{ 'platform': string, 'content': string, 'hashtags': string[], 'bestTime': string, 'reasoning': string }] }"
        },
        {
          role: "user",
          content: `Generate content suggestions based on this context: ${JSON.stringify(context)}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error("Failed to generate content suggestions:", error);
    return [];
  }
}

export async function analyzeContentPerformance(content: string, metrics: any): Promise<{
  score: number;
  improvements: string[];
  strengths: string[];
}> {
  if (!openai) {
    return {
      score: 75,
      improvements: ["Configure OpenAI API key for detailed analysis"],
      strengths: ["Content posted successfully"]
    };
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content performance analyst. Analyze the given content and its metrics, then provide a performance score (1-100), strengths, and improvement suggestions. Respond with JSON in this format: { 'score': number, 'improvements': string[], 'strengths': string[] }"
        },
        {
          role: "user",
          content: `Analyze this content and metrics: Content: "${content}" Metrics: ${JSON.stringify(metrics)}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"score": 50, "improvements": [], "strengths": []}');
    return {
      score: Math.max(1, Math.min(100, result.score)),
      improvements: result.improvements || [],
      strengths: result.strengths || []
    };
  } catch (error) {
    console.error("Failed to analyze content performance:", error);
    return {
      score: 50,
      improvements: ["Unable to analyze content at this time"],
      strengths: []
    };
  }
}
