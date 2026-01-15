import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Ticket, ArrowRight, Sparkles, AlertCircle, Radio, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveDraw, useUpcomingDraws, useEnterDraw, useUserEntries } from "@/hooks/useDraws";
import { useRealtimeActiveDraw, useRealtimeUserEntries } from "@/hooks/useRealtimeDraws";
import TokenPurchaseDialog from "@/components/TokenPurchaseDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Draws = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { data: activeDraw, isLoading: drawLoading } = useActiveDraw();
  const { data: upcomingDraws = [] } = useUpcomingDraws();
  const { data: userEntries = [] } = useUserEntries();
  const enterDraw = useEnterDraw();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [buyTokensOpen, setBuyTokensOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [selectedEntries, setSelectedEntries] = useState(1);

  // Enable real-time updates
  useRealtimeActiveDraw();
  useRealtimeUserEntries(user?.id);

  // Calculate user's entries for current draw
  const currentDrawEntry = userEntries.find((e) => e.draw_id === activeDraw?.id);
  const userEntriesCount = currentDrawEntry?.entries_count || 0;

  useEffect(() => {
    if (!activeDraw) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(activeDraw.ends_at).getTime();
      const distance = endTime - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeDraw]);

  // Calculate max entries user can afford
  const maxAffordableEntries = activeDraw && profile 
    ? Math.floor(profile.token_balance / activeDraw.token_cost)
    : 0;
  const remainingSpots = activeDraw 
    ? activeDraw.max_entries - activeDraw.current_entries 
    : 0;
  const maxEntries = Math.min(maxAffordableEntries, remainingSpots, 100); // Cap at 100

  const handleEnterDraw = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!activeDraw) return;
    
    if (!profile || profile.token_balance < activeDraw.token_cost) {
      navigate("/dashboard");
      return;
    }
    
    setSelectedEntries(1);
    setConfirmDialogOpen(true);
  };

  const confirmEntry = async () => {
    if (!activeDraw) return;
    
    await enterDraw.mutateAsync({
      drawId: activeDraw.id,
      tokenCost: activeDraw.token_cost,
      entriesCount: selectedEntries,
    });
    
    setConfirmDialogOpen(false);
  };

  const entriesPercentage = activeDraw
    ? (activeDraw.current_entries / activeDraw.max_entries) * 100
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-hero">
          <div className="container text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Lucky <span className="text-gradient">Draws</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Enter the active draw for a chance to win amazing digital prizes!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Active Draw */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex items-center gap-2 mb-8">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse-glow" />
                <span className="text-sm font-medium">Live Now</span>
              </div>
              <h2 className="text-2xl font-bold">Active Draw</h2>
            </div>

            {drawLoading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : activeDraw ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto"
              >
                <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-card">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

                  <div className="relative p-6 md:p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      {/* Prize Info */}
                      <div className="text-center md:text-left">
                        <div className="text-7xl mb-4">{activeDraw.prize_emoji || "🎁"}</div>
                        <h3 className="text-3xl font-bold mb-2">{activeDraw.prize_name}</h3>
                        <p className="text-muted-foreground mb-4">{activeDraw.prize_subtitle}</p>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent">
                          <Ticket className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{activeDraw.token_cost} tokens</span>
                          <span className="text-sm text-muted-foreground">per entry</span>
                        </div>

                        {userEntriesCount > 0 && (
                          <div className="mt-4 p-3 rounded-xl bg-success/10 border border-success/20">
                            <p className="text-sm text-success font-medium">
                              ✓ You have {userEntriesCount} {userEntriesCount === 1 ? "entry" : "entries"} in this draw!
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Stats & Timer */}
                      <div className="space-y-6">
                        {/* Countdown Timer */}
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Ends in</span>
                          </div>
                          <div className="flex justify-center gap-3">
                            {[
                              { value: timeLeft.hours, label: "HRS" },
                              { value: timeLeft.minutes, label: "MIN" },
                              { value: timeLeft.seconds, label: "SEC" },
                            ].map((item) => (
                              <div key={item.label} className="text-center">
                                <div className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center">
                                  <span className="text-2xl font-bold">
                                    {String(item.value).padStart(2, "0")}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Entries Progress with LIVE indicator */}
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>Total Entries</span>
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                                <Radio className="h-3 w-3 animate-pulse" />
                                LIVE
                              </span>
                            </span>
                            <motion.span 
                              key={activeDraw.current_entries}
                              initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
                              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                              className="font-semibold"
                            >
                              {activeDraw.current_entries} / {activeDraw.max_entries}
                            </motion.span>
                          </div>
                          <div className="h-3 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${entriesPercentage}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full rounded-full bg-primary"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 text-right">
                            {activeDraw.max_entries - activeDraw.current_entries} spots left
                          </p>
                        </div>

                        {/* Your Entries Display */}
                        <div className="p-3 rounded-xl bg-accent/50 border border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Your Entries</span>
                            <motion.span 
                              key={userEntriesCount}
                              initial={{ scale: 1.3, color: "hsl(var(--primary))" }}
                              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                              className="text-xl font-bold"
                            >
                              {userEntriesCount}
                            </motion.span>
                          </div>
                        </div>

                        {/* CTA */}
                        {user ? (
                          <Button
                            variant="hero"
                            size="lg"
                            className="w-full"
                            onClick={handleEnterDraw}
                            disabled={enterDraw.isPending}
                          >
                            {enterDraw.isPending ? (
                              <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Entering...
                              </span>
                            ) : (
                              <>
                                Enter Draw ({activeDraw.token_cost} tokens)
                                <ArrowRight className="h-5 w-5" />
                              </>
                            )}
                          </Button>
                        ) : (
                          <Link to="/auth">
                            <Button variant="hero" size="lg" className="w-full">
                              Sign In to Enter
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        )}

                        {user && profile && profile.token_balance < activeDraw.token_cost && (
                          <div className="text-sm text-center space-y-2">
                            <p className="text-destructive flex items-center justify-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              Need {activeDraw.token_cost - profile.token_balance} more tokens
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setBuyTokensOpen(true)}
                            >
                              Buy Tokens Now
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">No Active Draw Right Now</h3>
                <p className="text-muted-foreground">
                  Check back soon! A new draw will start shortly.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Draws */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">
              Upcoming <span className="text-gradient">Draws</span>
            </h2>

            {upcomingDraws.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No upcoming draws scheduled yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {upcomingDraws.map((draw, index) => (
                  <motion.div
                    key={draw.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-6 rounded-2xl bg-muted/50 border border-border"
                  >
                    <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-muted text-xs font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Coming Soon
                    </div>

                    <div className="text-4xl mb-4">{draw.prize_emoji || "🎁"}</div>
                    <h3 className="font-semibold text-lg mb-1">{draw.prize_name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{draw.prize_subtitle}</p>

                    <div className="flex items-center gap-1 text-sm">
                      <Ticket className="h-4 w-4 text-primary" />
                      <span className="font-medium">{draw.token_cost} tokens per entry</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Confirm Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enter Draw</DialogTitle>
              <DialogDescription>
                Choose how many entries you want to purchase.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
              {/* Prize Info */}
              <div className="p-4 rounded-xl bg-muted flex items-center gap-4">
                <div className="text-3xl">{activeDraw?.prize_emoji}</div>
                <div>
                  <p className="font-semibold">{activeDraw?.prize_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {activeDraw?.token_cost} tokens per entry
                  </p>
                </div>
              </div>

              {/* Entry Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium">How many entries?</label>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedEntries(Math.max(1, selectedEntries - 1))}
                    disabled={selectedEntries <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-20 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <span className="text-2xl font-bold">{selectedEntries}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedEntries(Math.min(maxEntries, selectedEntries + 1))}
                    disabled={selectedEntries >= maxEntries}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Select */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 5, 10].map((num) => (
                    <Button
                      key={num}
                      variant={selectedEntries === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedEntries(Math.min(num, maxEntries))}
                      disabled={num > maxEntries}
                      className="w-12"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="space-y-2 p-4 rounded-xl bg-accent/50 border border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Cost</span>
                  <span className="font-semibold text-primary">
                    {selectedEntries * (activeDraw?.token_cost || 0)} tokens
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Balance</span>
                  <span className="font-medium">{profile?.token_balance || 0} tokens</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Balance After</span>
                  <span className="font-semibold">
                    {(profile?.token_balance || 0) - selectedEntries * (activeDraw?.token_cost || 0)} tokens
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={confirmEntry} disabled={enterDraw.isPending}>
                {enterDraw.isPending ? "Entering..." : `Confirm ${selectedEntries} ${selectedEntries === 1 ? 'Entry' : 'Entries'}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Token Purchase Dialog */}
        <TokenPurchaseDialog
          open={buyTokensOpen}
          onOpenChange={setBuyTokensOpen}
          suggestedAmount={activeDraw ? activeDraw.token_cost - (profile?.token_balance || 0) : 10}
          currentBalance={profile?.token_balance || 0}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Draws;
