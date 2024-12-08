import prisma from "@/lib/prisma";

export const getExamReviewData = async (attempt_id: string) => {
  try {
    const attempt = await prisma.exam_attempts.findFirst({
      where: {
        attempt_id: parseInt(attempt_id),
      },
      include: {
        exams: true,
        users: true
      },
    });

    const studentName = attempt?.users.name;

    const exam_attempt_sections = await prisma.exam_attempt_sections.findMany({
      where: {
        attempt_id: attempt?.attempt_id,
      },
      orderBy: {
        section_order: "asc",
      },
    });

    const firstSection = exam_attempt_sections.find((section) => section.section_order === 1);

    const questions = await prisma.exam_attempt_questions.findMany({
      where: {
        attempt_id: attempt?.attempt_id,
      },
      include: {
        question: {
          include: {
            question_tags: {
              include: {
                tags: {
                  select: {
                    name: true,
                  }
                },
              },
            },
            sub_categories: { select: { fullName: true } },
          },
        },
        sections: true,
      },
      orderBy: [
        {
          section_id: "asc",
        },
        {
          question_number: "asc",
        },
      ],
    });

    const totalQuestions = await prisma.exam_attempt_questions.groupBy({
      by: ['question_id'],
      _count: {
        _all: true,
      },
      where: {
        question_id: {
          in: questions.map((question: any) => question.question_id),
        }
      },
      orderBy: {
        question_id: "asc",
      }
    });

    const correctQuestions = await prisma.exam_attempt_questions.groupBy({
      by: ['question_id'],
      _count: {
        _all: true,
      },
      where: {
        is_correct: true,
        question_id: {
          in: questions.map((question: any) => question.question_id),
        },
      },
      orderBy: {
        question_id: "asc",
      }
    });

    const percentageMap = new Map();

    for (const item of totalQuestions) {
      const correct = correctQuestions.find((question) => question.question_id === item.question_id);
      const question = questions.find((question) => question.question_id === item.question_id);
      percentageMap.set(question?.question_id, (correct?._count._all || 0) / (item._count._all) * 100);
    }

    const sectionOrderMap: { [key: string]: number } =
      exam_attempt_sections.reduce((map, section, index) => {
        map[section.section_id] = index;
        return map;
      }, {} as { [key: string]: number });

    const sortedQuestionsBySectionOrder = questions.sort((a, b) => {
      const sectionOrderA = sectionOrderMap[a.section_id];
      const sectionOrderB = sectionOrderMap[b.section_id];

      // If section orders are the same, sort by question number
      if (sectionOrderA === sectionOrderB) {
        return a.question_number - b.question_number;
      }

      // Otherwise, sort by section order
      return sectionOrderA - sectionOrderB;
    });

    // Group questions by section name
    const groupedQuestionsBySections = sortedQuestionsBySectionOrder.reduce<{
      [sectionName: string]: typeof questions;
    }>((acc, curr) => {
      const sectionName = curr.sections!.name;
      if (!acc[sectionName]) {
        acc[sectionName] = [];
      }
      acc[sectionName].push(curr);
      return acc;
    }, {});

    const [categories, sections, subCategories, questionTags] =
      await Promise.all([
        prisma.categories.findMany({
          where: {
            exam_type: attempt?.exams.exam_type
          }
        }),
        prisma.sections.findMany({
          where: {
            exam_type: attempt?.exams.exam_type
          }
        }),
        prisma.sub_categories.findMany({
          where: {
            exam_type: attempt?.exams.exam_type
          }
        }),
        prisma.question_tags.findMany({
          where: {
            question_id: {
              in: questions.map((question: any) => question.question_id),
            },
          },
          include: {
            tags: true,
          },
        }),
      ]);

    // Create maps for quick lookups
    const sectionMap = new Map(
      sections.map((section) => [section.section_id, section.name])
    );
    const subCategoryMap = new Map(
      subCategories.map((subCategory) => [
        subCategory.sub_category_id,
        subCategory,
      ])
    );
    const questionTagMap = new Map();
    questionTags.forEach((questionTag) => {
      if (!questionTagMap.has(questionTag.question_id)) {
        questionTagMap.set(questionTag.question_id, []);
      }
      questionTagMap.get(questionTag.question_id).push(questionTag.tags);
    });

    const dataset = new Map();
    const questionsData = new Map();
    const sectionDataMapping = new Map();

    categories.forEach((category) => {
      dataset.set(category.category_id, []);
      questionsData.set(category.category_id, []);
    });

    sections.forEach((section) => {
      sectionDataMapping.set(section.section_id, []);
    });

    questions.forEach((question) => {
      const subCategory = subCategoryMap.get(
        question.question.sub_category_id
      )!;

      // Add question data to question list
      const questionData = {
        ...question,
        subCategoryName: subCategory.fullName,
        sectionName: sectionMap.get(question.question.section_id!),
        tags: questionTagMap.get(question.question_id) || [],
        percentageCorrect: percentageMap.get(question.question.question_id),
      };
      let subCategoryQuestionsList = questionsData.get(subCategory.category_id);
      subCategoryQuestionsList.push(questionData);

      const sectionData = sectionDataMapping.get(question.section_id);
      sectionData.push(questionData);

      // If the user have not answer the questions, skip adding to the dataset
      if (question.is_answered === false) return;

      const categoryDataset = dataset.get(subCategory.category_id);

      // Add tag data to the dataset
      const questionTags = questionTagMap.get(question.question_id) || [];
      questionTags.forEach((tag: any) => {
        let tagData = categoryDataset.find((data: any) => data.id === tag.name);
        if (!tagData) {
          tagData = {
            id: tag.name,
            subCategory_id: subCategory.sub_category_id,
            type: "tag",
            tag_id: tag.tag_id,
            label: tag.name,
            questionsTotal: 0,
            "Correct Questions": 0,
            "Correct QuestionsColor": "hsl(120, 70%, 50%)",
            "Incorrect Questions": 0,
            "Incorrect QuestionsColor": "hsl(0, 70%, 50%)",
          };
          categoryDataset.push(tagData);
        }
        tagData.questionsTotal++;
        if (question.is_correct) {
          tagData["Correct Questions"]++;
        } else {
          tagData["Incorrect Questions"]++;
        }
      });
    });

    // Sort and organize data
    categories.forEach((category) => {
      const categoryQuestionsList = questionsData.get(category.category_id);
      // Sort questions by section id and question order
      categoryQuestionsList.sort((a: any, b: any) => {
        if (a.question.section_id === b.question.section_id) {
          return a.question.question_order - b.question.question_order;
        }
        return a.question.section_id - b.question.section_id;
      });

      const categoryDataset = dataset.get(category.category_id);
      // Sort subcategories by subcategory name
      categoryDataset.sort((a: any, b: any) => {
        return a.subCategory_id - b.subCategory_id;
      });
    });

    const timeTaken =
      attempt?.end_time && attempt?.start_time
        ? Math.round(
          (Number(attempt.end_time) - Number(attempt.start_time)) / 1000 / 60
        )
        : 0;

    return {
      attempt,
      categories,
      questions,
      groupedQuestionsBySections,
      questionsData,
      dataset,
      timeTaken,
      sectionDataMapping,
      studentName,
      firstSection,
    };
  } catch (error) {
    throw new Error("Failed to fetch exam review data." + error);
  }
};

export type ExamAttemptReviewData = Awaited<
  ReturnType<typeof getExamReviewData>
>;