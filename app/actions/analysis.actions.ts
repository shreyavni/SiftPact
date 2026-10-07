'use server';

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Lazy-initialise Prisma so the import itself never crashes
function getPrisma() {
    try {
        const { PrismaClient } = require("@prisma/client");
        return new PrismaClient();
    } catch {
        return null;
    }
}

interface SaveAnalysisInput {
    documentName: string;
    contentText: string;
    analysisJson: object;
    riskScore: number;
    tags?: string[];
}

export async function saveAnalysis(data: SaveAnalysisInput) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: 'Not authenticated' };
    }

    const prisma = getPrisma();
    if (!prisma) {
        console.warn('[saveAnalysis] DATABASE_URL not configured – skipping save');
        return { success: false, error: 'Database not configured. Analysis was not saved.' };
    }

    try {
        // Check if user exists in DB
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });

        if (!existingUser) {
            return { success: false, error: 'Please complete onboarding first' };
        }

        const analysis = await prisma.savedAnalysis.create({
            data: {
                userId: userId,
                documentName: data.documentName,
                contentText: data.contentText,
                analysisJson: JSON.stringify(data.analysisJson),
                riskScore: data.riskScore,
                tags: data.tags || []
            }
        });

        revalidatePath('/dashboard');

        return { success: true, id: analysis.id };
    } catch (error: any) {
        console.error('[SAVE_ANALYSIS] Error:', error);
        return { success: false, error: error.message };
    }
}

export async function getUserAnalyses() {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    const prisma = getPrisma();
    if (!prisma) {
        console.warn('[getUserAnalyses] DATABASE_URL not configured – returning empty list');
        return [];
    }

    try {
        const analyses = await prisma.savedAnalysis.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                documentName: true,
                riskScore: true,
                tags: true,
                createdAt: true
            }
        });

        return analyses;
    } catch (error) {
        console.error('[GET_ANALYSES] Error:', error);
        return [];
    }
}

export async function getAnalysisById(id: string) {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const prisma = getPrisma();
    if (!prisma) {
        return null;
    }

    try {
        const analysis = await prisma.savedAnalysis.findFirst({
            where: { id, userId }
        });

        return analysis;
    } catch (error) {
        console.error('[GET_ANALYSIS] Error:', error);
        return null;
    }
}

export async function deleteAnalysis(id: string) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: 'Not authenticated' };
    }

    const prisma = getPrisma();
    if (!prisma) {
        return { success: false, error: 'Database not configured' };
    }

    try {
        await prisma.savedAnalysis.delete({
            where: { id, userId }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error: any) {
        console.error('[DELETE_ANALYSIS] Error:', error);
        return { success: false, error: error.message };
    }
}

