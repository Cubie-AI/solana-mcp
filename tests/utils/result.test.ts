import { describe, it } from "@jest/globals";
import { Err, Ok } from "../../src";
describe("utils/result", () => {
  it("should return a success result", () => {
    const result = Ok("Success");
    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify("Success"),
        },
      ],
    });
  });

  it("should return an error result", () => {
    const error = new Error("Something went wrong");
    const result = Err(error);
    expect(result).toBeDefined();

    expect(result.isError).toEqual(true);
    expect(result.content).toEqual([
      {
        type: "text",
        text: "Something went wrong",
      },
    ]);
  });
});
