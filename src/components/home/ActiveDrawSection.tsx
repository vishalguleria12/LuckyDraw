import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Ticket, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DrawData {
  id: string;
  prizeName: string;
  prizeSubtitle: string;
  prizeImage: string;
  tokenCost: number;
  maxEntries: number;
  currentEntries: number;
  endsAt: Date;
}

const mockDraw: DrawData = {
  id: "1",
  prizeName: "Netflix Premium",
  prizeSubtitle: "1 Month Subscription",
  prizeImage: "🎬",
  tokenCost: 5,
  maxEntries: 100,
  currentEntries: 67,
  endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
};

const ActiveDrawSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = mockDraw.endsAt.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const entriesPercentage = (mockDraw.currentEntries / mockDraw.maxEntries) * 100;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4 animate-pulse-glow" />
            <span className="text-sm font-medium">Live Draw</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Active Draw
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-card">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

            <div className="relative p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Prize Info */}
                <div className="text-center md:text-left">
                  <div className="text-6xl mb-4">{mockDraw.prizeImage}</div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {mockDraw.prizeName}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {mockDraw.prizeSubtitle}
                  </p>

                  {/* Entry cost */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{mockDraw.tokenCost} tokens</span>
                    <span className="text-sm text-muted-foreground">per entry</span>
                  </div>
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
                      ].map((item, i) => (
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

                  {/* Entries Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Entries
                      </span>
                      <span className="font-semibold">
                        {mockDraw.currentEntries} / {mockDraw.maxEntries}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${entriesPercentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {mockDraw.maxEntries - mockDraw.currentEntries} spots left
                    </p>
                  </div>

                  {/* CTA */}
                  <Link to="/auth">
                    <Button variant="hero" size="lg" className="w-full">
                      Enter Draw
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActiveDrawSection;
