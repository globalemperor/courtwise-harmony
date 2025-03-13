
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Search, MapPin, Award, Users, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock specialties
const SPECIALTIES = [
  "Family Law", 
  "Criminal Defense", 
  "Personal Injury", 
  "Corporate Law", 
  "Intellectual Property",
  "Real Estate Law",
  "Immigration Law"
];

const FindLawyer = () => {
  const { users } = useData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  
  // Get all lawyers
  const lawyers = users.filter(user => user.role === 'lawyer');
  
  // Filter lawyers based on search query and specialty
  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || true; // In a real app, check specialty
    return matchesSearch && matchesSpecialty;
  });

  const handleContactLawyer = (lawyerName: string) => {
    toast({
      title: "Contact request sent",
      description: `Your request has been sent to ${lawyerName}.`,
    });
  };

  const handleHireLawyer = (lawyerName: string) => {
    toast({
      title: "Case request sent",
      description: `Your case request has been sent to ${lawyerName}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Find a Lawyer</h1>
        <p className="text-muted-foreground">Search for legal representation for your case</p>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Near Me
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all" onClick={() => setSelectedSpecialty(null)}>All</TabsTrigger>
            <TabsTrigger value="family" onClick={() => setSelectedSpecialty("Family Law")}>Family</TabsTrigger>
            <TabsTrigger value="criminal" onClick={() => setSelectedSpecialty("Criminal Defense")}>Criminal</TabsTrigger>
            <TabsTrigger value="civil" onClick={() => setSelectedSpecialty("Personal Injury")}>Civil</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {filteredLawyers.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No lawyers found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLawyers.map(lawyer => (
                  <Card key={lawyer.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={lawyer.avatarUrl} />
                          <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{lawyer.name}</CardTitle>
                          <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-xs ml-1 text-muted-foreground">(24 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {SPECIALTIES.slice(0, 2).map(specialty => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Licensed since 2015</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>92% client satisfaction</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>78 cases handled</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleContactLawyer(lawyer.name)}
                      >
                        Contact
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleHireLawyer(lawyer.name)}
                      >
                        Hire
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="family" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">Family law attorneys specialize in matters related to family relationships, such as divorce, child custody, and adoption.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="criminal" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">Criminal defense attorneys represent individuals who have been accused of committing crimes.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="civil" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">Civil litigation attorneys handle a wide range of disputes, including personal injury cases, contract disputes, and property damage claims.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FindLawyer;
