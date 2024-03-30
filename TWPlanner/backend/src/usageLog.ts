interface LogInterface {
  hits: number;
  modHits: {
    [key: string]: number;
  };
  misses: number;
  missList: Array<string>;
  techHits: number;
  buildCode: number;
}

const usageData: LogInterface = {
  hits: 0,
  modHits: {
    vanilla2: 0,
    vanilla3: 0,
    radious3: 0,
    sfo3: 0,
    mixu3: 0,
    lege3: 0,
    crys3: 0,
    scm3: 0,
    cat3: 0,
    ovn3: 0,
    hol3: 0,

    other: 0,
  },
  misses: 0,
  missList: [],
  techHits: 0,
  buildCode: 0,
};

const usageLog = (hoursInterval: number) => {
  const hoursIntervalInternal = hoursInterval * 1000 * 60 * 60;
  setInterval(() => {
    outputLog();
  }, hoursIntervalInternal);
};

const outputLog = () => {
  console.log('--------------------------------------');
  console.log(`Skill Hits: ${usageData.hits}`);
  console.log(usageData.modHits);
  console.log(`Skill Misses: ${usageData.misses}`);
  // console.log('API Missed Links:');
  // console.log(usageData.missList);
  console.log(`Tech Hits: ${usageData.techHits}`);
  console.log(`Build Codes: ${usageData.buildCode}`);

  usageData.hits = 0;
  usageData.modHits = {
    vanilla2: 0,
    vanilla3: 0,
    radious3: 0,
    sfo3: 0,
    mixu3: 0,
    lege3: 0,
    crys3: 0,
    scm3: 0,
    cat3: 0,
    ovn3: 0,
    hol3: 0,

    other: 0,
  };
  usageData.misses = 0;
  usageData.missList = [];
  usageData.techHits = 0;
  usageData.buildCode = 0;
};

export { usageLog, outputLog, usageData };
