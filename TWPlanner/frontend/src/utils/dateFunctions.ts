const toParsedDateString = (number: number) => {
  return new Date(number * 1000).toDateString().replace(/Sun |Mon |Tue |Wed |Thu |Fri |Sat /, '');
};

const mostRecentDateString = (numArray: Array<number>) => {
  return toParsedDateString(numArray.sort((a, b) => a - b)[numArray.length - 1]);
};

export { toParsedDateString, mostRecentDateString };
