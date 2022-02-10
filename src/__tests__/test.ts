import { parseJson } from "../index";

describe("parseJson", () => {
  it("number", () => {
    expect(parseJson("5")).toEqual(5);
  });

  it("empty array", () => {
    expect(parseJson("[]")).toEqual([]);
  });

  it("array with numbers", () => {
    expect(parseJson("[0, 1, 1.5, -2, 3]")).toEqual([0, 1, 1.5, -2, 3]);
  });

  it("nested arrays", () => {
    expect(parseJson("[0, [1], 2]")).toEqual([0, [1], 2]);
  });

  it("doubly nested arrays", () => {
    expect(parseJson("[0, [1, [2, [3, 4], 5] ], 6, [ [ [7], 8], 9]]"))
        .toEqual([0, [1, [2, [3, 4], 5] ], 6, [ [ [7], 8], 9]]);
  });

  it("strings", () => {
    expect(parseJson('["foo", "bar", ["baz"]]')).toEqual(["foo", "bar", ["baz"]]);
  });
});
