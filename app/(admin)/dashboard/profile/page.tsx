import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * User Profile Page
 *
 * Placeholder for user profile management.
 */
export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Profile settings will be available here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
