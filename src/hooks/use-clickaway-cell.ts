import { RefObject, useEffect } from "react";

type Params = {
  onClickAway: (event: MouseEvent) => void;
  cellId: string;
};

export function useClickawayCell(
  ref: RefObject<HTMLElement>,
  { onClickAway, cellId }: Params
) {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const id = (event.target as HTMLElement).dataset.cellId;
      if (id !== cellId) {
        onClickAway(event);
      }
    };
    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [ref, onClickAway, cellId]);
}
