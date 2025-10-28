import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Globe, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
    
    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          language,
        }),
      });

      if (!response.ok || !response.body) {
        if (response.status === 429) {
          toast({
            variant: "destructive",
            title: "Too many requests",
            description: "Please wait a moment before sending another message.",
          });
        } else if (response.status === 402) {
          toast({
            variant: "destructive",
            title: "Service unavailable",
            description: "The service is temporarily unavailable. Please try again later.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to send message. Please try again.",
          });
        }
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantContent = "";

      // Add empty assistant message that we'll update
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            // Incomplete JSON, continue
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      toast({
        variant: "destructive",
        title: "Connection error",
        description: errorMessage.includes("Failed to fetch") 
          ? "Unable to connect. Make sure you're using the deployed version or check your network connection."
          : "Failed to connect to the chat service. Please try again.",
      });
      // Remove the empty assistant message on error
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    await streamChat(userMessage);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const languageNames = {
    en: "English",
    sn: "Shona",
    nd: "Ndebele",
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <div className="pt-20 pb-4 px-2 sm:pt-24 sm:pb-8 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Chat with Shinga</h1>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-28 sm:w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{languageNames.en}</SelectItem>
                  <SelectItem value="sn">{languageNames.sn}</SelectItem>
                  <SelectItem value="nd">{languageNames.nd}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="h-[calc(100vh-200px)] sm:h-[600px] flex flex-col shadow-soft">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-center px-4">
                  <div className="max-w-md">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-sunset mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-2">Welcome to Shinga</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      I'm here to listen and support you. Feel free to share what's on your mind.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 sm:gap-3 ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-sunset flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                      message.role === "assistant"
                        ? "bg-card"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 sm:gap-3 justify-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-sunset flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                  </div>
                  <div className="bg-card rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-2 sm:p-4">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="resize-none min-h-[50px] sm:min-h-[60px] text-sm sm:text-base"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-4 sm:px-6 h-auto"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </Card>

          <p className="text-xs sm:text-sm text-muted-foreground text-center mt-3 sm:mt-4 px-2">
            Remember: Shinga provides support but is not a substitute for professional mental health care.
            If you're in crisis, please contact emergency services or a mental health hotline.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
