import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description: "Read our terms and conditions for booking Marrakech experiences. Learn about bookings, payments, cancellations, and our policies.",
    openGraph: {
        title: "Terms & Conditions | Explore Marrakech",
        description: "Our booking terms, cancellation policy, and service conditions for Marrakech experiences.",
        url: "https://marrakech-luxe.vercel.app/terms",
    },
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background pt-28 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">

                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                    Terms & Conditions
                </h1>

                <div className="prose prose-lg max-w-none space-y-8">

                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Booking & Reservations</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            When you request a booking through our platform, we will contact you via WhatsApp or email to confirm availability and finalize details. A booking is only confirmed once you receive our written confirmation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Payment Terms</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            <strong>No Online Payment Required:</strong> We do not require payment through our website. Payment is made directly to your guide in cash at the time of your experience.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            <strong>Accepted Currencies:</strong> We accept Moroccan Dirham (MAD), Euros (EUR), and US Dollars (USD). Exchange rates will be confirmed at the time of booking.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Cancellation Policy</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            <strong>Free Cancellation:</strong> You may cancel your booking up to 24 hours before your scheduled experience for a full refund.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            <strong>Late Cancellation:</strong> Cancellations made less than 24 hours before the experience may be subject to charges.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            <strong>No-Show:</strong> Failure to show up for a confirmed booking without prior cancellation will result in full charges.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Changes & Modifications</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We will do our best to accommodate changes to your booking. Please contact us via WhatsApp or email as soon as possible if you need to modify your reservation. Changes are subject to availability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Weather & Force Majeure</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            In case of extreme weather conditions or circumstances beyond our control, we reserve the right to cancel or modify experiences for safety reasons. In such cases, we will offer a full refund or alternative arrangements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Liability & Insurance</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            While we work with licensed and experienced guides, participants engage in activities at their own risk. We recommend purchasing comprehensive travel insurance. We are not responsible for personal injury, loss, or damage to personal property.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Conduct & Behavior</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Participants are expected to behave respectfully toward guides, other participants, and local communities. We reserve the right to refuse service to anyone who fails to comply with reasonable instructions or behaves inappropriately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Photography & Media</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By participating in our experiences, you consent to the use of photographs or videos taken during the experience for promotional purposes, unless you explicitly request otherwise.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            For questions about these Terms & Conditions, please contact us:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-2">
                            <li>Email: info@marrakechluxe.com</li>
                            <li>Phone/WhatsApp: +212 601 439 975</li>
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
