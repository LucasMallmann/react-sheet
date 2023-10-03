import { useEffect } from "react";

export function useClickawayCell(
  cellId: string,
  onClickAway: (event: MouseEvent) => void
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
  }, [onClickAway, cellId]);
}
