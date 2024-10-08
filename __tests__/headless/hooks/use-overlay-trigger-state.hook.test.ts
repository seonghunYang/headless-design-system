import { act, renderHook } from "@testing-library/react";

import { useOverlayState } from "../../../src/hooks/use-overlay-state.hook";
import { useState } from "react";

function controlledHook(props?: { onChange?: (v: boolean) => void }) {
  const [_isOpen, _setOpen] = useState(false);
  return {
    _isOpen,
    ...useOverlayState({
      isOpen: _isOpen,
      onOpenChange: (isOpen) => {
        props?.onChange && props.onChange(isOpen);
        _setOpen(isOpen);
      },
    }),
  };
}

describe("useOverlayState", () => {
  describe("unControlled", () => {
    it("unControl", () => {
      const { result } = renderHook(() => {
        const { isOpen, setOpen } = useOverlayState({
          defaultOpen: false,
        });
        return {
          isOpen,
          setOpen,
        };
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("setOpen(true)", () => {
      const { result } = renderHook(() => ({
        ...useOverlayState({
          defaultOpen: false,
        }),
      }));

      act(() => {
        result.current.setOpen(true);
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("open", () => {
      const { result } = renderHook(() => ({
        ...useOverlayState({
          defaultOpen: false,
        }),
      }));

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("close", () => {
      const { result } = renderHook(() => ({
        ...useOverlayState({
          defaultOpen: false,
        }),
      }));

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("open and close", () => {
      const { result } = renderHook(() => ({
        ...useOverlayState({
          defaultOpen: false,
        }),
      }));

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("toggle", () => {
      const { result } = renderHook(() => ({
        ...useOverlayState({
          defaultOpen: false,
        }),
      }));

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("Controlled", () => {
    it("control", () => {
      const { result } = renderHook(() => ({
        ...controlledHook(),
      }));

      expect(result.current.isOpen).toBe(false);
      expect(result.current._isOpen).toBe(false);
    });

    it("setOpen(true)", () => {
      const { result } = renderHook(() => ({
        ...controlledHook(),
      }));

      act(() => {
        result.current.setOpen(true);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current._isOpen).toBe(true);
    });

    it("open", () => {
      const { result } = renderHook(() => ({
        ...controlledHook(),
      }));

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current._isOpen).toBe(true);
    });

    it("open and close", () => {
      const { result } = renderHook(() => ({
        ...controlledHook(),
      }));

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current._isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current._isOpen).toBe(false);
    });

    it("toggle", () => {
      const { result } = renderHook(() => ({
        ...controlledHook(),
      }));

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current._isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current._isOpen).toBe(false);
    });
  });
});
