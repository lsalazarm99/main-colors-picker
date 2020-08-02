import MainColorsPicker, { MainColorsPickerMode } from "./main-colors-picker";

describe("Main Colors Picker", () => {
  test("should throw when the colors variety level is 0", () => {
    expect(() => {
      MainColorsPicker.get([[0, 0, 0]], { colorsVarietyLevel: 0 });
    }).toThrow();
  });

  test("should throw when the colors variety level 257", () => {
    expect(() => {
      MainColorsPicker.get([[0, 0, 0]], { colorsVarietyLevel: 257 });
    }).toThrow();
  });

  test("should throw when the colors variety level is not an integer", () => {
    expect(() => {
      MainColorsPicker.get([[0, 0, 0]], { colorsVarietyLevel: 1.5 });
    }).toThrow();
  });

  test("should throw when no colors are given", () => {
    expect(() => {
      MainColorsPicker.get([], { mode: MainColorsPickerMode.frequency });
    }).toThrow();
  });

  test("should throw when a bad sub-pixel is passed", () => {
    expect(() => {
      MainColorsPicker.get([[-1, 0, 0]]);
    }).toThrow();

    expect(() => {
      MainColorsPicker.get([[256, 0, 0]]);
    }).toThrow();

    expect(() => {
      MainColorsPicker.get([[255.5, 0, 0]]);
    }).toThrow();

    expect(() => {
      MainColorsPicker.get([[255.4, 0, 0]]);
    }).not.toThrow();
  });

  test("should return 1 color when the colors are the same", () => {
    expect(
      MainColorsPicker.get(
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        { colorsVarietyLevel: 256 }
      )
    ).toHaveLength(1);
  });

  test("should return 1 color when the colors variety level is 1", () => {
    expect(
      MainColorsPicker.get(
        [
          [0, 0, 0],
          [127, 0, 0],
          [128, 0, 0],
          [255, 0, 0],
        ],
        { colorsVarietyLevel: 1 }
      )
    ).toHaveLength(1);
  });

  test("should return 2 colors when the colors variety level is 2", () => {
    expect(
      MainColorsPicker.get(
        [
          [0, 0, 0],
          [127, 0, 0],
          [128, 0, 0],
          [255, 0, 0],
        ],
        { colorsVarietyLevel: 2 }
      )
    ).toHaveLength(2);
  });

  test("should return 4 colors when the colors variety level is 256", () => {
    expect(
      MainColorsPicker.get(
        [
          [0, 0, 0],
          [127, 0, 0],
          [128, 0, 0],
          [255, 0, 0],
        ],
        { colorsVarietyLevel: 256 }
      )
    ).toHaveLength(4);
  });

  test("should return colors ordered by amount of colors", () => {
    expect(
      MainColorsPicker.get(
        [
          [0, 0, 0],
          [2, 0, 0],
          [1, 0, 0],
          [0, 0, 0],
          [2, 0, 0],
          [0, 0, 0],
          [1, 0, 0],
          [0, 0, 0],
        ],
        { colorsVarietyLevel: 256 }
      )
    ).toEqual([
      [0, 0, 0],
      [2, 0, 0],
      [1, 0, 0],
    ]);
  });

  test("should return the average color", () => {
    expect(
      MainColorsPicker.get(
        [
          [1, 0, 0],
          [2, 0, 0],
          [3, 0, 0],
          [4, 0, 0],
          [5, 0, 0],
        ],
        { colorsVarietyLevel: 1 }
      )
    ).toEqual([[3, 0, 0]]);
  });

  test("should return the most frequent color", () => {
    expect(
      MainColorsPicker.get(
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [254, 0, 0],
          [254, 0, 0],
          [254, 0, 0],
          [254, 0, 0],
          [255, 0, 0],
          [255, 0, 0],
          [255, 0, 0],
        ],
        { colorsVarietyLevel: 1, mode: MainColorsPickerMode.frequency }
      )
    ).toEqual([[0, 0, 0]]);
  });
});
