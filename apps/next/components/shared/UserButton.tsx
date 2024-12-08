import { CircleUser, Clock4, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const UserButton = () => {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="border text-customIndigoDark">
          <AvatarFallback><CircleUser size={50} /></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl shadow-xl p-4 flex flex-col gap-4 w-[311px] border-2 border-gray-50 md:mr-8" sideOffset={20}>
        <div className="flex items-center gap-4">
          <Avatar className="border-2 border-gray-200 w-12 h-12">
            <AvatarFallback><CircleUser size={48} /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};