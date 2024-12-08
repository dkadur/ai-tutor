'use client';

import React from 'react';

import clsx from 'clsx';
import { icons } from 'lucide-react';

import { ActionButton } from '../feature/exam/action-button';
import { Drawer, DrawerContent, DrawerTrigger } from './drawer';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export default function ExamAction({
  title,
  icon,
  showPopup,
  setShowPopup,
  PopupComponent,
}: {
  title: string,
  icon: keyof typeof icons;
  showPopup: boolean;
  setShowPopup: (isOpen: boolean) => void;
  PopupComponent: React.ReactNode;
}) {
  const LucideIcon = icons[icon];
  const togglePoppup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <>
      <div className="hidden md:block">
        <Tooltip>
          <TooltipTrigger className="flex items-center">
            <ActionButton icon={icon} onClick={togglePoppup} />
          </TooltipTrigger>
          <TooltipContent sideOffset={20} className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg ">
            {title}
          </TooltipContent>
        </Tooltip>

        {showPopup && PopupComponent}
      </div>
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger className="flex">
            <LucideIcon className="text-gray-700 md:hidden" size={20} />
          </DrawerTrigger>
          <DrawerContent
            aria-describedby={title}
            className={clsx(
              title === "Calculator" && "bg-[#0b0c11] border-[#0b0c11]",
            )}
          >
            {PopupComponent}
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
