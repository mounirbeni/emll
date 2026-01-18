import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "./settings-form";
import { getSettings } from "@/app/actions/admin-actions";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your business details and preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>
                        These details are displayed on emails and invoices.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm initialData={settings} />
                </CardContent>
            </Card>
        </div>
    );
}
