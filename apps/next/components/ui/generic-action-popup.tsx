"use client";

import React from "react";

import { GripHorizontal, X } from "lucide-react";
import { Rnd } from "react-rnd";

export default function GenericActionPopup({
  title,
  initialWidth,
  initialHeight,
  enableResizing,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  setWidth,
  setHeight,
  ratio,
  keepRatio,
  handleClose,
  x,
  setX,
  y,
  setY,
  bounds = ".exam-section",
  children,
}: {
  title: string;
  initialWidth: number;
  initialHeight: number;
  enableResizing:
    | {
        bottom: boolean;
        bottomLeft: boolean;
        bottomRight: boolean;
        left: boolean;
        right: boolean;
        top: boolean;
        topLeft: boolean;
        topRight: boolean;
      }
    | boolean;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  x: number;
  y: number;
  setX: React.Dispatch<React.SetStateAction<number>>;
  setY: React.Dispatch<React.SetStateAction<number>>;
  handleClose: () => void;
  keepRatio?: boolean;
  ratio?: number;
  bounds?: string;
  children: React.ReactNode;
}) {
  // Sometimes resizing on the wrong ratio causes the popup to be too small, so we add a 20px adjustment to the height
  const RATIO_ADJUSTMENT = 20;

  return (
    <div className="absolute">
      <Rnd
        className="z-20 flex items-center justify-center bg-white border-2 border-black"
        position={{ x: x, y: y }}
        enableResizing={enableResizing}
        dragHandleClassName="draghandle"
        size={{ width: initialWidth, height: initialHeight }}
        onDrag={(e, d) => {
          setX(d.x);
          setY(d.y);
        }}
        onResize={(e, direction, ref, delta, position) => {
          if (keepRatio && ratio) {
            if (direction === "left" || direction === "right") {
              setWidth(parseInt(ref.style.width));
              setHeight(parseInt(ref.style.width) / ratio + RATIO_ADJUSTMENT);
            }
            if (direction === "top" || direction === "bottom") {
              setWidth(parseInt(ref.style.height) * ratio - RATIO_ADJUSTMENT);
              setHeight(parseInt(ref.style.height));
            }
          } else {
            setWidth(parseInt(ref.style.width));
            setHeight(parseInt(ref.style.height));
          }

          setX(position.x);
          setY(position.y);
        }}
        minWidth={minWidth}
        minHeight={minHeight}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        bounds={bounds}
      >
        <div className="bg-black text-white text-sm font-semibold grid grid-cols-3 w-full h-[60px] text-start p-4">
          <div className="text-nowrap">{title}</div>
          <GripHorizontal className="mx-auto cursor-move draghandle" />
          <X className="ml-auto cursor-pointer" onClick={handleClose} />
        </div>
        {children}
      </Rnd>
    </div>
  );
}
