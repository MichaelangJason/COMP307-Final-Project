// console.log("Hello Jest");
import { describe, test, expect, afterEach, beforeAll, afterAll } from "@jest/globals";
function sum(a: number, b: number) {
  return a + b;
}

test("sum", () => {
  expect(sum(1, 2)).toBe(3);
});
