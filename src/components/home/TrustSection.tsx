import { motion } from "framer-motion";
import { Shield, Lock, Gift, Users, CheckCircle, XCircle } from "lucide-react";

const trustPoints = [
  {
    icon: Gift,
    title: "Digital Rewards Only",
    description: "Win gift cards, subscriptions, and digital codes. No cash prizes or monetary withdrawals.",
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    description: "All payments are processed through trusted Indian payment gateways with encryption.",
  },
  {
    icon: Shield,
    title: "Fair & Transparent",
    description: "Random winner selection with publicly verifiable results. Complete transparency.",
  },
  {
    icon: Users,
    title: "Real Winners",
    description: "Genuine winners announced with masked usernames. Join thousands of happy users.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built on <span className="text-gradient">Trust</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            LuckyDraw is a reward engagement platform, not gambling. Here's why you can trust us.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <point.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </motion.div>
          ))}
        </div>

        {/* What We Are vs What We're Not */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {/* What We Are */}
          <div className="p-6 rounded-2xl bg-success/10 border border-success/20">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              What We Are
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "Digital rewards engagement platform",
                "Token-based entry system",
                "Gift cards & subscription prizes",
                "Fun & transparent lucky draws",
                "Made for entertainment",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What We're Not */}
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              What We're Not
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "Not a gambling or betting platform",
                "No cash prizes or withdrawals",
                "No monetary value for tokens",
                "No bank transfers or payouts",
                "Not a casino or lottery",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
