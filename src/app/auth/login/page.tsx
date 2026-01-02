import { redirect } from 'next/navigation';

export default function AuthLoginPage({
    searchParams,
}: {
    searchParams: { callbackUrl?: string };
}) {
    const callbackUrl = searchParams?.callbackUrl;
    const target = callbackUrl
        ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : '/login';

    redirect(target);
}
