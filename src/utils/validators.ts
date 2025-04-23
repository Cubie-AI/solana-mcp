import { InvalidValueError } from "./error";

export function validateNotNull(value: any, fieldName: string) {
  if (value === null || value === undefined) {
    throw new InvalidValueError(`${fieldName} cannot be null or undefined`);
  }
}

export function validateListResponse(value: any, fieldName: string) {
  validateNotNull(value, fieldName);

  if (!Array.isArray(value)) {
    throw new InvalidValueError(`${fieldName} must be an array`);
  }
}
