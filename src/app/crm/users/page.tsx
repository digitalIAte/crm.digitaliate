import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/lib/services";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const session = await getServerSession(authOptions) as any;
    
    if (!session || session?.user?.role !== 'superadmin') {
        redirect("/crm");
    }

    const users = await getUsers();

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 p-6 md:p-0">
            <UsersClient users={users} />
        </div>
    );
}
