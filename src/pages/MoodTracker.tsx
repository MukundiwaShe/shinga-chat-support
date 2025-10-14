import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile, Meh, Frown, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

type Mood = "happy" | "neutral" | "sad";

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const moods = [
    { value: "happy" as Mood, icon: Smile, label: "Happy", color: "text-accent" },
    { value: "neutral" as Mood, icon: Meh, label: "Okay", color: "text-primary" },
    { value: "sad" as Mood, icon: Frown, label: "Sad", color: "text-secondary" },
  ];

  const handleSave = () => {
    if (!selectedMood) {
      toast({
        variant: "destructive",
        title: "Please select a mood",
        description: "Choose how you're feeling today before saving.",
      });
      return;
    }

    // In a real app, this would save to a database
    const moodData = {
      mood: selectedMood,
      note: note,
      date: new Date().toISOString(),
    };
    
    console.log("Saving mood:", moodData);
    
    toast({
      title: "Mood saved!",
      description: "Your mood has been recorded. Keep tracking your emotional journey.",
    });

    // Reset form
    setSelectedMood(null);
    setNote("");
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Mood Tracker</h1>
            <p className="text-lg text-muted-foreground">
              Track your emotional well-being over time
            </p>
          </div>

          <Card className="p-8 shadow-soft mb-6">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">How are you feeling today?</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.value;
                  
                  return (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-glow"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`h-12 w-12 mx-auto mb-2 ${mood.color}`} />
                      <p className="font-medium">{mood.label}</p>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Add a note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's influencing your mood today?"
                  className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Today's Mood
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-3">Why Track Your Mood?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Identify patterns in your emotional well-being
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Recognize triggers that affect your mood
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Celebrate progress in your mental health journey
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Share insights with your therapist or support system
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
