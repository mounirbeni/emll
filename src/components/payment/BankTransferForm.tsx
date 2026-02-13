'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Upload, Loader2, CheckCircle, Copy, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(label + ' copied');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      onError('Invalid file type. Please use JPG, JPEG or PNG.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      onError('File size too large. Max 5MB.');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    onError('');
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handeUpload = async () => {
    if (!file) return;

    setUploading(true);
    onError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bookingId', bookingId);
      formData.append('type', 'paymentProof');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setSuccess(true);
      toast.success('Proof uploaded. We will verify your payment shortly.');
      onSuccess();
    } catch (err) {
      console.error(err);
      onError(err instanceof Error ? err.message : 'Upload failed');
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
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

      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-700">Upload proof of payment (JPG or PNG)</p>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors cursor-pointer text-center group"
          >
            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-primary">Click to upload image</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-gray-200">
            {preview && (
              <div className="aspect-video relative bg-black/5">
                <Image
                  src={preview}
                  alt="Proof preview"
                  fill
                  className="object-contain"
                  unoptimized // Local blob url
                />
              </div>
            )}
            <div className="p-3 bg-white flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                disabled={uploading}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="hidden"
        />

        {file && (
          <Button
            type="button"
            onClick={handeUpload}
            disabled={disabled || uploading}
            className="w-full h-12 rounded-xl bg-primary hover:bg-orange-600 text-white font-semibold transition-all shadow-lg shadow-primary/20"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                Confirm Payment
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
