import { generateKeyCountPairs } from "@/lib/utils";

describe("generateKeyCountPairs", () => {
  it("counts all entries when filteredData is not provided", () => {
    const input = ["PLA", "PETG", "PLA", "ABS", "PLA", "PETG"];

    const result = generateKeyCountPairs(input);

    expect(result).toEqual([
      ["PLA", 3],
      ["PETG", 2],
      ["ABS", 1],
    ]);
  });

  it("keeps keys from full set and applies counts from filtered data", () => {
    const allColors = ["Red", "Blue", "Black", "Blue"];
    const filtered = ["Blue", "Blue"];

    const result = generateKeyCountPairs(allColors, filtered);

    expect(result).toEqual([
      ["Blue", 2],
      ["Red", 0],
      ["Black", 0],
    ]);
  });

  it("returns zero counts for all keys if filtered data is empty", () => {
    const input = ["A", "B", "A"];

    const result = generateKeyCountPairs(input, []);

    expect(result).toEqual([
      ["A", 0],
      ["B", 0],
    ]);
  });
});
