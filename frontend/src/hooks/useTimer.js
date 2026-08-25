import { useState, useRef, useCallback, useEffect } from "react";

export function useTimer({ initialSeconds = 60, mode = "down", onComplete } = {}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (mode === "down") {
          if (prev <= 1) {
            clear();
            setIsRunning(false);
            onCompleteRef.current?.();
            return 0;
          }
          return prev - 1;
        }
        return prev + 1;
      });
    }, 1000);
  }, [mode, clear]);

  const pause = useCallback(() => {
    clear();
    setIsRunning(false);
  }, [clear]);

  const reset = useCallback(
    (newInitial = initialSeconds) => {
      clear();
      setIsRunning(false);
      setSeconds(newInitial);
    },
    [clear, initialSeconds]
  );

  useEffect(() => () => clear(), [clear]);

  const formatted = formatTime(seconds);

  return { seconds, formatted, isRunning, start, pause, reset };
}

export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
