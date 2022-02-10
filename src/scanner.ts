import { Token, TokenType } from "./types";
import { isDigit } from "./util";

export function scanner(source: string) {
  let tokens: Token[] = [];
  let start = 0;
  let current = 0;

  function scanTokens() {
    while (!isAtEnd()) {
      // beginning of next lexeme
      start = current;
      scanToken();
    }
  }

  function scanToken() {
    const c = advance();

    switch (c) {
      case "[":
        addToken(TokenType.LEFT_BRACKET);
        break;
      case "]":
        addToken(TokenType.RIGHT_BRACKET);
        break;
      case "{":
        addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        addToken(TokenType.RIGHT_BRACE);
        break;
      case ",":
        addToken(TokenType.COMMA);
        break;
      case "-":
        addToken(TokenType.MINUS);
        break;
      case '"':
        string();
        break;
      case " ":
      case "\r":
      case "\t":
      case "\n":
        // skip whitespace
        break;
      default:
        if (isDigit(c)) {
          number();
        } else {
          throw new Error("Unexpected character");
        }
    }
  }

  function string() {
    while (peek() != '"' && !isAtEnd()) {
      advance();
    }

    if (isAtEnd()) {
      throw new Error("Unterminated string.");
    }

    // closing quote
    advance();

    const value = source.substring(start + 1, current - 1);
    addToken(TokenType.STRING, value);
  }

  function number() {
    while (isDigit(peek())) {
      advance();
    }

    if (peek() === "." && isDigit(peekNext())) {
      // consume dot
      advance();

      while (isDigit(peek())) advance();
    }

    addToken(
      TokenType.NUMBER,
      Number.parseFloat(source.substring(start, current))
    );
  }

  function isAtEnd() {
    return current >= source.length;
  }

  function peek() {
    return source[current];
  }

  function peekNext() {
    return source[current + 1];
  }

  function advance() {
    return source[current++];
  }

  function addToken(type: TokenType, literal?: any) {
    const text = source.substring(start, current);
    tokens.push(new Token(type, text, literal));
  }

  scanTokens();
  return tokens;
}
