import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Heart, Droplet, BookOpen, Footprints } from "lucide-react";
import Navbar from "@/components/Navbar";

const challengeTypes = [
  { id: "selfcare", name: "Self-Care & Relaxation", icon: Heart, description: "Take time for yourself today" },
  { id: "water", name: "Drinking Enough Water", icon: Droplet, description: "Stay hydrated throughout the day" },
  { id: "bible", name: "Bible Reading", icon: BookOpen, description: "Spend time in spiritual reflection" },
  { id: "walk", name: "Taking a Walk", icon: Footprints, description: "Get some fresh air and movement" },
];

const Challenges = () => {
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // Load completed challenges from localStorage
    const startOfWeek = getStartOfWeek();
    const storedData = localStorage.getItem('weekly_challenges');
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        // Check if stored data is from current week
        if (parsed.week === startOfWeek) {
          setCompletedChallenges(new Set(parsed.completed || []));
        } else {
          // New week, reset challenges
          localStorage.setItem('weekly_challenges', JSON.stringify({ week: startOfWeek, completed: [] }));
        }
      } catch (error) {
        console.error("Error parsing stored challenges:", error);
      }
    } else {
      localStorage.setItem('weekly_challenges', JSON.stringify({ week: startOfWeek, completed: [] }));
    }
  }, []);

  const getStartOfWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.toISOString().split('T')[0];
  };

  const toggleChallenge = (challengeType: string) => {
    const newCompleted = new Set(completedChallenges);
    
    if (newCompleted.has(challengeType)) {
      newCompleted.delete(challengeType);
      toast({
        title: "Challenge unmarked",
        description: "Keep going, you've got this!",
      });
    } else {
      newCompleted.add(challengeType);
      toast({
        title: "Challenge completed! 🎉",
        description: "Great job on your wellness journey!",
      });
    }

    setCompletedChallenges(newCompleted);
    
    // Save to localStorage
    const startOfWeek = getStartOfWeek();
    localStorage.setItem('weekly_challenges', JSON.stringify({
      week: startOfWeek,
      completed: Array.from(newCompleted)
    }));
  };

  const isChallengeCompleted = (challengeType: string) => {
    return completedChallenges.has(challengeType);
  };

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
                    width: `${(completedChallenges.size / challengeTypes.length) * 100}%`,
                  }}
                />
              </div>
              <span className="font-semibold">
                {completedChallenges.size}/{challengeTypes.length}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
