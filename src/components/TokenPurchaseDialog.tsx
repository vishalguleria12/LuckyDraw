import { useState } from "react";
import { usePurchaseTokens } from "@/hooks/useTokens";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TokenPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestedAmount?: number;
  currentBalance?: number;
}

const quickAmounts = [5, 10, 25, 50, 100];

const TokenPurchaseDialog = ({
  open,
  onOpenChange,
  suggestedAmount,
  currentBalance = 0,
}: TokenPurchaseDialogProps) => {
  const purchaseTokens = usePurchaseTokens();
  const [amount, setAmount] = useState(suggestedAmount || 10);

  const handlePurchase = async () => {
    if (amount > 0) {
      await purchaseTokens.mutateAsync(amount);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Tokens</DialogTitle>
          <DialogDescription>
            Purchase any amount of tokens. ₹1 = 1 token.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Balance */}
          <div className="p-3 rounded-lg bg-muted text-center">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-2xl font-bold">{currentBalance} tokens</p>
          </div>

          {/* Amount Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Amount</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-right"
                />
                <span className="text-sm text-muted-foreground">tokens</span>
              </div>
            </div>
            <Slider
              value={[amount]}
              onValueChange={([val]) => setAmount(val)}
              min={1}
              max={500}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>500</span>
            </div>
          </div>

          {/* Quick Select Amounts */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick select</Label>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant={amount === amt ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(amt)}
                  className="flex-1 min-w-[60px]"
                >
                  {amt}
                </Button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount to pay</span>
              <span className="font-semibold">₹{amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">New balance</span>
              <span className="font-semibold text-primary">
                {currentBalance + amount} tokens
              </span>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            variant="hero"
            className="w-full"
            onClick={handlePurchase}
            disabled={purchaseTokens.isPending || amount < 1}
          >
            {purchaseTokens.isPending ? "Processing..." : `Buy ${amount} Tokens for ₹${amount}`}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Payment integration coming soon. Tokens added for demo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenPurchaseDialog;
