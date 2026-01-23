import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { Check } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English (US)', current: true },
    { code: 'fr', name: 'Français', current: false },
    { code: 'es', name: 'Español', current: false },
    { code: 'de', name: 'Deutsch', current: false },
    { code: 'ar', name: 'العربية', current: false },
];

export default function LanguagePage() {
    return (
        <MobileAppContainer className="bg-beige-50">
            <MobileTopBar title="Language" showBack />

            <div className="p-4">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            className="p-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <span className={`text-base ${lang.current ? 'font-semibold text-primary' : 'text-charcoal'}`}>
                                {lang.name}
                            </span>
                            {lang.current && (
                                <Check className="w-5 h-5 text-primary" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </MobileAppContainer>
    );
}
