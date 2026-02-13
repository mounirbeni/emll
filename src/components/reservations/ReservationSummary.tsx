import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users } from 'lucide-react';

interface ReservationSummaryProps {
    reservation: {
        basePrice: number;
        finalPrice: number | null;
        date: string;
        time: string;
        numberOfPersons: number;
    };
    experienceTitle: string;
}

export default function ReservationSummary({ reservation, experienceTitle }: ReservationSummaryProps) {
    return (
        <Card className="border-none shadow-md rounded-2xl overflow-hidden h-fit sticky top-24">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
                <CardTitle className="text-lg text-gray-900">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Experience</p>
                    <p className="font-bold text-gray-900 text-lg leading-tight">{experienceTitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500">Date</p>
                            <p className="font-medium text-gray-900">{reservation.date}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500">Time</p>
                            <p className="font-medium text-gray-900">{reservation.time}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500">Guests</p>
                            <p className="font-medium text-gray-900">{reservation.numberOfPersons} Person(s)</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600">Base Price</span>
                        <span className="font-medium text-gray-900">€{reservation.basePrice}</span>
                    </div>
                    {reservation.finalPrice && reservation.finalPrice !== reservation.basePrice && (
                        <div className="flex justify-between items-center text-green-600">
                            <span className="text-sm">Discount applied</span>
                            <span className="font-bold">-€{reservation.basePrice - reservation.finalPrice}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                        <span className="font-bold text-lg text-gray-900">Total</span>
                        <span className="font-bold text-2xl text-orange-600">
                            €{reservation.finalPrice || reservation.basePrice}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
