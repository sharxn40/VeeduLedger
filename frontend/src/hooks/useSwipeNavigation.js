import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useSwipeNavigation = (threshold = 150) => {
  const navigate = useNavigate();
  const touchStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const handleStart = (x, y) => {
      touchStart.current = { x, y };
      isDragging.current = true;
    };

    const handleEnd = (x, y) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const deltaX = x - touchStart.current.x;
      const deltaY = y - touchStart.current.y;

      // Check if the gesture was primarily horizontal and exceeded the threshold
      // deltaX > 0 means left-to-right (Back)
      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > threshold) {
        navigate(-1);
      }
    };

    // Mouse Events
    const onMouseDown = (e) => handleStart(e.clientX, e.clientY);
    const onMouseUp = (e) => handleEnd(e.clientX, e.clientY);

    // Touch Events
    const onTouchStart = (e) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = (e) => handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [navigate, threshold]);
};

export default useSwipeNavigation;
