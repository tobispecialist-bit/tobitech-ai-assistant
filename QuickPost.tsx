import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Image, Video, MapPin } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export function QuickPost() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram"]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const platforms = [
    { name: "Instagram", color: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400" },
    { name: "Facebook", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
    { name: "X", color: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400" },
    { name: "TikTok", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
    { name: "WhatsApp", color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" },
  ];

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; platforms: string[]; scheduledFor?: Date }) => {
      return await apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      toast({
        title: "Post Scheduled",
        description: `Your post has been scheduled for ${selectedPlatforms.join(", ")}`,
      });
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSchedulePost = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    // Schedule for optimal time (mock implementation)
    const scheduledTime = new Date();
    scheduledTime.setHours(14, 0, 0, 0); // 2 PM today

    createPostMutation.mutate({
      content,
      platforms: selectedPlatforms,
      scheduledFor: scheduledTime,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={handleSchedulePost} 
            disabled={createPostMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {createPostMutation.isPending ? "Scheduling..." : "Schedule"}
          </Button>
        </div>
        
        {/* Platform Selection */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-muted-foreground mb-2">Post to:</p>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <Badge
                key={platform.name}
                variant={selectedPlatforms.includes(platform.name) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedPlatforms.includes(platform.name) 
                    ? platform.color 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => togglePlatform(platform.name)}
              >
                {platform.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
