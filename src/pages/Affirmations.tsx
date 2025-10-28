import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCw, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const affirmationsData = {
  en: [
    "You are stronger than you think, and you have the power to overcome any challenge.",
    "Your feelings are valid, and it's okay to take time to heal.",
    "Every small step forward is progress worth celebrating.",
    "You deserve peace, happiness, and good mental health.",
    "It's brave to ask for help when you need it.",
    "You are not alone in your struggles - support is available.",
    "Your mental health journey is unique and valid.",
    "Taking care of yourself is not selfish, it's necessary.",
  ],
  sn: [
    "Une simba kupfuura zvaunoona, uye une simba rekukunda dambudziko ripi zvaro.",
    "Manzwiro ako ndeechokwadi, uye zvakanaka kutora nguva yekupora.",
    "Nhanho imwe neimwe mberi igona, uye yakakodzera kupemberwa.",
    "Unokodzera rugare, mufaro, nehutano hwepfungwa hwakanaka.",
    "Ushingi kukumbira rubatsiro paunorwadzirwa.",
    "Hausi wega mumatambudziko ako - rubatsiro ruripo.",
    "Rwendo rwako rwehutano hwepfungwa rwakasarudzika uye rwechokwadi.",
    "Kuzvichengeta hausi kuva wakazvida, zvinodiwa.",
  ],
  nd: [
    "Ulamandla adlula lokho okucabangayo, njalo ulamandla okunqoba inselele ngayinye.",
    "Imizwa yakho iliqiniso, njalo kulungile ukuthatha isikhathi ukuphola.",
    "Zonke izinyathelo ezincane phambili ziyinqubomgodi okufanele ukugujwa.",
    "Ufanele ukuthula, injabulo, lempilo yengqondo enhle.",
    "Kuyisibindi ukucela usizo lapho udinga khona.",
    "Kawuwedwa ezinkingeni zakho - usekelo lukhona.",
    "Uhambo lwakho lwempilo yengqondo luyingqayizivele njalo liyiqiniso.",
    "Ukuzinakekela akusikho ukuziphatha ngokuzidla, kuyadingeka.",
  ],
};

const Affirmations = () => {
  const [language, setLanguage] = useState<"en" | "sn" | "nd">("en");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();
    
    if (data?.full_name) {
      setUserName(data.full_name);
    }
  };

  const affirmations = affirmationsData[language];
  const currentAffirmation = affirmations[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <div className="pt-20 pb-8 px-3 sm:pt-24 sm:pb-12 sm:px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Daily Affirmations</h1>
            <p className="text-sm sm:text-lg text-muted-foreground px-2">
              {user ? (
                <span className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  Hello {userName || "there"}! Start your day with positive thoughts
                </span>
              ) : (
                "Get instant emotional support - no sign-in required for emergencies"
              )}
            </p>
          </div>

          <Card className="p-4 sm:p-8 shadow-soft mb-4 sm:mb-6">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-full bg-gradient-sunset flex-shrink-0">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">Today's Affirmation</h2>
                <p className="text-base sm:text-xl leading-relaxed">{currentAffirmation}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 sm:pt-6 border-t border-border">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  onClick={() => setLanguage("en")}
                  size="sm"
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  English
                </Button>
                <Button
                  variant={language === "sn" ? "default" : "outline"}
                  onClick={() => setLanguage("sn")}
                  size="sm"
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  Shona
                </Button>
                <Button
                  variant={language === "nd" ? "default" : "outline"}
                  onClick={() => setLanguage("nd")}
                  size="sm"
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  Ndebele
                </Button>
              </div>
              
              <Button onClick={handleNext} className="gap-2 w-full sm:w-auto text-sm sm:text-base">
                <RefreshCw className="h-4 w-4" />
                Next Affirmation
              </Button>
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Morning Ritual</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Read your affirmation first thing in the morning to set a positive tone for your day.
              </p>
            </Card>
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Repeat & Believe</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Say your affirmation out loud and repeat it throughout the day whenever you need encouragement.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affirmations;
