import { Token, TokenType } from "./types";

export function parser(tokens: Token[]) {
  let current = 0;
  let json: any;

  function parseTokens() {
    while (!isAtEnd()) {
      json = parseToken();
      advance();
    }
  }

  function parseToken() {
    const token = advance();

    switch (token.type) {
      case TokenType.LEFT_BRACKET:
        return array();
      case TokenType.NUMBER:
        return token.literal;
      default:
        throw new Error(`Unexpected token: ${token.type}`);
    }
  }

  /*
    private Expr primary() {
      if (match(FALSE)) return new Expr.Literal(false);
      if (match(TRUE)) return new Expr.Literal(true);
      if (match(NIL)) return new Expr.Literal(null);
  
      if (match(NUMBER, STRING)) {
        return new Expr.Literal(previous().literal);
      }
  
      if (match(LEFT_PAREN)) {
        Expr expr = expression();
        consume(RIGHT_PAREN, "Expect ')' after expression.");
        return new Expr.Grouping(expr);
      }
    }
    */

  function array(): any[] {
    const values = [];

    while (!check(TokenType.RIGHT_BRACKET)) {
      if (match(TokenType.LEFT_BRACKET)) {
        values.push(array());
      } else if (match(TokenType.COMMA)) {
        values.push(value());
      } else if (match(TokenType.NUMBER)) {
        values.push(previous().literal);
      }
    }

    consume(TokenType.RIGHT_BRACKET);

    return values;
  }

  function value() {
    if (match(TokenType.LEFT_BRACKET)) {
      return array();
    } else if (match(TokenType.NUMBER)) {
      return previous().literal;
    }
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

    throw new Error(`Unexpected ${peek().type}`);
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

  parseTokens();
  return json;
}
