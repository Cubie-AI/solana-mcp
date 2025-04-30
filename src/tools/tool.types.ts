import { Context } from "../context";

/** All tools will either return their result or throw an error */
export type ToolMethod<T extends Context = Context> =
  | ((args: any, context: T) => Promise<any>)
  | ((args: any, context: T) => any);
