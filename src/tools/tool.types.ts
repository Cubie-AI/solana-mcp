import { ZodRawShape } from "zod";
import { Context, ContextConfig } from "../context";

/** All tools will either return their result or throw an error */
export type ToolMethod<T extends Context> =
  | ((args: any, context: T) => Promise<any>)
  | ((args: any, context: T) => any);

export type ServerToolSchema<T extends ContextConfig> = {
  name: string;
  description: string;
  parameters: ZodRawShape;
  method: ToolMethod<T>;
};

export type ServerToolConfig<T extends ContextConfig> = Record<
  string,
  Omit<ServerToolSchema<T>, "name">
>;
