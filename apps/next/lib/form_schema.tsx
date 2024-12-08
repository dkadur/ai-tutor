import z from "zod";

export const userAnswerFormSchema = z.object({
    answer: z.string().max(5, "A maximum of 5 characters allowed"),
});
