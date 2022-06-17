import { createContext, useContext } from "react";

// The Timeline main context
const Timeline = createContext(null);

// Timeline context provider
function TimelineProvider({ children, value }: { children: React.ReactNode; value: any }) {
  return <Timeline.Provider value={value}>{children}</Timeline.Provider>;
}

// Timeline custom hook for using context
function useTimeline() {
  return useContext(Timeline);
}

export { TimelineProvider, useTimeline };
