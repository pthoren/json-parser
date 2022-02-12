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
      case ":":
        addToken(TokenType.COLON);
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
        if (isDigit(c) || (c === "-" && isDigit(peek()))) {
          number();
        } else if (!boolean(c)) {
          throw new Error(`Unexpected character ${c}`);
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

    if (peek() === "." && isDigit(peek(1))) {
      // consume dot
      advance();

      while (isDigit(peek())) advance();
    }

    const value = Number.parseFloat(source.substring(start, current));

    addToken(TokenType.NUMBER, value);
  }

  function boolean(c: string) {
    if (c === "t" && source.substring(current, current + 3) === "rue") {
      current += 3;
      addToken(TokenType.BOOLEAN, true);
      return true;
    } else if (c === "f" && source.substring(current, current + 4) === "alse") {
      current += 4;
      addToken(TokenType.BOOLEAN, false);
      return true;
    }

    return false;
  }

  function isAtEnd() {
    return current >= source.length;
  }

  function peek(lookahead?: number) {
    return source[current + (lookahead ?? 0)];
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
