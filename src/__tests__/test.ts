import { parseJson } from "../index";

describe("parseJson", () => {
  it("empty array", () => {
    expect(parseJson("[]")).toEqual([]);
  });

  it("unterminated array", () => {
    expect(() => parseJson("[")).toThrow();
  });

  it("number", () => {
    expect(parseJson("5")).toEqual(5);
  });

  it("array with numbers", () => {
    expect(parseJson("[0, 1, 1.5, -2, 3]")).toEqual([0, 1, 1.5, -2, 3]);
  });

  it("nested arrays", () => {
    expect(parseJson("[0, [1], 2]")).toEqual([0, [1], 2]);
  });

  it("doubly nested arrays", () => {
    expect(parseJson("[0, [1, [2, [3, 4], 5] ], 6, [ [ [7], 8], 9]]")).toEqual([
      0,
      [1, [2, [3, 4], 5]],
      6,
      [[[7], 8], 9],
    ]);
  });

  it("strings", () => {
    expect(parseJson('["foo", "bar", ["baz"]]')).toEqual([
      "foo",
      "bar",
      ["baz"],
    ]);
  });

  it("boolean", () => {
    expect(parseJson("true")).toEqual(true);
    expect(parseJson("false")).toEqual(false);
  });

  it("booleans", () => {
    expect(parseJson('[true, false, [false, "foo"], 0]')).toEqual([
      true,
      false,
      [false, "foo"],
      0,
    ]);
  });

  it("empty object", () => {
    expect(parseJson("{}")).toEqual({});
  });

  it("unterminated object", () => {
    expect(() => parseJson("{")).toThrow();
  });

  it("object with key:value pair", () => {
    expect(parseJson('{"key": "value"}')).toEqual({ key: "value" });
  });

  it("object with key:value pairs", () => {
    expect(parseJson('{"foo": 0, "bar": true, "baz": "quox"}')).toEqual({
      foo: 0,
      bar: true,
      baz: "quox",
    });
  });

  it("object with nested objects", () => {
    expect(
      parseJson('{"foo": { "bar": { "baz": [1, 2, "three"] }, "quox": true } }')
    ).toEqual({ foo: { bar: { baz: [1, 2, "three"] }, quox: true } });
  });
});
