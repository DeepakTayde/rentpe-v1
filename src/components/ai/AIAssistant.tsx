import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Trash2,
  User,
  Bot,
  Home,
  CreditCard,
  Wrench,
  Calendar,
  Mic,
  MicOff,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIAssistant, Message } from "@/hooks/useAIAssistant";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const quickActions = [
  { icon: Home, label: "Find Property", prompt: "Help me find a rental property" },
  { icon: CreditCard, label: "Rent Info", prompt: "Explain my rent payment and due dates" },
  { icon: Wrench, label: "Maintenance", prompt: "I need to raise a maintenance request" },
  { icon: Calendar, label: "Book Visit", prompt: "How do I book a property visit?" },
  { icon: Search, label: "Search AI", prompt: "Search for 2BHK under ₹15,000 in Jabalpur" },
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearChat } = useAIAssistant();
  const { user, role } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { 
    isListening, 
    isSupported: voiceSupported, 
    interimTranscript,
    toggleListening 
  } = useVoiceInput({
    onTranscript: (transcript) => {
      setInput(prev => prev + transcript);
    },
    onInterimTranscript: (transcript) => {
      // Show interim in UI
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleQuickAction = (prompt: string) => {
    if (!isLoading) {
      sendMessage(prompt);
    }
  };

  const getRoleLabel = () => {
    if (!user) return "Guest";
    switch (role) {
      case "tenant": return "Tenant";
      case "owner": return "Owner";
      case "agent": return "Agent";
      case "vendor": return "Vendor";
      case "technician": return "Technician";
      case "admin": return "Admin";
      default: return "User";
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          "bg-gradient-to-r from-primary to-primary/80",
          "text-primary-foreground shadow-lg",
          "flex items-center justify-center",
          "hover:scale-110 transition-transform duration-200",
          isOpen && "hidden"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-6 right-6 z-50",
              "w-[400px] h-[600px] max-h-[80vh]",
              "bg-background border border-border rounded-2xl shadow-2xl",
              "flex flex-col overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">RentPe Assistant</h3>
                  <p className="text-xs text-muted-foreground">
                    AI-powered help • {getRoleLabel()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Hi! I'm your RentPe Assistant
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Ask me about properties, payments, visits, or say something like:
                    </p>
                    <p className="text-sm text-primary mt-1 italic">
                      "Show me 2BHK under ₹15k in Jabalpur"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.prompt)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg",
                          "bg-muted/50 hover:bg-muted border border-border",
                          "text-left text-sm transition-colors"
                        )}
                      >
                        <action.icon className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-foreground">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Voice Indicator */}
            <AnimatePresence>
              {(isListening || interimTranscript) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-2 bg-primary/10 border-t border-primary/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm text-primary">
                      {interimTranscript || "Listening..."}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-muted/30">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Ask me anything..."}
                  disabled={isLoading}
                  className="flex-1 bg-background"
                />
                {voiceSupported && (
                  <Button
                    type="button"
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    onClick={toggleListening}
                    className="shrink-0"
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                )}
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || isLoading}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  
  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isUser ? "bg-primary" : "bg-primary/10"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-md" 
          : "bg-muted text-foreground rounded-tl-md"
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
