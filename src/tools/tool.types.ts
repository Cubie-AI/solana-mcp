import { Context } from "../solana/context";

export type ToolMethod = (args: any, context: Context) => PromiseLike<any>;
