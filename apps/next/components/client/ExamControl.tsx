import React from 'react';
import { Bot, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ControlIndicatorProps {
	isAI: boolean;
}

const ExamControl: React.FC<ControlIndicatorProps> = ({ isAI }) => {
	return (
		<div className="relative flex gap-2">
			<Tooltip>
				<TooltipTrigger>
					<div
						className={`
              border transition-all duration-300 ease-in-out
              rounded-full flex items-center justify-center gap-2 
              px-3 py-3 md:px-4 md:py-3.5 cursor-default select-none h-[34px] w-[178px]
              ${isAI ?
								'border-primary-500/50 bg-primary-500/10 hover:bg-primary-500/20' :
								'border-secondary-500/50 bg-secondary-500/10 hover:bg-secondary-500/20'
							}
            `}
					>
						<div className="flex items-center gap-2 relative animate-pulse">
							{isAI ? (
								<>
									<Bot className="text-primary-500" size={18} />
									<span className="font-bold text-primary-500 ">AI in Control</span>
								</>
							) : (
								<>
									<User className="text-secondary-500" size={18} />
									<span className="font-bold text-secondary-500">User in Control</span>
								</>
							)}
						</div>
					</div>
				</TooltipTrigger>
				<TooltipContent
				>
					<p className="flex items-center">
						{isAI ? (
							<>
								AI is in control of the exam form
							</>
						) : (
							<>
									User is in control of the exam form
							</>
						)}
					</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
};

export default ExamControl;