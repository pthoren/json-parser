import { parseJson } from "../index";

describe("parseJson", () => {
  it("number", () => {
    expect(parseJson("5")).toEqual(5);
  });

  it("empty array", () => {
    expect(parseJson("[]")).toEqual([]);
  });

  it("array with numbers", () => {
    expect(parseJson("[0, 1, 1.5, 2, 3]")).toEqual([0, 1, 1.5, 2, 3]);
  });

  it("nested arrays", () => {
    expect(parseJson("[0, [1]]")).toEqual([0, [1]]);
  });
});
