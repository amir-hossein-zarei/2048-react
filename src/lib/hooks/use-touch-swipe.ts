import { useEffect, useRef } from "react";

export enum SwipeDirection {
  Up,
  Down,
  Left,
  Right,
}

function useTouchSwipe(onSwipe: (direction: SwipeDirection) => void) {
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      touchStartX.current = event.touches[0].clientX;
      touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const { clientX, clientY } = event.changedTouches[0];

      const width = clientX - touchStartX.current;
      const height = clientY - touchStartY.current;

      if (width > 30 && width > height) {
        onSwipe(SwipeDirection.Right);
      } else if (width < -30 && width < height) {
        onSwipe(SwipeDirection.Left);
      } else if (height > 30 && height > width) {
        onSwipe(SwipeDirection.Down);
      } else if (height < -30 && height < width) {
        onSwipe(SwipeDirection.Up);
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  });
}

export default useTouchSwipe;
