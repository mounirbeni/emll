'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CreditCard, Building2, Banknote, Check } from 'lucide-react';

export type PaymentMethodType = 'PAYPAL' | 'BANK_TRANSFER' | 'CASH';

const options: {
  id: PaymentMethodType;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'PAYPAL',
    title: 'PayPal',
    description: 'Pay securely with your PayPal account or card',
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    id: 'BANK_TRANSFER',
    title: 'Bank Transfer',
    description: 'Transfer to our bank and upload proof of payment',
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    id: 'CASH',
    title: 'Cash (Pay on Arrival)',
    description: 'Pay your guide in person on the day of the experience',
    icon: <Banknote className="w-6 h-6" />,
  },
];

interface PaymentMethodSelectorProps {
  selected: PaymentMethodType | null;
  onSelect: (method: PaymentMethodType) => void;
  disabled?: boolean;
  amount: string;
  className?: string;
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  disabled,
  amount,
  className,
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <p className="text-sm font-medium text-gray-700">
        Select your payment method — Total:{' '}
        <span className="font-bold text-primary">{amount}</span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <Card
              key={opt.id}
              className={cn(
                'cursor-pointer transition-all border-2 rounded-2xl overflow-hidden',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50/50',
                disabled && 'opacity-60 pointer-events-none'
              )}
              onClick={() => !disabled && onSelect(opt.id)}
            >
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col items-center text-center gap-3">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                      isSelected ? 'bg-primary text-white' : 'bg-orange-50 text-primary'
                    )}
                  >
                    {opt.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{opt.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
