/**
 * An array of colors of the image is needed. A color is an array of 3 integer numbers (RGB), from 0 to 255.
 *
 * 1. We group the colors by color spectrum based on a colors variety level parameter.
 * 2. The groups of colors are sorted according to the number of colors they contain, from highest to lowest.
 * 3. From each group of color we obtain the average or most frequent color. The resulting list represents the main
 * colors.
 */
export default class MainColorsPicker {
  /**
   * Get a list of main colors from an array of colors.
   *
   * @param colors
   * An array of colors. A color is an array of 3 integer numbers (RGB), from 0 to 255.
   *
   * @param parameters
   * Optional configuration for color selection.
   */
  static get(
    colors: Color[],
    parameters?: MainColorsPickerParameters
  ): Color[] {
    this.validateParameters(colors, parameters);
    return this.getMainColors(
      this.getColorGroups(colors, parameters),
      parameters
    );
  }

  private static validateParameters(colors: Color[], parameters?: MainColorsPickerParameters) {
    if (colors.length === 0) {
      throw new Error("No colors were passed.");
    }

    if (parameters?.colorsVarietyLevel !== undefined) {
      if (!Number.isInteger(parameters.colorsVarietyLevel)) {
        throw new Error("The colors variety should be an integer.");
      }

      if (
        parameters.colorsVarietyLevel < 1 ||
        parameters.colorsVarietyLevel > 256
      ) {
        throw new Error("The colors variety should be between 1 and 256.");
      }
    }
  }

  private static getColorGroups(
    colors: Color[],
    parameters?: MainColorsPickerParameters
  ): ColorGroups {
    let colorGroups: ColorGroups = new Map<string, ColorGroup>();
    const groupsIndex = this.generateGroupsIndex(
      parameters?.colorsVarietyLevel ?? 8
    );

    colors.forEach((color) => {
      const colorGroupDefiner: number[] = [];

      color.forEach((subPixel) => {
        if (!Number.isInteger(subPixel)) {
          subPixel = Math.round(subPixel);
        }

        if (subPixel < 0 || subPixel > 255) {
          throw new Error(
            "Sub-pixel value can not be less than 0 or greater than 255."
          );
        }

        colorGroupDefiner.push(groupsIndex[subPixel]);
      });

      const colorGroupName = colorGroupDefiner.join(",");

      if (colorGroups.has(colorGroupName)) {
        colorGroups.get(colorGroupName)?.push(color);
      } else {
        colorGroups.set(colorGroupName, [color]);
      }
    });

    colorGroups = this.sortColorGroups(colorGroups);

    return colorGroups;
  }

  private static getMainColors(
    colorGroups: ColorGroups,
    parameters?: MainColorsPickerParameters
  ): Color[] {
    const mainColors: Color[] = [];

    colorGroups.forEach((colorGroup) => {
      switch (parameters?.mode) {
        case MainColorsPickerMode.frequency:
          mainColors.push(this.getMostFrequentColor(colorGroup));
          break;
        case MainColorsPickerMode.average:
        default:
          mainColors.push(this.getAverageColor(colorGroup));
      }
    });

    return mainColors;
  }

  private static generateGroupsIndex(quantityOfGroups: number) {
    const maxLimit = 256;
    const groupsIndexLimits: number[] = [];
    const groupsIndex: number[] = [];

    for (let i = 1; i <= quantityOfGroups; i++) {
      groupsIndexLimits.push(Math.round(maxLimit * (i / quantityOfGroups)));
    }

    groupsIndexLimits.forEach((groupsIndexLimit, index) => {
      for (let i = 0; i < maxLimit; i++) {
        if (groupsIndex[i] === undefined) {
          if (i < groupsIndexLimit) {
            groupsIndex[i] = index;
          }
        }
      }
    });

    return groupsIndex;
  }

  private static sortColorGroups(colorGroups: ColorGroups): ColorGroups {
    return new Map(
      Array.from(colorGroups.entries()).sort(
        (colorGroupA, colorGroupB) =>
          colorGroupB[1].length - colorGroupA[1].length
      )
    );
  }

  private static getAverageColor(colorGroup: ColorGroup): Color {
    let r = 0;
    let g = 0;
    let b = 0;

    colorGroup.forEach((color) => {
      r += color[0];
      g += color[1];
      b += color[2];
    });

    r = Math.round(r / colorGroup.length);
    g = Math.round(g / colorGroup.length);
    b = Math.round(b / colorGroup.length);

    return [r, g, b];
  }

  private static getMostFrequentColor(colorGroup: ColorGroup): Color {
    let maximumFrequencyRegistered = 0;
    let mostFrequentColor: Color = [0, 0, 0];

    colorGroup.forEach((color) => {
      let colorFrequency = 1;

      colorGroup.forEach((comparedColor) => {
        if (color.every((value, index) => value === comparedColor[index])) {
          colorFrequency++;
        }

        if (colorFrequency > maximumFrequencyRegistered) {
          maximumFrequencyRegistered = colorFrequency;
          mostFrequentColor = color;
        }
      });
    });

    return mostFrequentColor;
  }
}

export type Color = [number, number, number];
export type ColorGroup = Color[];
export type ColorGroups = Map<string, ColorGroup>;

export enum MainColorsPickerMode {
  /**
   * For each group, a color will be generated by averaging all the colors in that group.
   */
  average,
  /**
   * For each group, the color that appears most frequently will be selected.
   */
  frequency,
}

export interface MainColorsPickerParameters {
  /**
   * A number from 1 to 256 that represents how much the colors will be grouped before color selection. The number
   * of groups that will be made at most, and therefore the number of colors that will be returned at most, is this
   * number at the power of 3.
   *
   * The default value is 8.
   */
  colorsVarietyLevel?: number;
  /**
   * Indicates how the colors should to be selected.
   */
  mode?: MainColorsPickerMode;
}
