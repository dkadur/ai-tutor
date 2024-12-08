"use client";

import React, { use, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { MoreVertical, Keyboard, MessageCircleWarning } from "lucide-react";
import MathShortcutsPopup from "./MathShortcutsPopup";
import RWShortcutsPopup from "./RWShortcutsPopup";

interface MoreDropdownProps {
  isInMathSection: boolean | undefined;
}

export default function MoreDropdown({ isInMathSection }: MoreDropdownProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showShortcutsPopup, setShowShortcutsPopup] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button onClick={toggleMenu} className="flex flex-col items-center gap-1 p-2 w-20 rounded hover:bg-gray-200 active:bg-gray-300">
          <MoreVertical size={20} />
          <span className="text-sm">More</span>
        </button>
      </DropdownMenuTrigger>
      {menuOpen && (
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowShortcutsPopup(true)}>
            <Keyboard size={20} />&nbsp;Shortcuts
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
                        <MessageCircleWarning size={20} />&nbsp;Feedback
                    </DropdownMenuItem> */}
        </DropdownMenuContent>
      )}
      {showShortcutsPopup && (
        <React.Fragment>
          {isInMathSection ? (
            <MathShortcutsPopup
              isOpen={showShortcutsPopup}
              onClose={() => setShowShortcutsPopup(false)}
            />
          ) : (
            <RWShortcutsPopup
              isOpen={showShortcutsPopup}
              onClose={() => setShowShortcutsPopup(false)}
            />
          )}
        </React.Fragment>
      )}
    </DropdownMenu>
  );
};
