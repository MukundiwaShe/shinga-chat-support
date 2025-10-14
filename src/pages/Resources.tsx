import { Card } from "@/components/ui/card";
import { Phone, MapPin, Globe, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

const Resources = () => {
  const resources = [
    {
      name: "Friendship Bench Zimbabwe",
      phone: "+263 77 823 1234",
      description: "Community-based mental health support",
      icon: Phone,
    },
    {
      name: "ZimConnect",
      phone: "0800 9195",
      description: "Free mental health helpline",
      icon: Phone,
    },
    {
      name: "Parirenyatwa Hospital Psychiatric Unit",
      location: "Harare",
      phone: "+263 4 730011",
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Mental Health Resources</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Professional support services in Zimbabwe
          </p>

          <div className="space-y-4 mb-8">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-soft transition-all">
                  <div className="flex gap-4">
                    <div className="p-3 rounded-full bg-gradient-sunset">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{resource.name}</h3>
                      <p className="text-muted-foreground mb-2">{resource.description}</p>
                      {resource.phone && (
                        <p className="font-medium">📞 {resource.phone}</p>
                      )}
                      {resource.location && (
                        <p className="text-sm text-muted-foreground">📍 {resource.location}</p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-6 bg-destructive/10 border-destructive/20">
            <h3 className="text-xl font-bold mb-2 text-destructive">In Crisis?</h3>
            <p className="mb-3">If you're experiencing a mental health emergency, please:</p>
            <ul className="space-y-2">
              <li>• Call emergency services: 999 or 112</li>
              <li>• Visit the nearest hospital emergency room</li>
              <li>• Contact a crisis helpline immediately</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;
