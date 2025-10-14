import { Card } from "@/components/ui/card";
import { Heart, Globe, Shield, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About ShingaBot</h1>
          
          <Card className="p-8 mb-6">
            <p className="text-lg mb-4">
              ShingaBot is an AI-powered mental health chatbot designed specifically for Zimbabwean communities. 
              Our mission is to break down barriers to mental health support by providing accessible, culturally-sensitive, 
              and multilingual emotional support.
            </p>
            <p className="text-muted-foreground">
              "Shinga" means "be strong" in Shona - a reminder that seeking support is a sign of strength, not weakness.
            </p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <Globe className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Culturally Relevant</h3>
              <p className="text-muted-foreground">
                Support in English, Shona, and Ndebele, understanding Zimbabwean cultural context.
              </p>
            </Card>

            <Card className="p-6">
              <Shield className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Private & Safe</h3>
              <p className="text-muted-foreground">
                Your conversations are anonymous and confidential. No login required.
              </p>
            </Card>

            <Card className="p-6">
              <Heart className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Always Available</h3>
              <p className="text-muted-foreground">
                24/7 emotional support whenever you need someone to listen.
              </p>
            </Card>

            <Card className="p-6">
              <Users className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Community Focused</h3>
              <p className="text-muted-foreground">
                Built for Zimbabweans, by people who care about mental wellness.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
