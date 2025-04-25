import { getErrorMessage } from "./error";

type TextData = {
  text: string;
};
/**
 * A standardized result object for the TinyAgent and tools.
 */
export interface Result<T extends TextData = TextData> {
  /** Indicates if the operation was successful. */
  success: boolean;
  /** The data returned from the operation. */
  data: T;
}

export function err(error: unknown): Result {
  return {
    success: false,
    data: {
      text: getErrorMessage(error),
    },
  };
}

export function ok(data: any): Result {
  return {
    success: true,
    data: {
      text: JSON.stringify(data, null, 2),
    },
  };
}
