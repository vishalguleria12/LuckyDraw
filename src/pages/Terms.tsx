import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using LuckyDraw ("the Platform"), you accept and agree to be bound by these 
                Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Platform Description</h2>
              <p className="text-muted-foreground">
                LuckyDraw is a digital rewards engagement platform where users can purchase tokens and 
                participate in lucky draws to win digital prizes such as gift cards and subscription services.
              </p>
              <div className="p-4 rounded-xl bg-accent border border-border">
                <p className="font-medium mb-2">Important Clarification:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>This is NOT a gambling, betting, or lottery platform</li>
                  <li>Tokens have no monetary or cash value</li>
                  <li>Tokens cannot be withdrawn or exchanged for money</li>
                  <li>All prizes are digital rewards only (no cash prizes)</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Token System</h2>
              <p className="text-muted-foreground">
                Tokens are digital credits used exclusively for participating in draws on the Platform.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Tokens are purchased at ₹1 per token</li>
                <li>Tokens are non-refundable once purchased</li>
                <li>Tokens cannot be transferred to other users</li>
                <li>Tokens have no expiry date</li>
                <li>Tokens cannot be converted to cash under any circumstances</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Eligibility</h2>
              <p className="text-muted-foreground">
                To use LuckyDraw, you must:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Be at least 18 years of age</li>
                <li>Be a resident of India</li>
                <li>Have a valid email address</li>
                <li>Provide accurate and truthful information during registration</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Lucky Draws</h2>
              <p className="text-muted-foreground">
                Each draw has specific rules including token cost per entry, maximum entries, and duration. 
                Winners are selected randomly through our automated system when the draw ends. Winner 
                selection is final and cannot be disputed.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Prize Delivery</h2>
              <p className="text-muted-foreground">
                All prizes are digital rewards delivered via email or through your account dashboard. 
                Prizes include gift cards, subscription codes, and digital credits. Physical delivery 
                is not available. Prizes cannot be exchanged for cash.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Prohibited Activities</h2>
              <p className="text-muted-foreground">Users are prohibited from:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Creating multiple accounts</li>
                <li>Using automated systems or bots</li>
                <li>Attempting to manipulate draws</li>
                <li>Sharing accounts with others</li>
                <li>Any fraudulent activities</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Account Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate accounts that violate these terms. 
                In case of termination due to violation, any remaining tokens will be forfeited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                LuckyDraw is provided "as is" without warranties of any kind. We are not liable for 
                any indirect, incidental, or consequential damages arising from your use of the Platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, please contact us at support@luckydraw.in
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;