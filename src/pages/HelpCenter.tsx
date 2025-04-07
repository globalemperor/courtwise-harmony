import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Lightbulb, 
  Video, 
  PlayCircle, 
  ArrowRight,
  Bot 
} from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search through help articles
    console.log("Searching for:", searchQuery);
  };

  const helpCategories = [
    {
      title: "Documentation",
      icon: BookOpen,
      description: "Comprehensive guides on all platform features",
      link: "/documentation",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "User Guides",
      icon: FileText,
      description: "Step-by-step tutorials for common tasks",
      link: "/guides",
      color: "bg-green-100 text-green-700"
    },
    {
      title: "FAQ",
      icon: HelpCircle,
      description: "Answers to frequently asked questions",
      link: "/faq",
      color: "bg-amber-100 text-amber-700"
    },
    {
      title: "Contact Support",
      icon: MessageSquare,
      description: "Get help from our support team",
      link: "/contact",
      color: "bg-purple-100 text-purple-700"
    }
  ];

  const popularTopics = [
    {
      title: "Account Setup",
      questions: [
        { text: "How do I create an account?", link: "/faq#create-account" },
        { text: "Setting up your profile", link: "/guides#profile-setup" },
        { text: "Changing your password", link: "/faq#change-password" }
      ]
    },
    {
      title: "Using the Platform",
      questions: [
        { text: "Filing a new case", link: "/guides#file-case" },
        { text: "Messaging between users", link: "/guides#messaging" },
        { text: "Managing document uploads", link: "/guides#documents" }
      ]
    },
    {
      title: "Troubleshooting",
      questions: [
        { text: "I can't log in to my account", link: "/faq#login-issues" },
        { text: "Messages not being delivered", link: "/faq#message-issues" },
        { text: "Browser compatibility", link: "/faq#compatibility" }
      ]
    }
  ];

  const videoTutorials = [
    {
      title: "Getting Started with CourtWise",
      thumbnail: "https://placehold.co/400x225/court-blue/white?text=Getting+Started",
      duration: "3:45",
      link: "/guides#video-getting-started"
    },
    {
      title: "Managing Your Cases",
      thumbnail: "https://placehold.co/400x225/court-blue/white?text=Case+Management",
      duration: "5:20",
      link: "/guides#video-case-management"
    },
    {
      title: "Communication Features",
      thumbnail: "https://placehold.co/400x225/court-blue/white?text=Communication",
      duration: "4:15",
      link: "/guides#video-communication"
    }
  ];

  return (
    <div className="min-h-screen bg-court-gray">
      {/* Header */}
      <header className="bg-court-blue text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-6">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8">
            Find answers to your questions and learn how to get the most from CourtWise.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for help topics..."
                className="pl-10 py-6 bg-white/10 text-white placeholder:text-white/70 border-white/20 focus:border-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-white/70" />
              <Button type="submit" className="absolute right-1 top-1 bg-white text-court-blue hover:bg-white/90">
                Search
              </Button>
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Help Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Help Resources</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <Link to={category.link}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`h-16 w-16 rounded-full ${category.color} flex items-center justify-center mb-4`}>
                        <category.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Topics */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Popular Topics</h2>
            <div className="flex items-center text-court-blue">
              <Lightbulb className="mr-2 h-5 w-5" />
              <span className="font-medium">Quick answers to common questions</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {popularTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{topic.title}</h3>
                  <ul className="space-y-3">
                    {topic.questions.map((question, qIndex) => (
                      <li key={qIndex}>
                        <Link 
                          to={question.link} 
                          className="text-court-blue hover:underline flex items-center"
                        >
                          <span className="w-1.5 h-1.5 bg-court-blue rounded-full mr-2"></span>
                          {question.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Video Tutorials</h2>
            <Link to="/guides" className="text-court-blue hover:underline flex items-center">
              View all videos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {videoTutorials.map((video, index) => (
              <Card key={index} className="hover:shadow-lg transition-all overflow-hidden">
                <Link to={video.link}>
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-[160px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{video.title}</h3>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section>
          <Card className="bg-blue-50 border border-blue-100">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold mb-2">Still Need Help?</h2>
                  <p className="text-muted-foreground mb-4">
                    Try our AI assistant that's available in the bottom-right corner when you're logged in.
                    For more complex issues, our support team is available to assist you directly.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg" className="bg-court-blue hover:bg-court-blue-dark">
                      <Link to="/contact">Contact Support</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <span className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        AI Assistant
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/3 flex justify-center mt-6 md:mt-0">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-16 w-16 text-blue-600" />
                    </div>
                    <div className="absolute top-0 right-0 h-12 w-12 rounded-full bg-court-blue flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="bg-court-blue-dark text-white/80 py-6 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2023 CourtWise. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/terms" className="text-sm hover:text-white">Terms</Link>
            <Link to="/privacy" className="text-sm hover:text-white">Privacy</Link>
            <Link to="/cookies" className="text-sm hover:text-white">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenter;
