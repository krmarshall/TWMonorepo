export const ColorsEnum = {
  grey: 'grey',
  red: 'red',
  green: 'green',
  yellow: 'yellow',
} as const;

const log = (message: string, color: ColorsEnum) => {
  let colorReference;
  switch (color) {
    case ColorsEnum.grey: {
      colorReference = '90';
      break;
    }
    case ColorsEnum.red: {
      colorReference = '31';
      break;
    }
    case ColorsEnum.green: {
      colorReference = '32';
      break;
    }
    case ColorsEnum.yellow: {
      colorReference = '33';
      break;
    }
    default: {
      colorReference = '0';
      break;
    }
  }

  console.log(`\x1b[${colorReference}m`, `\b${message}`, '\x1b[0m');
};

export type ColorsEnum = (typeof ColorsEnum)[keyof typeof ColorsEnum];
export default log;
