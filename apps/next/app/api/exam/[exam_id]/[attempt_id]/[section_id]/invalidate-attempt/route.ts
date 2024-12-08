import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: { exam_id: string, attempt_id: string, section_id: string } }
) {
  const { exam_id, attempt_id, section_id } = params;
  try {
    await prisma.exam_attempts.update({
      where: {
        attempt_id: parseInt(attempt_id),
      },
      data: {
        is_real: false,
      },
    });

    revalidatePath(`/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/question/`);
    return Response.json("Exam Attempt Invalidated");
  } catch (error) {
    return Response.json("Unknown Error");
  }
}
