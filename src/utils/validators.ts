import { Connection } from "@solana/web3.js";
import { Context } from "../context";
import { InvalidValueError, UnsupportedMethod } from "./error";

export function validateNotNull(
  value: any,
  fieldName: string
): asserts value is any {
  if (value === null || value === undefined) {
    throw new InvalidValueError(`${fieldName} cannot be null or undefined`);
  }
}

export function validateListResponse(
  value: unknown,
  fieldName: string
): asserts value is any[] {
  validateNotNull(value, fieldName);
  if (!Array.isArray(value) || !(value instanceof Array)) {
    throw new InvalidValueError(`${fieldName} must be a non-empty array`);
  }
}

/**
 * Validates that the supplied context
 */
export function validateConnection(
  connection: unknown
): asserts connection is Connection {
  if (!(connection instanceof Connection)) {
    throw new UnsupportedMethod("Invalid connection object");
  }
}

export function validateContext<T extends Context>(
  context: unknown
): asserts context is T {
  validateNotNull(context, "context");
  validateConnection(context?.connection);
}

export function validateRequiredContext(
  context: unknown
): asserts context is Required<Context> {
  validateContext(context);
  validateNotNull(context?.payerKeypair, "payerKeypair");
  if (!(context?.payerKeypair instanceof Uint8Array)) {
    throw new InvalidValueError("Invalid payerKeypair");
  }
}
