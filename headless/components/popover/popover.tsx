import type { AriaPopoverProps, PopoverAria } from "react-aria";
import { OverlayTriggerAria } from "react-aria";
import { createContext, useContext } from "react";
import { usePopover } from "../../hooks/use-popover.hook";
import { OverlayCallback } from "headless/hooks/use-overlay-state.hook";

export interface PopoverState extends OverlayCallback {
  isOpen: boolean;
  setOpen(isOpen: boolean): void;
}

export type PopoverAriaWithoutCenter = Omit<PopoverAria, "placement"> & {
  placement: "top" | "right" | "bottom" | "left";
};

type PopoverAriaType = PopoverAriaWithoutCenter &
  OverlayTriggerAria &
  PopoverState;

export interface PopoverRoot extends PopoverAriaType {
  popoverRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

type PopoverContextValue = PopoverRoot;

const PopoverContext = createContext<PopoverContextValue | null>(null);

export type PopoverProps = {
  defaultOpen?: boolean;
  onChange?: (isOpen: boolean) => void;
} & Omit<AriaPopoverProps, "popoverRef" | "triggerRef" | "placement"> &
  Partial<PopoverRoot>;

interface PopoverRootProps extends PopoverProps {
  children: React.ReactNode;
}

export function PopoverRoot({ children, ...props }: PopoverRootProps) {
  const { rootProps } = usePopover({
    isOpen: props.isOpen,
    defaultOpen: props.defaultOpen,
    ...props,
  });

  return (
    <PopoverContext.Provider
      value={{
        ...rootProps,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

export const usePopoverContext = () => {
  let context = useContext(PopoverContext);
  if (context === null) {
    throw new Error("usePopoverContext must be used within a Popover");
  }
  return context;
};
