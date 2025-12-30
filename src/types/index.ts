export type TimerMode = "work" | "break" | "longBreak" | "stop";

export interface TimerState {
  mode: TimerMode;
  duration: number;
  targetTime: number | null;
}

export type WorkCategory = {
  id: number;
  name: string;
};

export interface WorkLog {
  date: string;
  categoryId: number;
  minutes: number;
}

export interface PersistedState {
  categories: WorkCategory[];
  logs: WorkLog[];
}
