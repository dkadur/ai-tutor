import { Lock } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

export const LetAICook = () => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isWithinDisabledSection, setIsWithinDisabledSection] = useState(false);
	const disabledSectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (disabledSectionRef.current) {
				const rect = disabledSectionRef.current.getBoundingClientRect();
				const isInside =
					e.clientX >= rect.left &&
					e.clientX <= rect.right &&
					e.clientY >= rect.top &&
					e.clientY <= rect.bottom;

				setIsWithinDisabledSection(isInside);
				setMousePosition({ x: e.clientX, y: e.clientY });
			}
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	const triggerForceFieldAnimation = (e: React.MouseEvent) => {
		const rect = disabledSectionRef.current?.getBoundingClientRect();
		if (rect) {
				const clickX = e.clientX - rect.left;
				const clickY = e.clientY - rect.top;

				// Calculate the diameter of the ripple
				const rippleSize = Math.max(rect.width, rect.height) * 2;

				const ripple = document.createElement('div');
				ripple.className = 'absolute bg-white/30 rounded-full pointer-events-none';
				ripple.style.width = `${rippleSize}px`;
				ripple.style.height = `${rippleSize}px`;
				ripple.style.position = 'absolute';
				ripple.style.left = `${clickX - rippleSize / 2}px`;
				ripple.style.top = `${clickY - rippleSize / 2}px`;
				ripple.style.transform = 'scale(0)';
				ripple.style.opacity = '1';
				ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
				ripple.style.backgroundColor = 'rgba(255, 102, 102, 0.8)'

				disabledSectionRef.current?.appendChild(ripple);

				// Trigger the animation
				setTimeout(() => {
						ripple.style.transform = 'scale(1)';
						ripple.style.opacity = '0';
				}, 0);

				// Remove the ripple after animation
				setTimeout(() => {
						ripple.remove();
				}, 600);
		}
	};

	return (
		<div
			ref={disabledSectionRef}
			className="absolute rounded-bl-2xl inset-0 bg-black/30 z-50 flex items-center justify-center"
			onClick={triggerForceFieldAnimation}
		>
			<Lock
				className="text-white/70"
				size={100}
				strokeWidth={2}
			/>
			{isWithinDisabledSection && (
				<div
					className="fixed pointer-events-none"
					style={{
						left: mousePosition.x + 15,
						top: mousePosition.y + 15
					}}
				>
					<div className="bg-primary-500/80 text-white px-4 py-2 rounded-lg shadow-lg">
						<div className="flex items-center gap-2">
							<Image src="/wolfie.png" alt="Wolfie" width={20} height={20} />
							<p className="text-sm font-medium">Wolfie is cooking here</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};