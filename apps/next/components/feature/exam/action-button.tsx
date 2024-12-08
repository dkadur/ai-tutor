import clsx from "clsx";
import { icons } from "lucide-react";

export const ActionButton = ({
  icon,
  parentClassName,
  ...props
}: { icon: keyof typeof icons; parentClassName?: string } & React.ComponentPropsWithoutRef<"div">) => {
  const LucideIcon = icons[icon];

  return (
    <div
      {...props}
      className={clsx("flex cursor-pointer bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 active:bg-gray-300 p-3", parentClassName)}
    >
      <LucideIcon className={clsx("text-gray-700", props.className)} size={20} />
    </div>
  );
};
