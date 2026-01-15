import { motion } from "framer-motion";
import { Clock, Bell, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingDraws = [
  {
    id: "2",
    prizeName: "Amazon Pay",
    prizeSubtitle: "₹500 Gift Card",
    emoji: "🛒",
    tokenCost: 3,
    startsIn: "Tomorrow",
    color: "bg-orange-500/10 border-orange-500/20",
    iconColor: "text-orange-500",
  },
  {
    id: "3",
    prizeName: "YouTube Premium",
    prizeSubtitle: "3 Months",
    emoji: "📺",
    tokenCost: 8,
    startsIn: "In 2 days",
    color: "bg-red-500/10 border-red-500/20",
    iconColor: "text-red-500",
  },
  {
    id: "4",
    prizeName: "Google Play",
    prizeSubtitle: "₹300 Credit",
    emoji: "🎮",
    tokenCost: 4,
    startsIn: "In 3 days",
    color: "bg-green-500/10 border-green-500/20",
    iconColor: "text-green-500",
  },
];

const UpcomingDrawsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Upcoming <span className="text-gradient">Draws</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preview what's coming next. These draws will be available soon!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {upcomingDraws.map((draw, index) => (
            <motion.div
              key={draw.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative p-6 rounded-2xl border ${draw.color} backdrop-blur-sm`}
            >
              {/* Coming Soon Badge */}
              <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-muted text-xs font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {draw.startsIn}
              </div>

              <div className="text-4xl mb-4">{draw.emoji}</div>
              
              <h3 className="font-semibold text-lg mb-1">{draw.prizeName}</h3>
              <p className="text-sm text-muted-foreground mb-4">{draw.prizeSubtitle}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Gift className={`h-4 w-4 ${draw.iconColor}`} />
                  <span className="font-medium">{draw.tokenCost} tokens</span>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Bell className="h-4 w-4 mr-1" />
                  Notify
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingDrawsSection;
