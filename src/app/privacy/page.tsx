import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how Explore Marrakech collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
    openGraph: {
        title: "Privacy Policy | Explore Marrakech",
        description: "Read our privacy policy to understand how we handle and protect your personal information.",
        url: "https://marrakech-luxe.vercel.app/privacy",
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background pt-28 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">

                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                    Privacy Policy
                </h1>

                <div className="prose prose-lg max-w-none space-y-8">

                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            When you request a booking or contact us, we collect:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Name and contact information (phone number, email address)</li>
                            <li>Booking preferences and requirements</li>
                            <li>Payment information (handled directly, not stored online)</li>
                            <li>Communication history with our team</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            We use your personal information to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Process and confirm your bookings</li>
                            <li>Communicate with you about your experiences</li>
                            <li>Provide customer support</li>
                            <li>Send you updates about our services (with your consent)</li>
                            <li>Improve our services and user experience</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            We do not sell, rent, or trade your personal information. We may share information with:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li><strong>Licensed Guides:</strong> Only necessary information to facilitate your experience</li>
                            <li><strong>Service Providers:</strong> Third parties who assist in our operations (email, messaging platforms)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We implement appropriate security measures to protect your information from unauthorized access, alteration, or disclosure. However, no internet transmission is completely secure, so we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Cookies & Tracking</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our website uses cookies to improve your browsing experience and analyze site traffic. You can control cookie settings through your browser preferences.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Request deletion of your information</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Object to processing of your information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We retain your information for as long as necessary to provide our services and comply with legal obligations. Booking records are typically kept for 3 years for accounting purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Children&apos;s Privacy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our services are not directed to children under 16. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or sending you an email.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            If you have questions about this Privacy Policy or how we handle your information, please contact us:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Email: privacy@marrakechluxe.com</li>
                            <li>Phone: +212 601 439 975</li>
                            <li>Address: Marrakech Medina, Morocco 40000</li>
                        </ul>
                    </section>

                    <section className="pt-8 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
