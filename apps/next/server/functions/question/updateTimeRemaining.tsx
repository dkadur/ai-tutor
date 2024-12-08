"use server";
import prisma from "@/lib/prisma";

export async function updateTimeRemaining(attemptId: number, sectionId: number, remainingTime: number) {
    try {
        await prisma.exam_attempt_sections.updateMany({
            where: {
                attempt_id: attemptId,
                section_id: sectionId,
            },
            data: {
                current_section_time_left: remainingTime,
            },
        });
    } catch (error) {
        console.error("Failed to update remaining time:", error);
        throw new Error("Error retrieving data");
    }
}
