const parseInteger = (string: string) => {
  return parseInt(string);
};

const parseFloating = (string: string) => {
  return parseFloat(parseFloat(string).toFixed(4));
};

const parseBoolean = (string: string) => {
  return string === 'true';
};

export { parseInteger, parseFloating, parseBoolean };
