import { buildToolHandler } from "../../src";

// Define your custom tool
function myCustomTool(params: { data: string }) {
  return "test";
}

async function myCustomAsyncTool(
  params: { data: string },
  context: { newField: string }
) {
  return context.newField;
}

describe("tools/tools", () => {
  it("should return a executable tool", async () => {
    const tool = buildToolHandler(myCustomTool, {
      data: "test",
      connection: {} as any,
    });

    expect(tool).toBeDefined();
    expect(tool).toBeInstanceOf(Function);
  });

  it("should return a tool that catches errors", async () => {
    const context = {
      newField: "test",
      connection: {} as any,
    };
    const tool = buildToolHandler(myCustomAsyncTool, context);

    const result = await tool(undefined);
    console.dir(result);
    expect(result).toBeDefined();
  });
});
