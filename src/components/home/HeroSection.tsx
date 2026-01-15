import { motion } from "framer-motion";
import { ArrowRight, Gift, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">India's #1 Digital Rewards Platform</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Win Digital Rewards with{" "}
              <span className="text-gradient">Lucky Tokens</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Purchase tokens for just ₹1 each and participate in exciting draws. 
              Win Netflix, Amazon Pay, YouTube Premium, and more digital prizes!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/auth">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Winning
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 mt-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-success" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gift className="h-4 w-4 text-primary" />
                <span>Digital Prizes Only</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-token-gold" />
                <span>₹1 Per Token</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Prize Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative grid grid-cols-2 gap-4 max-w-md mx-auto">
              {/* Prize Cards */}
              {[
                { name: "Netflix Premium", subtitle: "1 Month", color: "bg-red-500", delay: 0.4 },
                { name: "Amazon Pay", subtitle: "₹500 Gift Card", color: "bg-orange-500", delay: 0.5 },
                { name: "YouTube Premium", subtitle: "3 Months", color: "bg-red-600", delay: 0.6 },
                { name: "Google Play", subtitle: "₹300 Credit", color: "bg-green-500", delay: 0.7 },
              ].map((prize, i) => (
                <motion.div
                  key={prize.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: prize.delay }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-5 rounded-2xl bg-card shadow-card border border-border ${
                    i === 0 ? "animate-float" : ""
                  }`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <div className={`w-10 h-10 rounded-xl ${prize.color} mb-3 flex items-center justify-center`}>
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">{prize.name}</h3>
                  <p className="text-xs text-muted-foreground">{prize.subtitle}</p>
                </motion.div>
              ))}

              {/* Floating decoration */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full border-2 border-dashed border-primary/20"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
