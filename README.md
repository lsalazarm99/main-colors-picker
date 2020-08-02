# main-colors-picker

`main-colors-picker` is a tool to which you give an array of colors and this returns its main colors. A color is just
 an array of 3 numbers whose values are from 0 to 255. Yes, they are the RGB values!
 
 ```js
const mainColors = [[25, 50, 75], [3, 120, 60], [90, 27, 9], [210, 160, 180]];
```
 
The main colors are selected by color spectrum and number of colors.

Keep in mind that this tool is intended to receive an array of colors from, for example, an image, where the same
 color could be repeated many times. How to get these colors? Take a look at:
- [`image-to-colors`](https://www.npmjs.com/package/image-to-colors)
 
## Installation
Just run:
```bash
npm install main-colors-picker
```

## Usage

It is pretty straightforward:
```js
import MainColorsPicker from "main-colors-picker";
import ImageToColors from "iamge-to-colors"; // Using image-to-colors to get the colors from an image.

const image = document.getElementById('myImage');
const colors = ImageToColors.get(image);

const mainColors = MainColorsPicker.get(colors);
```

## Configuration

You can pass a second argument with some adjustments you want to make for color selection.

```js
{
  // A number from 1 to 256 that represents how much the colors will be grouped before color selection.
  colorsVarietyLevel: number;

  // Indicates how the colors should to be selected.
  mode: MainColorsPickerMode.average || MainColorsPickerMode.frequency;
}
```

## How does it work?

Glad you ask!
1. We group the colors by color spectrum based on a colors variety level parameter.
2. The groups of colors are sorted according to the number of colors they contain, from highest to lowest.
3. From each group of color we obtain the average or most frequent color. The resulting list represents the main colors.

This idea is inspired by:
- [`albumcolors`](https://github.com/chengyin/albumcolors) — From [@chengyin](https://github.com/chengyin)
