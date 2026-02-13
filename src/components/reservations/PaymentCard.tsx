import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PaymentCardProps {
    title: string;
    description: string;
    originalPrice: number;
    finalPrice: number;
    discountLabel?: string;
    discountColor?: string; // 'green' | 'red' | 'blue'
    icon: React.ReactNode;
    selected: boolean;
    onSelect: () => void;
}

export default function PaymentCard({
    title,
    description,
    originalPrice,
    finalPrice,
    discountLabel,
    discountColor = 'green',
    icon,
    selected,
    onSelect,
}: PaymentCardProps) {
    return (
        <Card
            className={cn(
                'cursor-pointer transition-all border-2 rounded-2xl overflow-hidden relative',
                selected
                    ? 'border-orange-500 bg-orange-50/30'
                    : 'border-gray-200 hover:border-orange-500/50 hover:bg-gray-50'
            )}
            onClick={onSelect}
        >
            {discountLabel && (
                <div
                    className={cn(
                        'absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-xl',
                        discountColor === 'green' && 'bg-green-500',
                        discountColor === 'red' && 'bg-red-500',
                        discountColor === 'blue' && 'bg-blue-500' // Using blue for cash extra cost visual
                    )}
                >
                    {discountLabel}
                </div>
            )}

            <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", selected ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600")}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through">€{originalPrice}</span>
                        <span className="font-bold text-xl text-gray-900">€{finalPrice}</span>
                    </div>

                    <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", selected ? "border-orange-500 bg-orange-500" : "border-gray-300")}>
                        {selected && <Check className="w-4 h-4 text-white" />}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
