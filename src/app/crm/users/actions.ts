"use server";

import { createUser, updateUserRole, deleteUser } from "@/lib/services";
import { revalidatePath } from "next/cache";

export async function createUserAction(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!name || !email || !password || !role) {
        return { success: false, error: "Todos los campos son obligatorios" };
    }

    const result = await createUser(name, email, password, role);
    if (result.success) {
        revalidatePath("/crm/users");
        revalidatePath("/crm/leads/[id]", "page"); // Revalidate lead pages to update assignee dropdown
    }
    return result;
}

export async function updateUserRoleAction(id: string, role: string) {
    if (!id || !role) return { success: false, error: "ID o rol no válido" };
    
    // Safety check conceptually: prevent demoting oneself could be done here 
    // if we pass session email, but we'll keep it simple.

    const result = await updateUserRole(id, role);
    if (result.success) {
        revalidatePath("/crm/users");
        revalidatePath("/crm/sidebar");
        revalidatePath("/crm/leads/[id]", "page");
    }
    return result;
}

export async function deleteUserAction(id: string) {
    if (!id) return { success: false, error: "ID no válido" };
    const result = await deleteUser(id);
    if (result.success) {
        revalidatePath("/crm/users");
        revalidatePath("/crm/leads/[id]", "page");
    }
    return result;
}
