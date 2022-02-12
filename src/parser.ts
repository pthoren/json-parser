import { Token, TokenType } from "./types";

export function parser(tokens: Token[]) {
  let current = 0;

  function parseTokens() {
    let json;

    while (!isAtEnd()) {
      json = parseToken();
      advance();
    }

    return json;
  }

  function parseToken() {
    const token = advance();

    switch (token.type) {
      case TokenType.LEFT_BRACKET:
        return array();
      case TokenType.LEFT_BRACE:
        return object();
      case TokenType.BOOLEAN:
      case TokenType.NUMBER:
        return token.literal;
      default:
        throw new Error(`Unexpected token: ${token.type}`);
    }
  }

  function value() {
    if (match(TokenType.LEFT_BRACE)) {
      return object();
    } else if (match(TokenType.LEFT_BRACKET)) {
      return array();
    } else if (match(TokenType.NUMBER, TokenType.STRING, TokenType.BOOLEAN)) {
      return previous().literal;
    }
  }

  function object() {
    const ret: Record<string, any> = {};

    let idx = 0;
    while (!check(TokenType.RIGHT_BRACE)) {
      if (idx > 0 && !match(TokenType.COMMA)) {
        throw new Error("Missing comma");
      }
      const k = string();
      consume(TokenType.COLON);
      const v = value();
      ret[k] = v;
      idx++;
    }

    consume(TokenType.RIGHT_BRACE);

    return ret;
  }

  function array(): any[] {
    const values = [];

    let idx = 0;
    while (!check(TokenType.RIGHT_BRACKET)) {
      if (idx > 0 && !match(TokenType.COMMA)) {
        throw new Error("Missing comma");
      }
      values.push(value());
      idx++;
    }

    consume(TokenType.RIGHT_BRACKET);

    return values;
  }

  function string() {
    if (match(TokenType.STRING)) {
      return previous().literal;
    }
    throw new Error("Missing string");
  }

  function advance() {
    const token = peek();

    if (!isAtEnd()) {
      current++;
    }

    return token;
  }

  function consume(...types: TokenType[]) {
    for (const ttype of types) {
      if (check(ttype)) {
        return advance();
      }
    }

    if (isAtEnd()) {
      throw new Error(`Missing ${types}`);
    } else {
      throw new Error(`Unexpected ${peek().type}`);
    }
  }

  function match(...types: TokenType[]) {
    for (const ttype of types) {
      if (check(ttype)) {
        advance();
        return true;
      }
    }

    return false;
  }

  function check(type: TokenType) {
    return !isAtEnd() && peek().type === type;
  }

  function isAtEnd() {
    return current >= tokens.length;
  }

  function peek() {
    return tokens[current];
  }

  function previous() {
    return tokens[current - 1];
  }

  const json = parseTokens();
  return json;
}
