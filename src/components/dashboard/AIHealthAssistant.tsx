import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bot } from "lucide-react";

const AIHealthAssistant = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Health Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 p-3 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">
                Hello! I'm your AI health assistant. How can I help you today?
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Track symptoms
            </Button>
            <Button variant="outline" className="flex-1">
              Health tips
            </Button>
            <Button className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIHealthAssistant;