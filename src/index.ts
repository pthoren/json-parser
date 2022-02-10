import { scanner } from "./scanner";
import { parser } from "./parser";

export function parseJson(source: string) {
  const tokens = scanner(source);
  const json = parser(tokens);
  return json;
}
