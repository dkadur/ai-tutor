import prisma from '@/lib/prisma';
import { ExamType } from '@wolfietutor/types';
import { tags } from '@prisma/client';

export const getAllTags = async (examType: ExamType) => {
  try {
    const tags = await prisma.tags.findMany({
      where: {
        exam_type: examType,
        question_tags: {
          some: {
            questions: {
              NOT: {
                exam_id: {
                  not: null,
                },
              }
            },
          },
        },
      },
    });

    const categories = await prisma.categories.findMany({
      where: {
        exam_type: examType,
      },
    });

    const subCategories = await prisma.sub_categories.findMany({
      where: {
        exam_type: examType,
      },
      include: {
        categories: true,
      }
    });

    const tagsBySubCategoryAndCategory = new Map<string, { [key: string]: tags[] }>();

    categories.forEach((category) => {
      const subCategoriesByCategory = subCategories.filter((subCategory) => subCategory.categories.category_id === category.category_id);

      const tagsInSubCategory = new Map<string, tags[]>();
      subCategoriesByCategory.forEach((subCategory) => {
        const tagsBySubcategory = tags.filter((tag) => tag.sub_category_id === subCategory.sub_category_id);
        if (tagsBySubcategory.length > 0) {
          tagsInSubCategory.set(subCategory.fullName, tagsBySubcategory);
        }
      });
      tagsBySubCategoryAndCategory.set(category.fullName!, Object.fromEntries(tagsInSubCategory));
    });
    return Object.fromEntries(tagsBySubCategoryAndCategory);
  } catch (error) {
    throw new Error("Failed to fetch tags from the database.");
  }
};

export type Tag = Awaited<ReturnType<typeof getAllTags>>;