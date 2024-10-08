import type { AriaPopoverProps, PopoverAria, useButton } from "react-aria";
import { OverlayTriggerAria } from "react-aria";
import { createContext, RefObject, useContext } from "react";
import { usePopover } from "../../hooks/use-popover.hook";
import { OverlayCallback } from "src/hooks/use-overlay-state.hook";
import { InteractionDataProps } from "src/types/interactions";

export type Placement = "top" | "right" | "bottom" | "left";

export interface PopoverTriggerDataProps extends InteractionDataProps {
  "data-open"?: string;
}

export interface PopoverContentDataProps
  extends Omit<InteractionDataProps, "data-focus"> {
  "data-open"?: string;
  "data-placement"?: Placement;
  "data-closed"?: string;
}

export interface PopoverState extends OverlayCallback {
  isOpen: boolean;
  setOpen(isOpen: boolean): void;
}

export type PopoverAriaWithoutCenter = Omit<PopoverAria, "placement"> & {
  placement: Placement;
};

export type PopoverTriggerProps = Omit<
  ReturnType<typeof useButton>["buttonProps"],
  "children"
> &
  PopoverTriggerDataProps;

export type PopoverTriggerPropsWithRef<T extends Element> =
  PopoverTriggerProps & {
    ref: RefObject<T>;
  };

export type PopoverContentProps = PopoverAriaWithoutCenter &
  Pick<OverlayTriggerAria, "overlayProps"> &
  Pick<PopoverState, "isOpen"> &
  PopoverContentDataProps;

export type PopoverContentPropsWithRef<C extends Element> =
  PopoverContentProps & {
    ref: RefObject<C>;
  };

export interface PopoverRoot<T extends Element, C extends Element>
  extends PopoverState {
  popoverRef: React.RefObject<C>;
  triggerRef: React.RefObject<T>;
  triggerProps: PopoverTriggerPropsWithRef<T>;
  popoverContentProps: PopoverContentPropsWithRef<C>;
  placement: Placement;
}

type PopoverContextValue<T extends Element, C extends Element> = PopoverRoot<
  T,
  C
>;

const PopoverContext = createContext<PopoverContextValue<
  Element,
  Element
> | null>(null);

export type PopoverProps<T extends Element, C extends Element> = {
  defaultOpen?: boolean;
  onChange?: (isOpen: boolean) => void;
} & Omit<AriaPopoverProps, "popoverRef" | "triggerRef" | "placement"> &
  Partial<PopoverRoot<T, C>>;

interface PopoverRootProps<T extends Element, C extends Element>
  extends PopoverProps<T, C> {
  children: React.ReactNode;
}

export function PopoverRoot<
  T extends Element = HTMLButtonElement,
  C extends Element = HTMLDivElement,
>({ children, ...props }: PopoverRootProps<T, C>) {
  const { rootProps } = usePopover({
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

  return context;
};
