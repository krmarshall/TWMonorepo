import log from './log.ts';

const numberPrepend = (string: string, value: number, how: string) => {
  if (string[0] !== ' ') {
    string = ` ${string}`;
  }
  switch (how) {
    case 'add': {
      if (value > 0) {
        string = `+${value}${string}`;
      } else {
        string = `${value}${string}`;
      }
      break;
    }
    case 'mult': {
      string = `x${value}${string}`;
      break;
    }
    default: {
      log(`Invalid prepend how: ${string}`, 'red');
      string = `!INVALID PREPEND HOW! ${value}${string}`;
      break;
    }
  }
  return string;
};

export default numberPrepend;
