import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart, Leaf, Droplet, BookOpen, Footprints, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

const challengeTypes = [
  { id: "selfcare", name: "Self-Care & Relaxation", icon: Heart, description: "Take time for yourself today" },
  { id: "water", name: "Drinking Enough Water", icon: Droplet, description: "Stay hydrated throughout the day" },
  { id: "bible", name: "Bible Reading", icon: BookOpen, description: "Spend time in spiritual reflection" },
  { id: "walk", name: "Taking a Walk", icon: Footprints, description: "Get some fresh air and movement" },
  { id: "meditation", name: "Meditation & Breathing", icon: Leaf, description: "Practice mindfulness today" },
];

const Challenges = () => {
  const [user, setUser] = useState<any>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadChallenges(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadChallenges(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadChallenges = async (userId: string) => {
    try {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      const { data, error } = await supabase
        .from("weekly_challenges")
        .select("*")
        .eq("user_id", userId)
        .gte("week_start", startOfWeek.toISOString().split('T')[0]);

      if (error) throw error;
      setChallenges(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading challenges",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleChallenge = async (challengeType: string) => {
    if (!user) return;

    try {
      const existing = challenges.find(c => c.challenge_type === challengeType && !c.completed_at);
      
      if (existing) {
        const { error } = await supabase
          .from("weekly_challenges")
          .update({ completed_at: new Date().toISOString() })
          .eq("id", existing.id);

        if (error) throw error;
        
        toast({
          title: "Challenge completed! 🎉",
          description: "Great job on completing this challenge!",
        });
      } else {
        const { error } = await supabase
          .from("weekly_challenges")
          .insert({
            user_id: user.id,
            challenge_type: challengeType,
            completed_at: new Date().toISOString(),
          });

        if (error) throw error;
        
        toast({
          title: "Challenge completed! 🎉",
          description: "Keep up the great work!",
        });
      }

      loadChallenges(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isChallengeCompleted = (challengeType: string) => {
    return challenges.some(c => c.challenge_type === challengeType && c.completed_at);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Weekly Wellness Challenges</h1>
            <p className="text-lg text-muted-foreground">
              Complete daily challenges to improve your mental wellness
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {challengeTypes.map((challenge) => {
              const Icon = challenge.icon;
              const completed = isChallengeCompleted(challenge.id);
              
              return (
                <Card
                  key={challenge.id}
                  className={`p-6 transition-all hover:shadow-glow cursor-pointer ${
                    completed ? "bg-gradient-sunset border-primary" : ""
                  }`}
                  onClick={() => toggleChallenge(challenge.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${completed ? "bg-white/20" : "bg-gradient-sunset"}`}>
                      <Icon className={`h-6 w-6 ${completed ? "text-white" : "text-primary-foreground"}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Checkbox
                          checked={completed}
                          onCheckedChange={() => toggleChallenge(challenge.id)}
                          className="border-2"
                        />
                        <h3 className={`font-semibold ${completed ? "text-white" : ""}`}>
                          {challenge.name}
                        </h3>
                      </div>
                      <p className={`text-sm ${completed ? "text-white/90" : "text-muted-foreground"}`}>
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 p-6 bg-gradient-hero">
            <h3 className="font-semibold text-lg mb-2">Your Progress This Week</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-sunset transition-all"
                  style={{
                    width: `${(challenges.filter(c => c.completed_at).length / challengeTypes.length) * 100}%`,
                  }}
                />
              </div>
              <span className="font-semibold">
                {challenges.filter(c => c.completed_at).length}/{challengeTypes.length}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
