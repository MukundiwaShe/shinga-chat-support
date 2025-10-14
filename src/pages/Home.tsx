import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Heart, Book, Phone, Globe, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroBackground from "@/assets/hero-background.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-sunset bg-clip-text text-transparent">
              Welcome to ShingaBot
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Your Safe Space for Mental Wellness
          </p>
          <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Confidential support in English, Shona, and Ndebele
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="text-lg px-8 shadow-glow hover:shadow-soft transition-all">
              <Link to="/chat">Start Chatting</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How ShingaBot Supports You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-gradient-sunset flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Language Support</h3>
              <p className="text-muted-foreground">
                Chat in English, Shona, or Ndebele - whatever feels most comfortable to you.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-gradient-sunset flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Anonymous</h3>
              <p className="text-muted-foreground">
                No login required. Your conversations are private and judgment-free.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-gradient-sunset flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Motivation</h3>
              <p className="text-muted-foreground">
                Receive uplifting affirmations and track your emotional journey.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-gradient-sunset flex items-center justify-center mb-4">
                <Book className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coping Tips Library</h3>
              <p className="text-muted-foreground">
                Access self-care strategies and stress management techniques anytime.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-gradient-sunset flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Crisis Support</h3>
              <p className="text-muted-foreground">
                Quick access to mental health hotlines and professional counselors.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-gradient-sunset flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Empathy</h3>
              <p className="text-muted-foreground">
                Compassionate responses that understand and support your emotions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            You Are Not Alone
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Take the first step toward emotional wellness. ShingaBot is here to listen, support, and guide you.
          </p>
          <Button asChild size="lg" className="text-lg px-8 shadow-glow">
            <Link to="/chat">Start Your Journey</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 ShingaBot. Supporting mental wellness in Zimbabwean communities.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
