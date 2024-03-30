const numberInsertion = (string: string, number: number) => {
  string = string.replace('%n', number.toString());
  if (number > 0) {
    string = string.replace('%+n', `+${number}`);
  } else {
    string = string.replace('%+n', `${number}`);
  }
  return string;
};

export default numberInsertion;
