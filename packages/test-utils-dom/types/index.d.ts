export interface IConfig {
  asyncWrapper: (cb: () => any) => any
  eventWrapper: (cb: () => any) => any
  advanceTimersWrapper: (cb: () => any) => any
}