"use client";

import React, { createContext, useState } from 'react';

const INITIAL_CALCULATOR_POPUP_POS_X = -500;
const INITIAL_CALCULATOR_POPUP_POS_Y = 0;
const INITIAL_CALCULATOR_POPUP_WIDTH = 450;
const INITIAL_CALCULATOR_POPUP_HEIGHT = 410;

const INITIAL_GRAPH_POPUP_POS_X = -500;
const INITIAL_GRAPH_POPUP_POS_Y = 0;
const INITIAL_GRAPH_POPUP_WIDTH = 600;
const INITIAL_GRAPH_POPUP_HEIGHT = 500;

const INITIAL_MATH_REFERENCE_SHEET_POPUP_POS_X = -500;
const INITIAL_MATH_REFERENCE_SHEET_POPUP_POS_Y = 0;
const INITIAL_MATH_REFERENCE_SHEET_POPUP_WIDTH = 17 * 30;
const INITIAL_MATH_REFERENCE_SHEET_POPUP_HEIGHT = 24 * 30;

const ExamContext = createContext({
  // AI Tutor
  outerPanelSize: 60,
  innerPanelSize: 40,
  setOuterPanelSize: (size: number) => { },
  setInnerPanelSize: (size: number) => { },

  panelSize: 50,
  setPanelSize: (size: number) => { },

  isCrossOutEnabled: true,
  setIsCrossOutEnabled: (isCrossOutEnabled: boolean) => { },

  showCalculatorPopup: false,
  setShowCalculatorPopup: (isOpen: boolean) => { },
  calculatorPopupPosX: INITIAL_CALCULATOR_POPUP_POS_X,
  setCalculatorPopupPosX: (posX: number) => { },
  calculatorPopupPosY: INITIAL_CALCULATOR_POPUP_POS_Y,
  setCalculatorPopupPosY: (posY: number) => { },
  calculatorPopupWidth: INITIAL_CALCULATOR_POPUP_WIDTH,
  setCalculatorPopupWidth: (width: number) => { },
  calculatorPopupHeight: INITIAL_CALCULATOR_POPUP_HEIGHT,
  setCalculatorPopupHeight: (height: number) => { },

  showGraphPopup: false,
  setShowGraphPopup: (isOpen: boolean) => { },
  graphPopupPosX: INITIAL_GRAPH_POPUP_POS_X,
  setGraphPopupPosX: (posX: number) => { },
  graphPopupPosY: INITIAL_GRAPH_POPUP_POS_Y,
  setGraphPopupPosY: (posY: number) => { },
  graphPopupWidth: INITIAL_GRAPH_POPUP_WIDTH,
  setGraphPopupWidth: (width: number) => { },
  graphPopupHeight: INITIAL_GRAPH_POPUP_HEIGHT,
  setGraphPopupHeight: (height: number) => { },

  showMathReferenceSheetPopup: false,
  setShowMathReferenceSheetPopup: (isOpen: boolean) => { },
  mathReferenceSheetPopupPosX: INITIAL_MATH_REFERENCE_SHEET_POPUP_POS_X,
  setMathReferenceSheetPopupPosX: (posX: number) => { },
  mathReferenceSheetPopupPosY: INITIAL_MATH_REFERENCE_SHEET_POPUP_POS_Y,
  setMathReferenceSheetPopupPosY: (posY: number) => { },
  mathReferenceSheetPopupWidth: INITIAL_MATH_REFERENCE_SHEET_POPUP_WIDTH,
  setMathReferenceSheetPopupWidth: (width: number) => { },
  mathReferenceSheetPopupHeight: INITIAL_MATH_REFERENCE_SHEET_POPUP_HEIGHT,
  setMathReferenceSheetPopupHeight: (height: number) => { },
});

const ExamProvider = ({ children }: { children: React.ReactNode }) => {
  const [outerPanelSize, setOuterPanelSize] = useState(60);
  const [innerPanelSize, setInnerPanelSize] = useState(40);

  const [panelSize, setPanelSize] = useState(50);
  const [isCrossOutEnabled, setIsCrossOutEnabled] = useState(true);

  const [showCalculatorPopup, setShowCalculatorPopup] = useState(false);
  const [calculatorPopupPosX, setCalculatorPopupPosX] = useState(INITIAL_CALCULATOR_POPUP_POS_X);
  const [calculatorPopupPosY, setCalculatorPopupPosY] = useState(INITIAL_CALCULATOR_POPUP_POS_Y);
  const [calculatorPopupWidth, setCalculatorPopupWidth] = useState(INITIAL_CALCULATOR_POPUP_WIDTH);
  const [calculatorPopupHeight, setCalculatorPopupHeight] = useState(INITIAL_CALCULATOR_POPUP_HEIGHT);

  const [showGraphPopup, setShowGraphPopup] = useState(false);
  const [graphPopupPosX, setGraphPopupPosX] = useState(INITIAL_GRAPH_POPUP_POS_X);
  const [graphPopupPosY, setGraphPopupPosY] = useState(INITIAL_GRAPH_POPUP_POS_Y);
  const [graphPopupWidth, setGraphPopupWidth] = useState(INITIAL_GRAPH_POPUP_WIDTH);
  const [graphPopupHeight, setGraphPopupHeight] = useState(INITIAL_GRAPH_POPUP_HEIGHT);

  const [showMathReferenceSheetPopup, setShowMathReferenceSheetPopup] = useState(false);
  const [mathReferenceSheetPopupPosX, setMathReferenceSheetPopupPosX] = useState(INITIAL_MATH_REFERENCE_SHEET_POPUP_POS_X);
  const [mathReferenceSheetPopupPosY, setMathReferenceSheetPopupPosY] = useState(INITIAL_MATH_REFERENCE_SHEET_POPUP_POS_Y);
  const [mathReferenceSheetPopupWidth, setMathReferenceSheetPopupWidth] = useState(INITIAL_MATH_REFERENCE_SHEET_POPUP_WIDTH);
  const [mathReferenceSheetPopupHeight, setMathReferenceSheetPopupHeight] = useState(INITIAL_MATH_REFERENCE_SHEET_POPUP_HEIGHT);

  const value = {
    outerPanelSize, setOuterPanelSize,
    innerPanelSize, setInnerPanelSize,

    panelSize, setPanelSize,
    isCrossOutEnabled, setIsCrossOutEnabled,

    showCalculatorPopup, setShowCalculatorPopup,
    calculatorPopupPosX, setCalculatorPopupPosX,
    calculatorPopupPosY, setCalculatorPopupPosY,
    calculatorPopupWidth, setCalculatorPopupWidth,
    calculatorPopupHeight, setCalculatorPopupHeight,

    showGraphPopup, setShowGraphPopup,
    graphPopupPosX, setGraphPopupPosX,
    graphPopupPosY, setGraphPopupPosY,
    graphPopupWidth, setGraphPopupWidth,
    graphPopupHeight, setGraphPopupHeight,

    showMathReferenceSheetPopup, setShowMathReferenceSheetPopup,
    mathReferenceSheetPopupPosX, setMathReferenceSheetPopupPosX,
    mathReferenceSheetPopupPosY, setMathReferenceSheetPopupPosY,
    mathReferenceSheetPopupWidth, setMathReferenceSheetPopupWidth,
    mathReferenceSheetPopupHeight, setMathReferenceSheetPopupHeight,
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
};

export {
  ExamContext,
  ExamProvider,
};
