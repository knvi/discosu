import * as irc from "node-irc";

const world = 'world';

export function hello(who: string = world): string {
  return `Hello ${who}! `;
}

console.log(hello('TypeScript'));