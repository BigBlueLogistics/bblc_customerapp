import { useRef, useCallback, useEffect } from "react";

function useId() {
  const id = useRef(0);
  const isMount = useRef(false);

  useEffect(() => {
    if (isMount && isMount.current === false) {
      isMount.current = true;
    }
  }, []);

  const generate = useCallback(() => {
    if (isMount.current) {
      id.current += 1;
    }
    return id.current;
  }, [isMount]);

  return generate;
}

export default useId;
