import React from "react";

export type IMenuAction = {
  anchorEl: Element;
  onClose: () => void;
  items: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }[];
};
