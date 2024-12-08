"use client";

import { FC, useEffect, useState } from "react";

import { SendHorizontalIcon } from "lucide-react";

import { MarkdownText } from "@/components/ui/assistant-ui/markdown-text";
import { Avatar, AvatarFallback, AvatarImage, CustomClassAvatar } from "@/components/ui/avatar";
import { questions } from "@prisma/client";
import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAppendMessage,
  useComposerSend,
  useContentPartText,
  useSwitchToNewThread,
} from "@assistant-ui/react";
import { Button } from "../button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { useControlContext } from "@/components/providers/ControlContext";
import Image from "next/image";

const HIDDEN_MESSAGE = `
---HIDDEN MESSAGE---
You are an AI tutor assisting students with SAT Math, Reading, and Writing questions. Your role is to:

1. Provide hints and explanations
2. Offer full answers only when explicitly requested
3. Focus solely on Math, Reading, and Writing related topics

Use Correct LaTex for all variables and equations.

ALLOWED RESPONSE LATEX FORMAT: 
- $equation$ for inline, 
- $$equation$$ for block

AVOID USING NON-LATEX SPECIAL CHARACTERS

WRONG EXAMPLE: ( 12i^8 - 6i^4 + 3i^2 + 5 )
CORRECT EXAMPLE: $$12i^8 - 6i^4 + 3i^2 + 5$$

WRONG EXAMPLE: ( x^2 + y^2 = z^2 )
CORRECT EXAMPLE: $$x^2 + y^2 = z^2$$

WRONG EXAMPLE:  ( x = 1 )
CORRECT EXAMPLE: $$x = 1$$

WRONG EXAMPLE:  (-12)
CORRECT EXAMPLE: $-12$

WRONG EXAMPLE: (-12)
CORRECT EXAMPLE: $(-12)$

WRONG EXAMPLE: [-12]
CORRECT EXAMPLE: [$-12$]

WRONG EXAMPLE: ( 7x + 6 )
CORRECT EXAMPLE: $7x + 6$

WRONG EXAMPLE: [x^2]
CORRECT EXAMPLE: $[x^2]$
`;

// Common question details component
// Common question details component
function questionDetails(currentQuestion: any) {
  console.log("Current question object:", currentQuestion);
  
  const questionText = currentQuestion?.text?.replace(/`/g, "") || "N/A";
  console.log("Question text:", questionText);

  const passage = currentQuestion?.passage || "N/A";
  console.log("Passage (if applicable):", passage);

  const choiceA = currentQuestion?.choice_a?.replace(/`/g, "") || "N/A";
  console.log("Choice A:", choiceA);

  const choiceB = currentQuestion?.choice_b?.replace(/`/g, "") || "N/A";
  console.log("Choice B:", choiceB);

  const choiceC = currentQuestion?.choice_c?.replace(/`/g, "") || "N/A";
  console.log("Choice C:", choiceC);

  const choiceD = currentQuestion?.choice_d?.replace(/`/g, "") || "N/A";
  console.log("Choice D:", choiceD);

  return `
  Current question: ${questionText}
  Passage (if applicable): ${passage}
  Answer choices:
  A: ${choiceA}
  B: ${choiceB}
  C: ${choiceC}
  D: ${choiceD}
  `;
}


// Specific prompt functions
export function getGenericMessagePrompt(currentQuestion: any, userInput: string) {
  return `
  ${HIDDEN_MESSAGE}
  If general math question:
  - Use LaTeX for equations: $equation$ for inline, $$equation$$ for block
  - Avoid non-LaTeX special characters
  - Format answers using markdown + rehypeKatex + remarkMath
  - E.g. What is a Parabola?, Solve this linear equation, etc

  else if general reading/writing question:
  - Give detailed explanations, referencing specific parts of the passage
  - Explain grammar rules with examples

  ${typeof currentQuestion === "string" ? currentQuestion : questionDetails(currentQuestion)}
  ${typeof currentQuestion === "string" ? "" : "Question explanation:" + currentQuestion?.remarks?.replace(/`/g, "")}

  ${userInput==="" ? "" : "This is the user's response to the above question: " + userInput}

  Respond to the student's next message about this question, following the guidelines above. Make sure you know the right answer.
  `.trim();
}

export function getSimilarQuestionsPrompt(currentQuestion: any) {
  return `
  ${HIDDEN_MESSAGE}
  You are talking to a student who is struggling with a question.
  Your role is to generate a similar question to the question below:

  ${questionDetails(currentQuestion)}

  Generate the question in this format:
  {Question Text}
  A: {Answer Text}
  B: {Answer Text}
  C: {Answer Text}
  D: {Answer Text}

  Include a new line after each answer.

  Make sure the correct answer to your generated question is one of the answer choices. Make sure all the answers are unique.

  After you generate the question, you must ask the student to provide an answer to the question.

  When the student inputs an answer, you must confirm if it is correct or not. 
  `.trim();
}

export function getBreakdownPrompt(currentQuestion: any) {
  return `
  ${HIDDEN_MESSAGE}
  You are talking to a student who is struggling with a question. 
  Be terse. 
  Your role is to break down the question below into smaller parts:

  ${questionDetails(currentQuestion)}

  Break down the question into simpler parts. Ask the user to solve each step, one at a time. 
  If the user answers a step correctly, proceed to the next step. Otherwise, help them figure out the current step.
  `.trim();
}

export function getHelpPrompt(currentQuestion: any) {
  return `
  ${HIDDEN_MESSAGE}
  You are talking to a student who is struggling with an SAT question. 
  You must help them understand the question in terms of what it is asking and what the student is supposed to look for.
  Ensure that your answer is concise and to the point. Avoid long-winded explanations when possible. 
  The following the the question and the answer choices:
  
  ${questionDetails(currentQuestion)}
  
  `.trim();
}

export function getWalkThroughPrompt(currentQuestion: any, eliminatedChoices: { [key: string]: { isEliminated: boolean; eliminatedByAI: boolean } }) {
  const promptString = `
    ---HIDDEN MESSAGE---
    You are an AI tutor assisting students with SAT questions. 
    You must walk the student through the current question one step at a time.
    You must ask if the student understands your response at the end of each step (respond in bolded text).
    You must also ask if the student wants to try the next step when you feel it is appropriate.
    
    Additionally, we have 3 actions that you must take to help the student. 
    These actions should be stated in the beginning of the step and you can only take one action per step.
    The actions are:
    1. CROSSOUT {letter of the answer you want to cross out}
      - CROSSOUT means that you want to cross out an answer
      - You can only take this action once per step
      - Example: CROSSOUT A
    2. SELECT {letter of the answer you want to select}
      - SELECT means that you want to select an answer
      - You can only take this action after you have crossed out 3 wrong answers
      - Example: SELECT B
    3. TRANSFER
      - TRANSFER means that the controller of the step is being swapped to either you or the user
      - You can only take this action if the student previously agreed to transfer control
      - Example: TRANSFER

    Below is the context for the current question:

    Current question: ${currentQuestion?.text?.replace(/`/g, "")}
    Passage (if applicable): ${currentQuestion?.passage || "N/A"}
    Answer choices:
    A: ${currentQuestion?.choice_a?.replace(/`/g, "")}
    B: ${currentQuestion?.choice_b?.replace(/`/g, "")}
    C: ${currentQuestion?.choice_c?.replace(/`/g, "")}
    D: ${currentQuestion?.choice_d?.replace(/`/g, "")}

    Based off of your past eliminated choices and the student's eliminated choices the following answer choices still remain:
    ${Object.entries(eliminatedChoices)
      .filter(([key, value]) => !value.isEliminated)
      .map(([key]) => `Choice ${key.toUpperCase()} still remains.`)
      .join("\n")}

    The correct answer is: ${currentQuestion?.answer}

    Use proper formatting for the response. Also use bold and underline when you feel it is appropriate.
    `;

  return promptString.trim();
}

export const Thread: FC<{
  predefinedMessages?: string[];
  currentQuestion?: questions | string;
  performAction?: (action: string, choice: string) => void;
  setIsAIControlling: (value: boolean) => void;
  eliminatedChoices: { [key: string]: { isEliminated: boolean; eliminatedByAI: boolean } };
}> = ({ predefinedMessages, currentQuestion: initialQuestion, performAction, setIsAIControlling, eliminatedChoices }) => {
  const append = useAppendMessage();
  const [isHidden, setIsHidden] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<questions | string | undefined>(initialQuestion);
  const [originalQuestion, setOriginalQuestion] = useState<questions | string | undefined>(initialQuestion);
  const [activeQuestion, setActiveQuestion] = useState<questions | string | undefined>(initialQuestion); 
  const switchToNewThread = useSwitchToNewThread();
  const [prompt, setPrompt] = useState("");
  const [choicesHandled, setChoicesHandled] = useState<string[]>([]);
  const { modelObject, setModelObject } = useControlContext();
  const MODEL_OBJECTS = [
    {label: "GPT-4o-mini", provider: "openai", model: "gpt-4o-mini", imageSrc: "/chatgpt.svg"},
    // {label: "GPT-4o", provider: "openai", model: "gpt-4o", imageSrc: "/chatgpt.svg"},
    {label: "Gemini 1.5 Pro", provider: "google", model: "gemini-1.5-pro", imageSrc: "/google.svg"},
    {label: "Grok", provider: "xai", model: "grok-beta", imageSrc: "/xai.svg"},
  ];
  const allChoices = ["A", "B", "C", "D"];

  const handleChoices = (choice: string) => {
    setChoicesHandled([...choicesHandled, choice]);
  }

  useEffect(() => {
    switchToNewThread();
    setIsHidden(false);
  }, [originalQuestion]);

  const handlePredefinedMessages = (predefinedMessage: string) => {
    let promptFunction = getGenericMessagePrompt;

    if (predefinedMessage === "Walk me through this question") {
      setPrompt("walkthrough");
      // promptFunction = getWalkThroughPrompt;
      setIsAIControlling(true);
    } else if (predefinedMessage === "Give me a similar question") {
      setPrompt("similarQuestion");
      promptFunction = getSimilarQuestionsPrompt;
      setIsAIControlling(false);
    } else if (predefinedMessage === "Break down the question into smaller parts") {
      promptFunction = getBreakdownPrompt;
      setIsAIControlling(false);
    } else if (predefinedMessage === "Help me understand this question") {
      console.log("hello there");
      promptFunction = getHelpPrompt;
      setIsAIControlling(false);
    } else {
      setIsAIControlling(false);
    }
    console.log("predefinedMessage: ", predefinedMessage);

    append({
      content: [
        {
          text: predefinedMessage === "Walk me through this question" ? getWalkThroughPrompt(currentQuestion, eliminatedChoices) : promptFunction(originalQuestion, ""),
          type: "text",
        },
        {
          text: predefinedMessage,
          type: "text",
        },
      ],
    });
    setIsHidden(true);
  };

  // might make the most sense to move this to exam-form, but IDK
  // we have to think about once we start allowing both the user and AI to control the exam form
  // we want the AI to recieve the eliminatedChoices object and the userAnswer as well
  const setActionChoice = ({ action, choice }: { action: string, choice: string }) => {
    if (performAction && !choicesHandled.includes(choice)) {
      if (action === "SELECT") {
        allChoices.forEach((currentChoice) => {
          if (!choicesHandled.includes(currentChoice) && currentChoice !== choice) {
            performAction("CROSSOUT", currentChoice);
            handleChoices(currentChoice);
          }
        });
      } else if (action === "TRANSFER") {
        performAction(action, choice);
      }
      performAction(action, choice);
      console.log("Action performed", action, choice);
    } else {
      console.log("Action already performed", action, choice);
    }
  };

  return (
    <ThreadPrimitive.Root className="flex flex-col h-full bg-background">
      <div className="py-4">
        <Select defaultValue={"gpt-4o-mini"} onValueChange={(value: any) => setModelObject(MODEL_OBJECTS.find(m => m.model === value))}>
          <SelectTrigger className="rounded-full w-48 text-md font-bold dark:text-white dark:border-darkMode-gray-3 ml-auto mr-6">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent
            className="dark:bg-darkMode-gray-2 dark:border-darkMode-gray-3"
          >
            {MODEL_OBJECTS.map(modelObj => (
              <SelectItem
                className="dark:hover:bg-darkMode-gray-3 dark:focus:bg-darkMode-gray-3"
                key={modelObj.model} value={modelObj.model}>
                <div className="flex items-center w-full gap-2">
                  <Image src={modelObj.imageSrc} alt={modelObj.label} width={20} height={20} />
                  <p className="dark:text-white">{modelObj.label}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ThreadPrimitive.Viewport className="flex flex-col items-center h-full px-4 pt-8 overflow-y-auto scroll-smooth bg-inherit">
        <ThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            AssistantMessage: (props) => <AssistantMessage {...props} prompt={prompt} setActionChoice={setActionChoice!} 
            choicesHandled={choicesHandled} handleChoices={handleChoices} activeQuestion={activeQuestion} setActiveQuestion={setActiveQuestion} />,
          }}
        />

        <div className="sticky bottom-0 flex flex-col items-center justify-end flex-grow w-full max-w-2xl gap-4 pb-4 mt-4 rounded-t-lg bg-inherit">
          {!isHidden && (
            <div className="grid grid-cols-2 gap-2 w-full">
              {predefinedMessages &&
                predefinedMessages.length > 0 &&
                predefinedMessages.map((message, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center p-2 text-sm border rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 h-auto w-full text-center"
                    onClick={() => handlePredefinedMessages(message)}
                  >
                    {message}
                  </div>
                ))}
            </div>
          )}
          <Composer activeQuestion={activeQuestion} setIsHidden={setIsHidden} />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow basis-full">
      <CustomClassAvatar className="relative flex w-40 h-40 overflow-hidden rounded-full shrink-0">
        <AvatarImage src="/wolfie.png" alt="Wolfie" />
        <AvatarFallback>W</AvatarFallback>
      </CustomClassAvatar>
      <div className="flex justify-center items-center h-full">
        <p className="p-2 mt-4 text-2xl font-semibold text-gray-700 bg-gray-100 rounded-lg shadow-lg dark:text-gray-300 dark:bg-gray-800 text-center">
          Hi I'm Wolfie! How can I help you?
        </p>
      </div>
    </div>
  );
};

const Composer: FC<{ activeQuestion?: questions | string; setIsHidden: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  activeQuestion,
  setIsHidden,
}) => {
  const send = useComposerSend();
  const append = useAppendMessage();
  const [userMessage, setUserMessage] = useState("");

  const handleUserInput = (userInput: string) => {
    // send action is not available
    if (!send) return;
    append({
      content: [
        {
          text: getGenericMessagePrompt(activeQuestion, userInput),
          type: "text",
        },
        {
          text: userInput,
          type: "text",
        },
      ],
    });
  };

  return (
    <ComposerPrimitive.Root className="relative flex items-end w-full transition-shadow border rounded-lg focus-within:shadow-sm" asChild>
      <div
        onKeyDown={e => {
          if (e.key === "Enter") {
            handleUserInput(userMessage);
            setUserMessage("");
            setIsHidden(true);
          }
        }}
      >
        <ComposerPrimitive.Input
          autoFocus
          value={userMessage}
          onChange={e => setUserMessage(e.target.value)}
          placeholder="Write a message..."
          rows={1}
          className="p-4 pr-12 text-sm bg-transparent outline-none resize-none placeholder:text-muted-foreground size-full max-h-40"
        />
        <ComposerPrimitive.Send asChild>
          <Button variant="ghost" className="h-full hover:cursor-pointer hover:bg-primary-50" onClick={() => handleUserInput(userMessage)}>
            <SendHorizontalIcon className="text-primary-500" />
          </Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const CustomMessage: FC = () => {
  const {
    part: { text },
  } = useContentPartText();

  const isHidden = text.includes("---HIDDEN MESSAGE---");

  return <span>{isHidden ? "" : text}</span>;
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4">
      <div className="bg-muted text-foreground col-start-2 row-start-1 max-w-xl break-words rounded-3xl px-5 py-2.5">
        <MessagePrimitive.Content components={{ Text: CustomMessage }} />
      </div>
    </MessagePrimitive.Root>
  );
};

interface AssistantMessageProps {
  prompt: string;
  setActionChoice?: (choice: { action: string, choice: string }) => void;
  choicesHandled: string[];
  handleChoices: (choice: string) => void;
  activeQuestion?: questions | string;
  setActiveQuestion: React.Dispatch<React.SetStateAction<questions | string | undefined>>;
}

const AssistantMessage: FC<AssistantMessageProps> = ({ prompt, setActionChoice, choicesHandled, handleChoices, activeQuestion, setActiveQuestion }) => {
  console.log("In assistant message");

  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-2xl grid-cols-[auto_1fr] grid-rows-[auto_1fr] py-4">
      <Avatar className="col-start-1 row-start-1 mr-4 row-span-full">
        <AvatarImage src="/wolfie.png" alt="Wolfie" />
        <AvatarFallback>W</AvatarFallback>
      </Avatar>

      <div className="text-foreground col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7">
        <MessagePrimitive.Content components={{ Text: (props) => <MarkdownText {...props} prompt={prompt} setActionChoice={setActionChoice!} 
        choicesHandled={choicesHandled} handleChoices={handleChoices} activeQuestion={activeQuestion} setActiveQuestion={setActiveQuestion}
        /> }} />
      </div>
    </MessagePrimitive.Root>
  );
};
