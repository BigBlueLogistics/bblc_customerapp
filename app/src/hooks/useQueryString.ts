import { useMemo } from "react";

function useQueryString() {
  const { search } = window.location;

  const memoize = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  return memoize;
}

export default useQueryString;
