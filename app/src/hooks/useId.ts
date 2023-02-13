import { useRef } from "react";

function useId() {
  const idRef = useRef(0);

  const generate = () => {
    idRef.current += 1;
    return idRef.current;
  };

  return generate;
}

export default useId;
