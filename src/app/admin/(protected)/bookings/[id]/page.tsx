
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import BookingActions from "@/components/admin/BookingActions"; // We need to create this for interactive buttons
import { ArrowLeft, User, Calendar, Mail, Phone, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            experience: true
        }
    });

    if (!booking) {
        notFound();
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/bookings" className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-2">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Bookings
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Booking #{booking.id.slice(-6)}</h1>
                        <p className="text-gray-500 mt-1">Created on {format(booking.createdAt, "PPP p")}</p>
                    </div>
                    <BookingActions bookingId={booking.id} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-gray-400" /> Experience Details
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Experience</p>
                                <p className="font-medium">{booking.experience.title}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Scheduled Date</p>
                                <p className="font-medium text-lg">{format(booking.date, "EEEE, MMM d, yyyy")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Participants</p>
                                <p className="font-medium">{booking.numberOfPeople} People</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-medium">{booking.experience.duration}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-gray-400" /> Customer Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                                    {booking.userName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{booking.userName}</p>
                                    <p className="text-sm text-gray-500">Customer</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                    <a href={`mailto:${booking.userEmail}`} className="text-primary hover:underline">{booking.userEmail}</a>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                    <a href={`tel:${booking.userPhone}`} className="text-gray-700 hover:text-gray-900">{booking.userPhone}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {booking.notes && (
                        <div className="bg-[#F5EADB] p-6 rounded-xl border border-[#FF6900]/20 shadow-sm">
                            <h2 className="text-lg font-semibold mb-2 text-[#FF6900]">Special Requests / Notes</h2>
                            <p className="text-[#FF6900]/80">{booking.notes}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            <CreditCard className="w-5 h-5 mr-2 text-gray-400" /> Payment Summary
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Price per person</span>
                                <span>€{(booking.totalPrice / booking.numberOfPeople).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Participants</span>
                                <span>x {booking.numberOfPeople}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                                <span>Total Due</span>
                                <span>€{booking.totalPrice}</span>
                            </div>
                            <div className="pt-2">
                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Pay on Arrival / Card</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
                        <Link href={`https://wa.me/212601439975?text=${encodeURIComponent(`Hi ${booking.userName}, regarding your booking for ${booking.experience.title}...`)}`} target="_blank" className="block w-full text-center py-2 px-4 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] font-medium text-sm mb-2">
                            Open WhatsApp
                        </Link>
                        <a href={`mailto:${booking.userEmail}`} className="block w-full text-center py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                            Send Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
