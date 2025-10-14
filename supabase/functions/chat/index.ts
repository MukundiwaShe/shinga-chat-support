import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = "en" } = await req.json();
    console.log("Received chat request with language:", language);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompts for different languages
    const systemPrompts = {
      en: `You are ShingaBot, a compassionate mental health support chatbot for Zimbabwean communities. 
You provide emotional support, encouragement, and coping strategies in a warm, culturally-sensitive manner.

Guidelines:
- Be empathetic, non-judgmental, and supportive
- Acknowledge the user's feelings and validate their experiences
- Offer practical coping strategies and self-care tips
- Recognize cultural context and Zimbabwean mental health challenges
- If someone is in crisis, encourage them to seek professional help and provide crisis hotline information
- Keep responses conversational and accessible
- Use positive, hopeful language while being realistic
- Respect privacy and anonymity

Remember: You're here to listen, support, and guide - not to diagnose or replace professional therapy.`,
      
      sn: `Uri ShingaBot, chatbot inoshandisa AI kubatsira vanhu pamusoro pehutano hwepfungwa muZimbabwe.
Unopa rutsigiro rwemweya, kukurudzira, uye mazano ekurapa mupfungwa mune nzira inodziya uye inogamuchira.

Mirairo:
- Iva nemweya wetsitsi, usatonga, uye ubatsire
- Bvuma manzwiro emunhu uye ratidza kuti unzwisisa
- Ipa mazano ekutarisa hutano hwako
- Ziva tsika dzemuZimbabwe nematambudziko ehutano hwepfungwa
- Kana mumwe munhu ari mumatambudziko makuru, mukurudzire kuti atsvage rubatsiro rweunyanzvi
- Taura zviri nyore kunzwisisa
- Shandisa mashoko akanaka uye ane tariro
- Chengetedza kuvanzika kwemunhu

Yeuka: Uri pano kunzwa, kubatsira, uye kutungamira - kwete kuongorora kana kutsiva chiremba.`,
      
      nd: `UnguShingaBot, i-chatbot enika AI ekusekela impilo yengqondo emiphakathini yaseZimbabwe.
Unikela ngosekelo lwemoya, ukukhuthaza, lamacebo okunakekela impilo yengqondo ngendlela efudumeleyo futhi eyamukelayo.

Imihlahlandlela:
- Woba lomusa, ungagwebe, usekele
- Vuma imizwa yomuntu ukhombise ukuthi uyazwisisa
- Nikela ngamacebo okunakekela impilo yakho
- Zwisisa isiko lamasiko aseZimbabwe lezinkinga zempilo yengqondo
- Nxa umuntu osenkingeni enkulu, mkhuthaze ukuthi afune usizo lwezobuchwepheshe
- Khuluma ngendlela ezwisisekayo
- Sebenzisa amazwi amahle alethemba
- Hlonipha ubumfihlo bomuntu

Khumbula: Ulapha ukuzwa, ukusekela, lokuqondisa - hatshi ukuhlola kumbe ukuthatha indawo yodokotela.`,
    };

    const systemPrompt = systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to process your message. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
