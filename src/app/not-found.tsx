import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="text-center max-w-2xl">
                <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    Page Not Found
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                    Oops! The page you&apos;re looking for seems to have wandered off into the Marrakech medina.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/">
                        <Button size="lg" className="rounded-full">
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/experiences">
                        <Button size="lg" variant="outline" className="rounded-full">
                            Browse Experiences
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
