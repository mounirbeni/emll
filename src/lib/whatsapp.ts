
/**
 * WhatsApp Integration
 * Generates deep links for booking confirmations
 */

interface BookingDetails {
    id?: string;
    userName: string;
    experienceTitle: string;
    date: Date;
    numberOfPeople: number;
    totalPrice: number;
    currency?: string;
}

const PHONE_NUMBER = "212601439975";

export function generateWhatsAppLink(details: BookingDetails): string {
    const dateStr = new Date(details.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const message = `New Booking:
Name: ${details.userName}
Experience: ${details.experienceTitle}
Date: ${dateStr}
People: ${details.numberOfPeople}
Total: ${details.totalPrice}€`;

    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
}

export function openWhatsApp(details: BookingDetails) {
    const link = generateWhatsAppLink(details);
    window.open(link, '_blank');
}
