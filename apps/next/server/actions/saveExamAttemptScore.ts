import prisma from '@/lib/prisma';
import { getExamTypeCookie } from './setExamTypeCookie';
import { ExamConfig, QuestionType } from '@/types';


export const saveExamAttemptScore = async (attemptId: string) => {
	try {
		const attemptIdInt = parseInt(attemptId);
		const examType = await getExamTypeCookie();
		const examConfig = await prisma.exam_config.findFirst({
			where: {
				exam_type: examType
			}
		}) as ExamConfig;

		const correctAnswersGroupedBySection = await prisma.exam_attempt_questions.groupBy({
			by: ['section_id'],
			where: {
				attempt_id: attemptIdInt,
				is_correct: true,
			},
			_count: true,
		});

		const sectionIds = correctAnswersGroupedBySection.map(group => group.section_id);

		const sections = await prisma.sections.findMany({
			where: {
				section_id: { in: sectionIds }
			},
			select: {
				section_id: true,
				type: true,
			}
		});

		const results = correctAnswersGroupedBySection.map(group => {
			const section = sections.find(sec => sec.section_id === group.section_id);
			return {
				section_type: section?.type,
				correct_count: group._count,
			};
		});

		const score_mapping = examConfig?.config?.score_mapping;

		const aggregatedResults = results.reduce((acc, result) => {
			if (result.section_type) {
				if (!acc[result.section_type]) {
					acc[result.section_type] = 0;
				}
				acc[result.section_type] += result.correct_count;
			}
			return acc;
		}, {} as Record<QuestionType, number>);

		const defaultScores = Object.entries(score_mapping).map(([type, score]) => ({
			type: type as QuestionType,
			score: score_mapping[type as QuestionType][0],
		}));

		const scoreObject = new Map<QuestionType, number>();

		defaultScores.forEach(score => {
			scoreObject.set(score.type, score.score);
		});

		Object.entries(aggregatedResults).forEach(([sectionType, result]) => {
			const type = sectionType as QuestionType;
			const score = score_mapping[type][result];
			scoreObject.set(type, score);
		});

		const totalScore = Object.values(Object.fromEntries(scoreObject)).reduce((acc, score) => acc + score, 0);

		await prisma.exam_attempts.update({
			where: { attempt_id: attemptIdInt },
			data: {
				total_score: totalScore,
				scores: JSON.stringify(Object.fromEntries(scoreObject)),
			},
		});

		return {
			totalScore,
			readingWritingScore: scoreObject.get("rw")!,
			mathScore: scoreObject.get("math")!,
		};
	} catch (error) {
		console.error("Could not save attempt score", error);
		throw new Error("Could not save attempt score");
	}
};
