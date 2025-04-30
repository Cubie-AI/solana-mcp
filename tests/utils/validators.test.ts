import { describe, it } from "@jest/globals";
import { validateListResponse, validateNotNull } from "../../src";

describe("utils/validators validateNotNull", () => {
  it("should throw an error for null value", () => {
    const value = null;
    expect(() => validateNotNull(value, "testField")).toThrow(Error);
  });

  it("should throw an error for undefined value", () => {
    const value = undefined;
    expect(() => validateNotNull(value, "testField")).toThrow(Error);
  });

  it("should not throw an error for all other results", () => {
    const value = "testValue";
    expect(() => validateNotNull(value, "testField")).not.toThrow(Error);
  });
});

describe("utils/validators validateListResponse", () => {
  it("should throw an error for null value", () => {
    const value = null;
    expect(() => validateListResponse(value, "testField")).toThrow(Error);
  });

  it("should throw an error for undefined value", () => {
    const value = undefined;
    expect(() => validateListResponse(value, "testField")).toThrow(Error);
  });

  it("should throw an error for non-array value", () => {
    const value = "testValue";
    expect(() => validateListResponse(value, "testField")).toThrow(Error);
  });

  it("should return the result for array value", () => {
    validateListResponse([1, 2, 3], "testField");
  });
});
