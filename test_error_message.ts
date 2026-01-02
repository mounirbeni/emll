
import { PrismaClient } from '@prisma/client';
import { BookingService } from './src/services/booking.service';
import { NotFoundError } from './src/lib/errors';

// Mock dependencies if needed, or just instantiate logic if possible
// But BookingService imports repositories which import prisma.
// So we can just try to run the service method in a script.

async function main() {
    const service = new BookingService();

    console.log("--- Test 1: Empty String ---");
    try {
        await service.createBooking({
            activityId: "",
            activityTitle: "Test",
            date: new Date(),
            guests: 1,
            totalPrice: 100,
            name: "Test",
            email: "test@test.com"
        } as any, 'TEST_USER_ID');
    } catch (e: any) {
        console.log("Error caught:", e.message);
    }

    console.log("--- Test 2: Space String ---");
    try {
        await service.createBooking({
            activityId: " ",
            activityTitle: "Test",
            date: new Date(),
            guests: 1,
            totalPrice: 100,
            name: "Test",
            email: "test@test.com"
        } as any, 'TEST_USER_ID');
    } catch (e: any) {
        console.log("Error caught:", e.message);
    }

    console.log("--- Test 3: Undefined ---");
    try {
        await service.createBooking({
            activityId: undefined,
            activityTitle: "Test",
            date: new Date(),
            guests: 1,
            totalPrice: 100,
            name: "Test",
            email: "test@test.com"
        } as any, 'TEST_USER_ID');
    } catch (e: any) {
        console.log("Error caught:", e.message);
        if (e.message && e.message.includes("Activity with ID")) {
            console.log("MATCH FOUND!");
        }
    }
}

main().catch(console.error);
