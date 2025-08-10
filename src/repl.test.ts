import { cleanInput } from "./repl.js";
import { describe, expect, test } from "vitest";

describe.each([
	{
		input: "  hello  world  ",
		expected: ["hello", "world"]
	},
	{ input: "foo", expected: ["foo"] },
	{ input: "   foo   ", expected: ["foo"] },
	{ input: "foo   bar   baz", expected: ["foo", "bar", "baz"] },
	{ input: "   ", expected: [] },
	{ input: "", expected: [] },
	{ input: "a   b c", expected: ["a", "b", "c"] }
])("cleanInput($input)", ({ input, expected }) => {
	test(`Expected: ${expected}`, () => {
		const actual = cleanInput(input);
		expect(actual).toHaveLength(expected.length);
		for (const i in expected) {
			expect(actual[i]).toBe(expected[i]);
		}
	});
});
