'use client';

import { useContext, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';

import { generateNewSection } from '@/server/functions/section/generateNewSection';
import { updateTimeCompleteSection } from '@/server/functions/section/updateTimeCompleteSection';

import { TimerContext } from '../providers/TimerContext';

interface NextSectionClientProps {
	attempt_section_id: number;
	navigationLink: string;
	actionMessage: string;
	user_id: string;
	total_questions: number;
	section_id: number;
	attempt_id: number;
	exam_id: number;
	isLastSection?: boolean;
	isBreakNeeded?: boolean;
	isLoading?: boolean;
	handleCompleteAttempt: () => void;
}

export default function NextSectionClient({
	attempt_section_id,
	navigationLink,
	actionMessage,
	section_id,
	attempt_id,
	exam_id,
	isLastSection,
	isBreakNeeded,
	isLoading,
	handleCompleteAttempt
}: NextSectionClientProps) {

	const { remainingTime } = useContext(TimerContext);
	const router = useRouter();
	const [buttonClicked, setButtonClicked] = useState(false);

	const handleNextSection = async () => {
		setButtonClicked(true);
		await updateTimeCompleteSection(attempt_section_id, remainingTime);
		// await sectionLevelAndXp(attempt_id, section_id, total_questions, user_id);
		if (isLastSection) {
			await handleCompleteAttempt();
		} else if (isBreakNeeded) {
			router.push(navigationLink);
		} else {
			await generateNewSection(exam_id, attempt_id, section_id);
		}
	};

	return (
		<Button variant="primary" onClick={handleNextSection} disabled={isLoading || buttonClicked}>
			{isLoading || buttonClicked ? "Loading..." : actionMessage}
		</Button>
	);
}
