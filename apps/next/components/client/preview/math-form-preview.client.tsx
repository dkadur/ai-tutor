"use client";

import 'katex/dist/katex.min.css';

import { useState } from 'react';

import { Bookmark, CircleOff, Undo2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import z from 'zod';

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { zodResolver } from '@hookform/resolvers/zod';
import AnswerSelectPreview from './answer-select-preview.client';

interface MathFormProps {
  question: {
    text: string;
  }
  choices: {
    text: string;
    value: string;
    isEliminated: boolean;
  }[];
  questionNumber?: number;
  displayCorrectAnswer?: boolean;
  correctAnswer?: string;
  correctAnswerExplanation?: string;
}

export const dynamic = 'force-dynamic';

export default function MathFormPreview({
  question,
  choices,
  questionNumber,
  displayCorrectAnswer = false,
  correctAnswer,
  correctAnswerExplanation,
}: MathFormProps) {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const userAnswerPreviewFormSchema = z.object({
    answer: z.string().max(5, "A maximum of 5 characters allowed"),
  });
  const form = useForm<z.infer<typeof userAnswerPreviewFormSchema>>({
    resolver: zodResolver(userAnswerPreviewFormSchema),
    defaultValues: {
      answer: "",
    },
  });


  const [answer, setAnswer] = useState("");
  const checkSetAnswer = (choiceText: string) => {
    if (!eliminatedChoices[choiceText]) {
      setAnswer(choiceText);
    }
  };

  const [reviewMarked, setReviewMarked] = useState(false);
  const toggleReviewMarked = () => {
    setReviewMarked(!reviewMarked);
  };

  const [isCrossOutEnabled, setIsCrossOutEnabled] = useState(true);
  const toggleCrossout = () => {
    setIsCrossOutEnabled(!isCrossOutEnabled);
  };

  const [eliminatedChoices, setEliminatedChoices] = useState<{ [key: string]: boolean }>(
    choices.reduce((acc, choice) => {
      acc[choice.text] = choice.isEliminated;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const handleEliminatedChoices = (choiceText: string) => {
    setEliminatedChoices((prevChoices) => {
      const updatedChoices = {
        ...prevChoices,
        [choiceText]: !prevChoices[choiceText],
      };

      if (answer === choiceText) {
        updatedChoices[choiceText] = true;
        handleSubmit({ answer: "" });
      }

      return updatedChoices;
    });
  };

  function handleSubmit(values: z.infer<typeof userAnswerPreviewFormSchema>) {
    const data = Boolean(values.answer) ? values.answer : "";
    checkSetAnswer(data);
  }

  const isFreeResponse = choices.filter(choice => choice.value).length === 0;
  return (
    <>
      <Form {...form}>
        <form
          onChange={form.handleSubmit(() => handleSubmit(form.getValues()))}
          className="flex flex-col gap-4 border w-1/2 mx-auto my-6 items-center"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="bg-gray-50 w-full p-2 flex items-center gap-4 border-b">
                  <div className="bg-gray-800 text-white font-semibold w-6 text-center">{questionNumber}</div>
                  <span className="flex items-center gap-1">
                    <Bookmark
                      className="cursor-pointer"
                      size={24}
                      onClick={toggleReviewMarked}
                      fill={reviewMarked ? "red" : "white"}
                    />
                    <p>Mark for review</p>
                  </span>
                  {!isFreeResponse &&
                    <>
                      <div className="h-6 border-r border-gray-400 mx-2"></div>
                      <span className="flex items-center gap-1">
                        <CircleOff
                          className="cursor-pointer"
                          size={20}
                          onClick={toggleCrossout}
                          fill={isCrossOutEnabled ? "#3d53a5" : "white"}
                        />
                        <p>Enable cross-out</p>
                      </span>
                    </>}
                </div>

                <div className="flex flex-col gap-12 items-center px-4 pb-12">
                  <Markdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                    className="text-lg"
                  >
                    {question!.text.replaceAll("`", "")}
                  </Markdown>

                  {!isFreeResponse ?
                    <ul className="list-none w-full flex flex-col gap-2">
                      {choices.map(choice => (
                        <div className="flex flex-row items-center gap-4" key={choice.text}>
                          <AnswerSelectPreview
                            key={choice.text}
                            choice={choice}
                            userAnswer={answer}
                            field={field}
                            isEliminated={eliminatedChoices[choice.text] && answer !== choice.text}
                            showCorrectAnswer={showCorrectAnswer}
                            correctAnswer={correctAnswer}
                          />
                          {isCrossOutEnabled && (
                            <div
                              className={`hover:cursor-pointer`}
                              onClick={() => handleEliminatedChoices(choice.text)}
                            >
                              {eliminatedChoices[choice.text] && answer !== choice.text ? (
                                <Undo2 className="text-red-500" size={20} />
                              ) : (
                                <CircleOff className="text-gray-500" size={20} fill={"white"} />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </ul>
                    :
                    <div className="flex flex-col w-full gap-2">
                      <FormLabel htmlFor="answer" className="px-2 text-md text-gray-800 flex gap-2 items-center">
                        Answer:
                        {showCorrectAnswer && <Markdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex, rehypeRaw]}
                          className="text-lg"
                        >
                          {correctAnswer?.replaceAll("`", "")}
                        </Markdown>}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          name="answer"
                          id="answer"
                          maxLength={5} />
                      </FormControl>
                    </div>
                  }
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
      {displayCorrectAnswer && (
        <div className="flex items-center gap-2 p-4">
          <Switch name="showCorrectAnswer" id="showCorrectAnswer" checked={showCorrectAnswer} onCheckedChange={() => setShowCorrectAnswer(!showCorrectAnswer)} />
          <Label htmlFor="showCorrectAnswer">Show correct answer</Label>
        </div>
      )}
      {displayCorrectAnswer && (
        <Accordion type="multiple" className="p-4">
          <AccordionItem value="1">
            <AccordionTrigger className="p-0">
              Question explanation
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-gray-600">
                <Markdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeRaw]}
                  className="text-lg"
                >
                  {correctAnswerExplanation?.replaceAll("`", "")}
                </Markdown>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
};