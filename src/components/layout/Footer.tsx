import { Link } from "react-router-dom";
import { Coins, Shield, FileText, Lock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Coins className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Lucky<span className="text-gradient">Draw</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              India's trusted digital rewards platform. Win gift cards and subscriptions with tokens.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/draws" className="hover:text-foreground transition-colors">
                  Current Draws
                </Link>
              </li>
              <li>
                <Link to="/winners" className="hover:text-foreground transition-colors">
                  Recent Winners
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust Badge */}
          <div>
            <h4 className="font-semibold mb-4">Trust & Safety</h4>
            <div className="p-4 rounded-xl bg-accent/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">100% Secure</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All transactions are encrypted. Your tokens are used only for digital rewards.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Important Disclaimer:</strong> Tokens purchased on LuckyDraw have no monetary value and cannot be withdrawn or exchanged for cash. 
              All prizes are digital rewards only (gift cards, subscriptions). This is a rewards engagement platform, not gambling.
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LuckyDraw. All rights reserved. Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
