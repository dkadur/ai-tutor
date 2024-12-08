'use server';

import prisma from '@/lib/prisma';

export async function updateTimeCompleteSection(attempt_section_id: number, remainingTime: number) {
	await prisma.exam_attempt_sections.update({
		where: {
			attempt_section_id,
		},
		data: {
			time_left_on_complete: remainingTime,
		},
	});
}
