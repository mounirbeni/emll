'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { checkEmailStatus, sendTestEmailAction } from '@/app/actions/admin-actions';

interface EmailStatus {
    configured: boolean;
    fromEmail: string;
    message: string;
}

export default function TestEmailPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [status, setStatus] = useState<EmailStatus | null>(null);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setCheckingStatus(true);
        try {
            const result = await checkEmailStatus();
            if (result.success && result.data) {
                setStatus(result.data);
            } else {
                toast.error(result.error || 'Failed to check status');
                setStatus({ configured: false, fromEmail: '', message: result.error || 'Failed to check status' });
            }
        } catch (error) {
            console.error('Error checking email status:', error);
            toast.error('Failed to check email status');
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleSendTestEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter an email address');
            return;
        }

        try {
            setLoading(true);
            const result = await sendTestEmailAction(email);

            if (result.success) {
                toast.success(`Test email sent successfully to ${email}! Check your inbox.`);
                setEmail('');
            } else {
                toast.error(result.error || 'Failed to send test email');
            }
        } catch (error) {
            console.error('Error sending test email:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to send test email';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 space-y-6 pt-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Test Email Service</h1>
                <p className="text-muted-foreground mt-2">
                    Test and verify your email service configuration
                </p>
            </div>

            {/* Status Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Service Status
                    </CardTitle>
                    <CardDescription>
                        Current configuration and status of the email service
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {checkingStatus ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Checking status...
                        </div>
                    ) : status ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                {status.configured ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <div>
                                    <p className="font-medium">
                                        {status.configured ? 'Email service is configured' : 'Email service not configured'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{status.message}</p>
                                </div>
                            </div>

                            {status.configured && (
                                <div className="rounded-lg bg-muted p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">From Email:</span>
                                        <span className="text-sm text-muted-foreground">{status.fromEmail}</span>
                                    </div>
                                </div>
                            )}

                            {!status.configured && (
                                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                Configuration Required
                                            </p>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                                Make sure GMAIL_USER and GMAIL_APP_PASSWORD are set in your .env file and restart the server.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button
                                variant="outline"
                                onClick={fetchStatus}
                                className="w-full sm:w-auto"
                            >
                                Refresh Status
                            </Button>
                        </div>
                    ) : (
                        <div className="text-muted-foreground">
                            Unable to check email status
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Test Email Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Send Test Email</CardTitle>
                    <CardDescription>
                        Send a test booking confirmation email to verify the service is working
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSendTestEmail} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your-email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the email address where you want to receive the test email
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !status?.configured}
                            className="w-full sm:w-auto"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Test Email
                                </>
                            )}
                        </Button>

                        {!status?.configured && (
                            <p className="text-sm text-muted-foreground">
                                Please configure the email service first before sending test emails.
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Setup Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="font-medium mb-1">1. Environment Variables</p>
                            <p className="text-muted-foreground">
                                Make sure your <code className="px-1.5 py-0.5 bg-muted rounded">.env</code> file contains:
                            </p>
                            <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                                {`GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here`}
                            </pre>
                        </div>
                        <div>
                            <p className="font-medium mb-1">2. Restart Server</p>
                            <p className="text-muted-foreground">
                                After adding environment variables, restart your Next.js development server for changes to take effect.
                            </p>
                        </div>
                        <div>
                            <p className="font-medium mb-1">3. Verify Configuration</p>
                            <p className="text-muted-foreground">
                                Use the status check above to verify that the email service is properly configured.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
