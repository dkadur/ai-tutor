"use client";

import { type FC, forwardRef } from "react";

import { BotIcon, ChevronDownIcon } from "lucide-react";

import { questions } from "@prisma/client";
import { Thread } from "@/components/ui/assistant-ui/thread";

import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export const AiTutorPanel: FC<{
  predefinedMessages?: string[];
  currentQuestion?: questions;
  performAction?: (action: string, choice: string) => void;
  setIsAIControlling: (value: boolean) => void;
  eliminatedChoices: { [key: string]: { isEliminated: boolean; eliminatedByAI: boolean; } };
}> = ({ predefinedMessages, currentQuestion, performAction, setIsAIControlling, eliminatedChoices }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden rounded-lg bg-white">
        <Thread 
          predefinedMessages={predefinedMessages} 
          currentQuestion={currentQuestion} 
          performAction={performAction}
          setIsAIControlling={setIsAIControlling}
          eliminatedChoices={eliminatedChoices}
        />
      </div>
    </div>
  );
};

export const AssistantModal: FC<{
  predefinedMessages?: string[];
  currentQuestion?: questions;
  setIsAIControlling: (value: boolean) => void;
}> = ({ predefinedMessages, currentQuestion, setIsAIControlling }) => {
  return (
    <>
      <div className="hidden lg:block">
        <Popover>
          <PopoverTrigger asChild>
            <FloatingAssistantButton />
          </PopoverTrigger>
          <PopoverContent
            sideOffset={16}
            collisionPadding={32}
            className="bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out data-[state=open]:zoom-in data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-right-1/2 z-50 h-[500px] w-[800px] overflow-clip rounded-xl border p-0 shadow-md outline-none [&>div]:bg-inherit"
          >
            <Thread predefinedMessages={predefinedMessages} currentQuestion={currentQuestion} setIsAIControlling={setIsAIControlling}/>
          </PopoverContent>
        </Popover>
      </div>
      <div className="lg:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <FloatingAssistantButton />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Assistant</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
          <DrawerContent>
            <Thread predefinedMessages={predefinedMessages} currentQuestion={currentQuestion} setIsAIControlling={setIsAIControlling} />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

type FloatingAssistantButtonProps = { "data-state"?: "open" | "closed" };

const FloatingAssistantButton = forwardRef<HTMLButtonElement, FloatingAssistantButtonProps>(({ "data-state": state, ...rest }, ref) => {
  return (
    <Button
      variant="ghost"
      {...rest}
      className="shadow text-white w-11 h-11 px-0 py-0 flex items-center hover:text-white cursor-pointer transition-transform animate-border rounded-full bg-white bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%]"
      ref={ref}
    >
      <div className="flex items-center gap-2">
        <BotIcon
          data-state={state}
          className="size-6 transition-all data-[state=open]:hidden data-[state=closed]:rotate-0 data-[state=open]:rotate-90 data-[state=closed]:scale-100 data-[state=open]:scale-0"
        />

        <ChevronDownIcon
          data-state={state}
          className="size-6 transition-all data-[state=closed]:hidden data-[state=closed]:-rotate-90 data-[state=open]:rotate-0 data-[state=closed]:scale-0 data-[state=open]:scale-100"
        />
      </div>
    </Button>
  );
});

FloatingAssistantButton.displayName = "FloatingAssistantButton";
