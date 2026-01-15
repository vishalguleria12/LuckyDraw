import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p className="text-muted-foreground">
                LuckyDraw ("we," "our," or "us") is committed to protecting your privacy. This Privacy 
                Policy explains how we collect, use, disclose, and safeguard your information when you 
                use our digital rewards platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
              <h3 className="text-xl font-medium">Personal Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Email address</li>
                <li>Name (optional)</li>
                <li>Phone number (for account recovery)</li>
              </ul>

              <h3 className="text-xl font-medium mt-4">Transaction Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Token purchase history</li>
                <li>Draw participation records</li>
                <li>Prize redemption history</li>
              </ul>

              <h3 className="text-xl font-medium mt-4">Technical Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Usage patterns and preferences</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
              <p className="text-muted-foreground">We use your information to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Provide and maintain our services</li>
                <li>Process token purchases and draw entries</li>
                <li>Deliver prizes to winners</li>
                <li>Communicate with you about your account</li>
                <li>Send promotional content (with your consent)</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal information, 
                including encryption, secure servers, and regular security audits. However, no method 
                of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Data Sharing</h2>
              <p className="text-muted-foreground">We do not sell your personal information. We may share data with:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Payment processors for token purchases</li>
                <li>Service providers who assist our operations</li>
                <li>Law enforcement when legally required</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Your Rights</h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Cookies</h2>
              <p className="text-muted-foreground">
                We use essential cookies to maintain your session and preferences. Analytics cookies 
                help us understand how you use our platform. You can control cookie settings in your 
                browser.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your data for as long as your account is active or as needed to provide 
                services. Transaction records are kept for 7 years as per Indian regulations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our platform is not intended for users under 18 years of age. We do not knowingly 
                collect information from minors.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related inquiries, please contact our Data Protection Officer at 
                privacy@luckydraw.in
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;