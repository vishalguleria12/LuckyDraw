import { motion } from "framer-motion";
import { Trophy, Gift, Calendar, User } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCompletedDraws } from "@/hooks/useDraws";

const maskUsername = (username: string | null) => {
  if (!username) return "User***";
  if (username.length <= 3) return username + "***";
  return username.slice(0, 3) + "***" + username.slice(-1);
};

const Winners = () => {
  const { data: completedDraws = [], isLoading } = useCompletedDraws();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-hero">
          <div className="container text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success mb-4">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-medium">Verified Winners</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Recent <span className="text-gradient">Winners</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Congratulations to all our lucky winners! Your username could be next.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Winners List */}
        <section className="py-16">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : completedDraws.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Winners Yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Draws are happening soon! Be the first to participate and win amazing digital prizes.
                </p>
              </motion.div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {completedDraws.map((draw, index) => (
                  <motion.div
                    key={draw.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-card transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Prize Icon */}
                      <div className="text-5xl shrink-0">{draw.prize_emoji || "🎁"}</div>

                      {/* Prize Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{draw.prize_name}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                            Delivered
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{draw.prize_subtitle}</p>
                      </div>

                      {/* Winner Info */}
                      <div className="sm:text-right">
                        <div className="flex items-center gap-2 sm:justify-end mb-1">
                          <User className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{maskUsername(draw.winner_username)}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:justify-end text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(draw.ends_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Trust Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 max-w-2xl mx-auto"
            >
              <div className="p-6 rounded-2xl bg-muted/50 border border-border text-center">
                <Gift className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">100% Transparent Winners</h3>
                <p className="text-sm text-muted-foreground">
                  All winners are selected using a cryptographically secure random selection process.
                  Usernames are partially masked for privacy. Prizes are delivered digitally within 24 hours.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Winners;
