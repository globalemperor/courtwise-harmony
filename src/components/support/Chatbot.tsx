import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface KnowledgeBase {
  [key: string]: {
    question: string[];
    answer: string[];
  };
}

export interface ChatbotProps {
  knowledgeBase: KnowledgeBase;
}

export const Chatbot = ({ knowledgeBase }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "👋 Welcome to CourtWise Support! How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  // Remove references to unused functions
  const { getAcceptedLawyers } = useData();
  
  // Check if input contains greeting patterns
  const isGreeting = (input: string): boolean => {
    const greetingPatterns = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    return greetingPatterns.some(pattern => input.toLowerCase().includes(pattern));
  };

  // Function to find the best response from knowledge base with improved matching
  const findBestResponse = (userQuery: string): string | null => {
    // If it's a greeting, handle greeting specially
    if (isGreeting(userQuery)) {
      const greetingResponses = knowledgeBase.greeting.answer;
      return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }
    
    let bestMatch = null;
    let highestMatchScore = 0;
    
    const normalizedQuery = userQuery.toLowerCase();
    
    Object.values(knowledgeBase).forEach(topic => {
      topic.question.forEach((question, index) => {
        const keywords = question.toLowerCase().split(" ");
        let matchScore = 0;
        
        keywords.forEach(keyword => {
          if (keyword.length > 3 && normalizedQuery.includes(keyword)) {
            matchScore += 2;  // Give more weight to longer keywords
          } else if (normalizedQuery.includes(keyword)) {
            matchScore += 1;
          }
        });
        
        // If we have a better match than before
        if (matchScore > highestMatchScore) {
          highestMatchScore = matchScore;
          bestMatch = topic.answer[Math.min(index, topic.answer.length - 1)]; // Use corresponding answer if available
        }
      });
    });
    
    // Only return a match if it's somewhat relevant (higher threshold)
    return highestMatchScore > 1 ? bestMatch : null;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Try to find a response from the knowledge base
    const knowledgeResponse = findBestResponse(input);
    
    // Simulate bot response with slight delay
    setTimeout(() => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: knowledgeResponse || "I'm not sure how to help with that specific query. Could you rephrase or ask about court cases, legal procedures, or using our platform?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const formatBotMessage = (text: string) => {
    if (text.includes('•')) {
      return (
        <div>
          {text.split('\n').map((line, index) => (
            <div key={index} className={line.includes('•') ? 'flex items-start' : ''}>
              {line.includes('•') ? (
                <>
                  <span className="text-primary mr-2">{line.substring(0, 1)}</span>
                  <span>{line.substring(1)}</span>
                </>
              ) : (
                <p className="mb-2">{line}</p>
              )}
            </div>
          ))}
        </div>
      );
    }
    return <p>{text}</p>;
  };

  return (
    <>
      {/* Chat button */}
      <div 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-5 right-5 bg-primary p-3 rounded-full shadow-lg cursor-pointer transition-all hover:bg-primary/90 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </div>

      {/* Chat window */}
      <div className={`fixed bottom-5 right-5 w-[350px] max-w-[95vw] transition-all duration-300 z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <Card className="shadow-xl border-gray-200 overflow-hidden">
          <CardHeader className="bg-primary text-white p-4 flex flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src="/favicon.ico" />
                <AvatarFallback>CW</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg font-semibold">CourtWise Support</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-primary/90"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <ScrollArea className="h-[350px]">
            <CardContent className="p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-gray-100 rounded-tl-none'
                    }`}
                  >
                    {message.sender === 'bot' 
                      ? formatBotMessage(message.text)
                      : <p>{message.text}</p>
                    }
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
          </ScrollArea>
          
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
