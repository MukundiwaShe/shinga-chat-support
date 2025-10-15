import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, BookOpen, Loader2, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Journal = () => {
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadEntries(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadEntries(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadEntries = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
      setFilteredEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading journal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, entries]);

  const saveEntry = async () => {
    if (!user || !title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
        });

      if (error) throw error;

      toast({
        title: "Entry saved!",
        description: "Your journal entry has been saved successfully.",
      });

      setTitle("");
      setContent("");
      setShowNewEntry(false);
      loadEntries(user.id);
    } catch (error: any) {
      toast({
        title: "Error saving entry",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Journal</h1>
              <p className="text-lg text-muted-foreground">
                Document your thoughts and feelings
              </p>
            </div>
            <Button onClick={() => setShowNewEntry(!showNewEntry)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </div>

          {showNewEntry && (
            <Card className="p-6 mb-6 shadow-soft">
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Entry title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-semibold"
                  />
                </div>
                <Textarea
                  placeholder="Write your thoughts here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={saveEntry} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Entry"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewEntry(false);
                      setTitle("");
                      setContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search your journal entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No entries found" : "No journal entries yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Start documenting your mental wellness journey"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowNewEntry(true)}>
                  Create Your First Entry
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="p-6 hover:shadow-glow transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">{entry.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(entry.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                  <p className="text-muted-foreground line-clamp-3">
                    {entry.content}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
