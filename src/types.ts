export enum TokenType {
  LEFT_BRACKET = "LEFT_BRACKET",
  RIGHT_BRACKET = "RIGHT_BRACKET",
  LEFT_BRACE = "LEFT_BRACE",
  RIGHT_BRACE = "RIGHT_BRACE",
  COMMA = "COMMA",
  DOT = "DOT",
  MINUS = "MINUS",
  STRING = "STRING",
  NUMBER = "NUMBER",
}

export class Token {
  constructor(
    public type: TokenType,
    public lexeme: string,
    public literal?: any
  ) {}
}
