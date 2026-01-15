import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, Gift, Ticket, History, Plus, ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useUserEntries } from "@/hooks/useDraws";
import { useTokenTransactions, usePurchaseTokens } from "@/hooks/useTokens";
import { useUserPrizes } from "@/hooks/usePrizes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tokenPackages = [
  { amount: 10, price: 10, popular: false },
  { amount: 50, price: 50, popular: true },
  { amount: 100, price: 100, popular: false },
  { amount: 200, price: 200, popular: false },
];

const Dashboard = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: entries = [] } = useUserEntries();
  const { data: transactions = [] } = useTokenTransactions();
  const { data: prizes = [] } = useUserPrizes();
  const purchaseTokens = usePurchaseTokens();
  
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const handlePurchase = async (amount: number) => {
    await purchaseTokens.mutateAsync(amount);
    setBuyDialogOpen(false);
    setCustomAmount("");
  };

  const handleCustomPurchase = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      handlePurchase(amount);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {profile.username || "User"}! 👋
            </h1>
            <p className="text-muted-foreground">
              Manage your tokens, view entries, and claim prizes.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Token Balance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl token-gradient flex items-center justify-center">
                  <Coins className="h-6 w-6 text-foreground" />
                </div>
                <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Buy
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Buy Tokens</DialogTitle>
                      <DialogDescription>
                        Choose a package or enter a custom amount. ₹1 = 1 token.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 py-4">
                      {tokenPackages.map((pkg) => (
                        <button
                          key={pkg.amount}
                          onClick={() => handlePurchase(pkg.amount)}
                          disabled={purchaseTokens.isPending}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            pkg.popular
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {pkg.popular && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                              Popular
                            </span>
                          )}
                          <div className="text-2xl font-bold">{pkg.amount}</div>
                          <div className="text-sm text-muted-foreground">
                            tokens for ₹{pkg.price}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Custom Amount</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                        />
                        <Button
                          onClick={handleCustomPurchase}
                          disabled={!customAmount || purchaseTokens.isPending}
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Payment integration coming soon. Tokens added for demo.
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-3xl font-bold">{profile.token_balance}</p>
              <p className="text-sm text-muted-foreground">Token Balance</p>
            </motion.div>

            {/* Active Entries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold">{entries.length}</p>
              <p className="text-sm text-muted-foreground">Active Entries</p>
            </motion.div>

            {/* Prizes Won */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft"
            >
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <p className="text-3xl font-bold">{prizes.length}</p>
              <p className="text-sm text-muted-foreground">Prizes Won</p>
            </motion.div>

            {/* Total Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <History className="h-6 w-6 text-accent-foreground" />
              </div>
              <p className="text-3xl font-bold">{transactions.length}</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            <button
              onClick={() => navigate("/draws")}
              className="p-6 rounded-2xl bg-primary text-primary-foreground text-left hover:shadow-glow transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Enter Active Draw</h3>
                  <p className="text-primary-foreground/80">
                    Use your tokens to enter the current lucky draw
                  </p>
                </div>
                <ArrowRight className="h-6 w-6" />
              </div>
            </button>

            <button
              onClick={() => setBuyDialogOpen(true)}
              className="p-6 rounded-2xl bg-card border border-border text-left hover:shadow-card transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Buy More Tokens</h3>
                  <p className="text-muted-foreground">
                    Purchase tokens starting at just ₹1
                  </p>
                </div>
                <Plus className="h-6 w-6 text-token-gold" />
              </div>
            </button>
          </motion.div>

          {/* Prizes Section */}
          {prizes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold mb-4">Your Prizes</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prizes.map((prize) => (
                  <div
                    key={prize.id}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Gift className="h-5 w-5 text-success" />
                      <span className="font-semibold">{prize.prize_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          prize.status === "delivered"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {prize.status === "delivered" ? "Delivered" : "Pending"}
                      </span>
                      {prize.prize_code && (
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {prize.prize_code}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
            {transactions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-card border border-border text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground">
                  Buy tokens to get started!
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-right text-sm font-medium hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 10).map((tx) => (
                      <tr key={tx.id} className="border-t border-border">
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              tx.transaction_type === "purchase"
                                ? "bg-success/10 text-success"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {tx.transaction_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{tx.description}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          <span className={tx.amount > 0 ? "text-success" : "text-foreground"}>
                            {tx.amount > 0 ? "+" : ""}{tx.amount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-muted-foreground hidden sm:table-cell">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
