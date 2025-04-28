import { Context } from "../solana/context";

/** All tools will either return their result or throw an error */
export type ToolMethod = (args: any, context: Context) => PromiseLike<any>;
