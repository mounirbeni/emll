
import { redirect } from "next/navigation";

export default function NewExperiencePage() {
    // Redirect to services/new which uses the ServiceEditor component
    redirect("/admin/services/new");
}
