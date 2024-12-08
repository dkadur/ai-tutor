"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exams, sections } from "@prisma/client";
import { useRouter } from 'nextjs-toploader/app';

export const SectionsSort = ({
  sections,
  exam,
  searchParams,
  onSelect
}: {
  sections: sections[],
  exam: exams,
  searchParams: { section_id: string },
  onSelect: () => void
}) => {
  const router = useRouter();

  const params = new URLSearchParams(searchParams);

  return (
    <Select
      defaultValue={params.get("section_id") || ""}
      onValueChange={(value) => {
        if (value && value !== "all") {
          params.set("section_id", value);
        } else {
          params.delete("section_id");
        }

        onSelect();

        router.push(`/admin/exams/edit/${exam.exam_id}?${params.toString()}`);
      }}>
      <label>Sort By Section</label>
      <SelectTrigger>
        <SelectValue placeholder="Select section" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all" defaultChecked>All sections</SelectItem>
        {sections && sections.map((section, index) => {
          return (
            <SelectItem key={index} value={section.section_id.toString()}>
              {section.name + (section.difficulty_level === 'hard' ? ' (Hard)' : '')}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}