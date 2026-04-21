import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/crm/login");
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <CalendarClient />
        </div>
    );
}
