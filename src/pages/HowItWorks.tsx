import { motion } from "framer-motion";
import { Coins, Ticket, Trophy, Gift, Shield, Clock, Users, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Coins,
    title: "1. Create Account & Buy Tokens",
    description: "Sign up for free and purchase tokens for just ₹1 each using UPI, credit/debit cards, or net banking. Your tokens are stored securely in your wallet.",
    details: [
      "Instant account creation with email",
      "Secure payment through trusted gateways",
      "Tokens credited immediately",
      "No minimum purchase required",
    ],
    color: "bg-token-gold",
  },
  {
    icon: Ticket,
    title: "2. Enter Active Draws",
    description: "Browse the current active draw and spend your tokens to enter. Each draw shows the prize, entry cost, and how many spots are left.",
    details: [
      "One active draw at a time for transparency",
      "Clear entry cost displayed",
      "Real-time participant count",
      "Multiple entries allowed per draw",
    ],
    color: "bg-primary",
  },
  {
    icon: Clock,
    title: "3. Wait for Draw to End",
    description: "Each draw has a countdown timer. When the timer reaches zero or all spots are filled, the draw closes and a winner is selected.",
    details: [
      "Live countdown visible to all",
      "Fair random selection algorithm",
      "Results announced immediately",
      "Winner notified via email",
    ],
    color: "bg-warning",
  },
  {
    icon: Trophy,
    title: "4. Winner Announcement",
    description: "After the draw ends, one lucky winner is randomly selected. Winners are announced publicly with masked usernames for privacy.",
    details: [
      "Transparent selection process",
      "Public winner announcements",
      "Privacy-protected usernames",
      "Verifiable results",
    ],
    color: "bg-success",
  },
  {
    icon: Gift,
    title: "5. Claim Your Prize",
    description: "Winners receive their digital prizes directly in their dashboard. Gift card codes, subscription links, and credits are delivered instantly.",
    details: [
      "Instant digital delivery",
      "Prizes in your dashboard",
      "Email confirmation sent",
      "No physical shipping needed",
    ],
    color: "bg-accent-foreground",
  },
];

const faqs = [
  {
    q: "Is this gambling?",
    a: "No. LuckyDraw is a reward engagement platform. Tokens have no cash value, cannot be withdrawn, and all prizes are digital rewards only. This is entertainment, not gambling.",
  },
  {
    q: "Can I withdraw tokens for cash?",
    a: "No. Tokens can only be used to participate in draws. They cannot be converted to cash, transferred, or refunded.",
  },
  {
    q: "How are winners selected?",
    a: "Winners are selected using a cryptographically secure random number generator when the draw ends. The process is fair and transparent.",
  },
  {
    q: "What prizes can I win?",
    a: "Digital rewards only: Netflix, YouTube Premium, Amazon Pay gift cards, Google Play credits, and other subscription services.",
  },
  {
    q: "How do I receive my prize?",
    a: "Prizes are delivered digitally to your dashboard and via email. You'll receive codes or links to redeem your reward.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-hero">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                How <span className="text-gradient">LuckyDraw</span> Works
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple, transparent, and fun. Learn how you can win digital rewards with tokens.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16">
          <div className="container">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`grid md:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-4`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`${index % 2 === 1 ? "md:order-1" : ""} flex justify-center`}>
                    <div className="w-64 h-64 rounded-3xl bg-card border border-border shadow-card flex items-center justify-center">
                      <step.icon className={`h-24 w-24 text-muted-foreground/30`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Banner */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Shield, label: "100% Secure", desc: "Encrypted transactions" },
                { icon: Users, label: "Real Winners", desc: "Verified participants" },
                { icon: Gift, label: "Instant Delivery", desc: "Digital prizes delivered" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-10">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-hero">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-muted-foreground mb-6">Create your free account and join the next draw!</p>
            <Link to="/auth">
              <Button variant="hero" size="xl">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;