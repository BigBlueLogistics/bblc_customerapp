import React from "react";

export type TMenuAction = {
  anchorEl: Element;
  onClose: () => void;
  items: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }[];
};
