"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { CircleOff, Undo2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Markdown from "react-markdown";
import { ImperativePanelHandle } from "react-resizable-panels";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import z from "zod";

import { ExamContext } from "@/components/providers/ExamContext";
import AnswerSelect from "@/components/shared/AnswerSelect";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { userAnswerFormSchema } from "@/lib/form_schema";
import { sanitizeAnswer } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { sections_type } from "@prisma/client";
import { AssistantRuntimeProvider, useEdgeRuntime } from "@assistant-ui/react";
import { AiTutorPanel } from "@/components/ui/assistant-ui/assistant-modal";
import { questions } from "@prisma/client";
import { useControlContext } from "@/components/providers/ControlContext";
import { LetAICook } from "@/components/client/LetAICook";

interface RWFormProps {
  question: {
    question_id: number;
    text: string;
    passage: string | null;
    remarks: string | null;
    correct_answer: string;
  };
  action: (section_time_left: number, formData: FormData) => Promise<void>;
  choices: {
    text: string;
    value: string | null;
    image: string | null;
    isEliminated: boolean;
  }[];
  userAnswer: string | null | undefined;
  isExamOver: boolean;
  isExamReal: boolean;
  sectionType: sections_type;
  ogLocQuestion: questions;
}

function isValidMathExpression(expression: string): boolean {
  const isNumber = (str: string): boolean => !isNaN(Number(str));
  const isOperator = (char: string): boolean => ["/"].includes(char);

  const validate = (expr: string): boolean => {
    expr = expr.replace(/\s+/g, "");
    if (isNumber(expr)) {
      return true;
    }

    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];
      if (isOperator(char)) {
        const left = expr.slice(0, i);
        const right = expr.slice(i + 1);
        if (left && right && validate(left) && validate(right)) {
          return true;
        }
      }
    }
    return false;
  };

  return validate(expression);
}

export function ExamForm({
  question,
  action,
  choices,
  userAnswer,
  isExamOver,
  isExamReal,
  sectionType,
  ogLocQuestion,
}: RWFormProps) {
  const outerPanelRef = useRef<ImperativePanelHandle>(null);
  const innerPanelRef = useRef<ImperativePanelHandle>(null);


  const { outerPanelSize, setOuterPanelSize, innerPanelSize, setInnerPanelSize, isCrossOutEnabled, setIsCrossOutEnabled } = useContext(ExamContext);

  const { isAIControlling, setIsAIControlling, modelObject, setModelObject } = useControlContext();

  const [, setIsLoading] = useState(false);
  const [showCorrectAnswer,] = useState(false);
  const params = useParams();
  const { exam_id, attempt_id, section_id } = params as { [key: string]: string };
  const isMath = sectionType === "math";
  const isFreeResponse = choices.filter(choice => choice.value).length === 0;

  const [eliminatedChoices, setEliminatedChoices] = useState<{
    [key: string]: { isEliminated: boolean; eliminatedByAI: boolean };
  }>(
    choices.reduce((acc, choice) => {
      acc[choice.text] = {
        isEliminated: choice.isEliminated,
        eliminatedByAI: false // Default to false
      };
      return acc;
    }, {} as { [key: string]: { isEliminated: boolean; eliminatedByAI: boolean } }),
  );


  const handleEliminatedChoices = (choiceText: string, eliminatedByAI: boolean = false) => {
    setEliminatedChoices((prevChoices) => {
      const updatedChoices = {
        ...prevChoices,
        [choiceText]: {
          isEliminated: !prevChoices[choiceText].isEliminated,
          eliminatedByAI: eliminatedByAI,
        },
      };

      // If the eliminated choice matches the current answer, reset the answer
      if (answer === choiceText) {
        updatedChoices[choiceText].isEliminated = true;
        updatedChoices[choiceText].eliminatedByAI = eliminatedByAI;
        setAnswer(null);
        handleSubmit({ answer: "" });
      }

      return updatedChoices;
    });
  };


  const [answer, setAnswer] = useState(userAnswer);

  const checkSetAnswer = (choiceText: string) => {
    if (choiceText == "" || !eliminatedChoices[choiceText].isEliminated) {
      setAnswer(choiceText);
    }
  };

  const form = useForm<z.infer<typeof userAnswerFormSchema>>({
    resolver: zodResolver(userAnswerFormSchema),
    defaultValues: {
      answer: "",
    },
  });

  useEffect(() => {
    if (isExamOver) setIsCrossOutEnabled(false);
    if (isExamOver || !isExamReal) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handleUnload = async () => {
      if (!isExamOver) {
        navigator.sendBeacon(
          `/api/exam/${exam_id}/${attempt_id}/${section_id}/invalidate-attempt`,
          JSON.stringify({ exam_id, attempt_id, section_id }),
        );
      }
    };

    const handleOnload = () => {
      setIsLoading(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    window.addEventListener("onload", handleOnload);
    return () => {
      window.removeEventListener("unload", handleUnload);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("onload", handleOnload);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isInputFocused = document.activeElement?.tagName === "INPUT";

      if (isFreeResponse && isInputFocused && event.key === "Enter") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleSubmit(values: z.infer<typeof userAnswerFormSchema>) {
    setIsLoading(true);
    let data = Boolean(values.answer) ? values.answer : "";

    if ((isFreeResponse && isValidMathExpression(data)) || !isFreeResponse) {
      const formData = new FormData();
      formData.append("answer", data);
      checkSetAnswer(data);

      const submitQuestionWithAdditionalArgs = action.bind(null, 0);
      submitQuestionWithAdditionalArgs(formData)
        .then(() => {
          setIsLoading(false);
        })
        .catch((e: Error) => {
          console.error(e);
        });
    } else {
      setIsLoading(false);
    }
  }

  function useDebouncedSubmit(delay: number) {
    const [timer, setTimer] = useState<Timer | null>(null);
    const debouncedSubmit = useCallback(() => {
      if (timer) clearTimeout(timer);

      const newTimer = setTimeout(() => {
        handleSubmit(form.getValues());
      }, delay);

      setTimer(newTimer);
    }, [handleSubmit]);

    return debouncedSubmit;
  }

  const debouncedSubmit = useDebouncedSubmit(200);

  const runtime = useEdgeRuntime({
    api: `/api/chat?provider=${modelObject.provider}&modelName=${modelObject.model}`,
    initialMessages: [
      {
        role: "system",
        content: [
          {
            text: "Welcome to the chat!",
            type: "text",
          },
        ],
      },
    ],
  });

  const performAction = (action: string, choice: string = "a") => {
    if (action === "CROSSOUT") {
      handleEliminatedChoices(choice, true);
    } else if (action === "SELECT") {
      checkSetAnswer(choice);
    } else if (action === "TRANSFER") {
      console.log(`Transferring control to ${isAIControlling ? "user" : "AI"}.`);
      setIsAIControlling(!isAIControlling);
    }
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="p-4 bg-white rounded-2xl md:block md:h-full">
        <ResizablePanelGroup
          onLayout={e => {
            setOuterPanelSize(outerPanelRef.current?.getSize() || 60);
          }}
          direction="horizontal"
        >
          <ResizablePanel minSize={55} defaultSize={outerPanelSize} ref={outerPanelRef} className="h-full !overflow-y-auto"
          >
            <section className="h-full rounded-tl-2xl rounded-bl-2xl bg-white py-2 pl-2">
              <ResizablePanelGroup
                onLayout={e => {
                  setInnerPanelSize(innerPanelRef.current?.getSize() || 40);
                }}
                direction="vertical"
              >
                <ResizablePanel minSize={20} defaultSize={innerPanelSize} ref={innerPanelRef} className="h-full !overflow-y-auto">
                  <article className="pr-6">
                    {isMath ? (
                      <div className="flex flex-col items-start w-full gap-3">
                        <div className="flex items-center justify-between w-full">
                          <h1 className="text-2xl font-bold">Question </h1>
                        </div>
                        <Markdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex, rehypeRaw]}
                          className="text-lg [&>p>img]:w-7/12 [&>p>img]:my-4 w-full leading-10 text-primary-600"
                        >
                          {question!.text.replaceAll("`", "")}
                        </Markdown>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start w-full gap-1">
                        <div className="flex items-center justify-between w-full">
                          <h1 className="text-xl font-bold">Passage</h1>
                        </div>
                        <Markdown
                          className="mt-2 [&>ul]:list-disc [&>ul>li]:ml-6 [&>ul>li]:mb-2 [&>ol]:list-disc [&>ol>li]:ml-6 [&>ol>li]:mb-2 leading-8 text-secondary-400"
                          rehypePlugins={[rehypeRaw]}
                        >
                          {question.passage}
                        </Markdown>
                      </div>
                    )}
                  </article>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                  minSize={30}
                  defaultSize={100 - innerPanelSize}
                  className={`h-full ${isAIControlling ? "overflow-hidden" : "!overflow-y-auto"} relative`}
                >
                  {isAIControlling && (
                    // The exam-form is disbaled within this section
                    <LetAICook />
                  )}
                  <section className="flex flex-col items-start gap-4 px-4 pt-4">
                    {!isMath && <h3 className="text-xl font-semibold">{question!.text}</h3>}
                    <Form {...form}>
                      <form
                        className="flex flex-col w-full gap-12"
                        onChange={form.handleSubmit(() => {
                          if (isFreeResponse) {
                            if (/[^0-9./-]/g.test(form.getValues().answer)) {
                              return;
                            }
                            setAnswer(form.getValues().answer);
                            debouncedSubmit();
                          } else {
                            handleSubmit(form.getValues());
                          }
                        })}
                      >
                        <FormField
                          control={form.control}
                          name="answer"
                          render={({ field }) => (
                            <FormItem>
                              {isFreeResponse ? (
                                <div className="flex flex-col w-full gap-4">
                                  <h1 className="text-xl font-bold">Type in your answer</h1>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="text"
                                      name="answer"
                                      id="answer"
                                      value={answer || ""}
                                      maxLength={5}
                                      disabled={isExamOver}
                                      autoComplete="off"
                                      className="w-11/12 p-4 bg-gray-50"
                                    />
                                  </FormControl>
                                  {answer && (
                                    <div className="pt-4">
                                      <h1 className="flex gap-2">
                                        <b>Answer Preview:</b>
                                        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]} className="text-xl">
                                          {answer.includes("/") ? `$\\frac{${answer.split("/")[0]}}{${answer.split("/")[1]}}$` : answer}
                                        </Markdown>
                                      </h1>
                                    </div>
                                  )}
                                  {showCorrectAnswer && <p className="text-secondary-500">Correct Answer: {sanitizeAnswer(question.correct_answer)}</p>}
                                </div>
                              ) : (
                                <ul className="flex flex-col gap-3 list-none">
                                  {isMath && <h3 className="mb-4 text-xl font-bold">Select the correct answer</h3>}
                                  {choices.map(choice => (
                                    <div className="flex flex-row items-center gap-4" key={choice.text}>
                                      <AnswerSelect
                                        isExamOver={isExamOver}
                                        choice={choice}
                                        key={choice.text}
                                        userAnswer={answer}
                                        field={field}
                                        showCorrectAnswer={showCorrectAnswer}
                                        correctAnswer={question.correct_answer}
                                        isEliminated={eliminatedChoices[choice.text]?.isEliminated && answer !== choice.text}
                                      />
                                      {isCrossOutEnabled && (
                                        <div
                                          className={`w-[20px] h-[20px] ${!eliminatedChoices[choice.text]?.eliminatedByAI ? "hover:cursor-pointer" : "hover:cursor-default"}`}
                                          onClick={() =>
                                            !eliminatedChoices[choice.text]?.eliminatedByAI && handleEliminatedChoices(choice.text)
                                          }
                                        >
                                          {eliminatedChoices[choice.text]?.isEliminated &&
                                            !eliminatedChoices[choice.text]?.eliminatedByAI &&
                                            answer !== choice.text ? (
                                            <Undo2 className="text-red-500" size={20} />
                                          ) : (
                                            <CircleOff
                                              className={`text-gray-500`}
                                              size={20}
                                              fill={"white"}
                                              style={{
                                                visibility: eliminatedChoices[choice.text]?.eliminatedByAI ? "hidden" : "visible",
                                              }}
                                            />
                                          )}
                                        </div>
                                      )}

                                    </div>
                                  ))}
                                </ul>
                              )}
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </section>
                </ResizablePanel>
              </ResizablePanelGroup>
            </section>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30} defaultSize={100 - outerPanelSize} className="h-full !overflow-y-auto">
            <section className="h-full">
              <AiTutorPanel
                predefinedMessages={["Walk me through this question", "Help me understand this question", "Give me a similar question",
                  "Break down the question into smaller parts",
                ]}
                currentQuestion={ogLocQuestion}
                performAction={performAction}
                setIsAIControlling={setIsAIControlling}
                eliminatedChoices={eliminatedChoices}
              />
            </section>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AssistantRuntimeProvider>
  );
}
