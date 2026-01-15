import { motion } from "framer-motion";
import { Coins, Ticket, Trophy, Gift } from "lucide-react";

const steps = [
  {
    icon: Coins,
    title: "Buy Tokens",
    description: "Purchase tokens for just ₹1 each using UPI, cards, or net banking.",
    color: "bg-token-gold",
  },
  {
    icon: Ticket,
    title: "Enter Draws",
    description: "Use your tokens to enter exciting lucky draws for digital prizes.",
    color: "bg-primary",
  },
  {
    icon: Trophy,
    title: "Win Prizes",
    description: "Winners are selected randomly when the draw countdown ends.",
    color: "bg-success",
  },
  {
    icon: Gift,
    title: "Claim Rewards",
    description: "Receive your digital gift cards or subscription codes instantly.",
    color: "bg-accent-foreground",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent, and fun. Here's how you can win digital rewards on LuckyDraw.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="relative p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-card transition-shadow">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
