export type LooseType<T extends string> = T | Omit<string, T>;
