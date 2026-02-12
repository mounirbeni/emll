'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Upload, Loader2, CheckCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

const BANK_DETAILS = {
  bankName: 'Explore Marrakesh Business',
  fullName: 'Explore Marrakesh SARL',
  iban: process.env.NEXT_PUBLIC_BANK_IBAN || 'MA00 0000 0000 0000 0000 0000 00',
  bic: process.env.NEXT_PUBLIC_BANK_BIC || 'BICMAXXX',
};

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

interface BankTransferFormProps {
  bookingId: string;
  amount: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

export function BankTransferForm(props: BankTransferFormProps) {
  const { bookingId, amount, onSuccess, onError, disabled } = props;
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(label + ' copied');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      onError('Invalid file type. Please use JPG, JPEG or PNG.');
      return;
    }
    setUploading(true);
    onError('');
    try {
      const formData = new FormData();
      formData.append('proof', file);
      const res = await fetch(`/api/bookings/${bookingId}/payment/upload-proof`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setSuccess(true);
      toast.success('Proof uploaded. We will verify your payment shortly.');
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Upload failed');
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <p className="font-semibold text-green-800">Proof uploaded successfully</p>
        <p className="text-sm text-green-700 mt-1">
          We will verify your payment and update the booking status soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 md:p-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-primary" />
          Bank details
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Transfer <strong className="text-primary">{amount}</strong> to the account below and upload a screenshot.
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-100">
            <span className="text-sm text-gray-500">Account name</span>
            <span className="font-medium text-gray-900">{BANK_DETAILS.fullName}</span>
            <Button type="button" variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => handleCopy(BANK_DETAILS.fullName, 'Name')}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-100">
            <span className="text-sm text-gray-500">IBAN</span>
            <span className="font-mono text-sm font-medium text-gray-900 break-all">{BANK_DETAILS.iban}</span>
            <Button type="button" variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => handleCopy(BANK_DETAILS.iban, 'IBAN')}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-100">
            <span className="text-sm text-gray-500">Bank</span>
            <span className="font-medium text-gray-900">{BANK_DETAILS.bankName}</span>
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Upload proof of payment (JPG or PNG)</p>
        <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handleFileChange} disabled={disabled || uploading} className="hidden" />
        <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={disabled || uploading} className="w-full h-12 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold">
          {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4 mr-2" /> Choose file</>}
        </Button>
      </div>
    </div>
  );
}
