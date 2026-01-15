import { useState } from "react";
import { Bell, Gift, Check, Clock, Copy, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useUserPrizes, Prize } from "@/hooks/usePrizes";
import { useRealtimePrizes } from "@/hooks/useRealtimePrizes";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: prizes = [], isLoading } = useUserPrizes();
  
  // Enable realtime updates for prizes
  useRealtimePrizes();

  const pendingPrizes = prizes.filter((p) => p.status === "pending");
  const hasNotifications = pendingPrizes.length > 0;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Prize code copied to clipboard!");
  };

  const getStatusBadge = (status: string) => {
    if (status === "delivered") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
          <Check className="h-3 w-3" />
          Delivered
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/20 text-warning">
        <Clock className="h-3 w-3" />
        Pending
      </span>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {hasNotifications && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold"
              >
                {pendingPrizes.length}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 bg-popover border border-border shadow-lg"
      >
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            Your Prizes
          </h3>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Loading...
            </div>
          ) : prizes.length === 0 ? (
            <div className="p-6 text-center">
              <Gift className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No prizes yet. Enter draws for a chance to win!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {prizes.slice(0, 5).map((prize) => (
                <PrizeItem
                  key={prize.id}
                  prize={prize}
                  onCopy={copyToClipboard}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          )}
        </div>

        {prizes.length > 0 && (
          <div className="p-3 border-t border-border">
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full gap-2">
                View All Prizes
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

interface PrizeItemProps {
  prize: Prize;
  onCopy: (code: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

const PrizeItem = ({ prize, onCopy, getStatusBadge }: PrizeItemProps) => {
  return (
    <div className="p-3 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm truncate">
            {prize.prize_name}
          </p>
          <div className="mt-1">{getStatusBadge(prize.status)}</div>
        </div>
      </div>

      {prize.status === "delivered" && prize.prize_code && (
        <div className="mt-2 p-2 rounded-lg bg-accent/50">
          <div className="flex items-center justify-between gap-2">
            <code className="text-xs font-mono text-foreground truncate flex-1">
              {prize.prize_code}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => onCopy(prize.prize_code!)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <p className="mt-1 text-xs text-muted-foreground">
        Won on {new Date(prize.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};

export default NotificationBell;
