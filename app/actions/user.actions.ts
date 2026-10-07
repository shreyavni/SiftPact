'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Lazy-initialise Prisma so the import itself never crashes
function getPrisma() {
    try {
        const { PrismaClient } = require("@prisma/client");
        return new PrismaClient();
    } catch {
        return null;
    }
}

export async function updateUserRole(role: 'freelancer' | 'business') {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Unauthorized");
    }

    const prisma = getPrisma();
    if (!prisma) {
        // Database not configured – just redirect so the page doesn't crash
        console.warn('[updateUserRole] DATABASE_URL not configured – skipping DB write');
        revalidatePath('/dashboard');
        redirect('/dashboard');
    }

    const email = user.emailAddresses[0].emailAddress;

    try {
        // Upsert user: Create if new, Update if exists
        await prisma.user.upsert({
            where: { id: userId },
            update: { role: role },
            create: {
                id: userId,
                email: email,
                role: role
            }
        });
    } catch (error) {
        console.error('[updateUserRole] DB error (is PostgreSQL running?):', error);
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function getUserRole() {
    const { userId } = await auth();
    if (!userId) return null;

    const prisma = getPrisma();
    if (!prisma) {
        // No database configured – return a default role so pages can render
        console.warn('[getUserRole] DATABASE_URL not configured – returning default role');
        return 'freelancer';
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });
        return user?.role || 'freelancer';
    } catch (error) {
        console.error('[getUserRole] DB error (is PostgreSQL running?):', error);
        return 'freelancer';
    }
}
