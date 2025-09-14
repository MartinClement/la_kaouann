const TEXT_COLORS = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37
}

const BACKGROUND_COLORS = {
  black: 40,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  white: 47
}

const COLORS = {
  text: TEXT_COLORS,
  background: BACKGROUND_COLORS
};

const getTags = (color, mode) => {
  const colors = COLORS[mode];
  const colorCode = colors[color] || "0";

  return [`\x1b[${colorCode}m`, "\x1b[0m"];
};

export default function (text, color, mode = "text") {
  const [open, close] = getTags(color, mode);

  console.log(`${open} ${text} ${close}`);
}

