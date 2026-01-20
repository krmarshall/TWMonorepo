interface LogInterface {
  hits: number;
  modHits: {
    [key: string]: number;
  };
  misses: number;
  missList: Set<string>;
  techHits: number;
  buildCode: number;

  uniqueIps: Set<string>;
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
    scm3: 0,
    cat3: 0,
    ovn3: 0,
    hol3: 0,

    other: 0,
  },
  misses: 0,
  missList: new Set(),
  techHits: 0,
  buildCode: 0,

  uniqueIps: new Set(),
};

const usageLog = (hoursInterval: number) => {
  const hoursIntervalInternal = hoursInterval * 1000 * 60 * 60;
  setInterval(() => {
    outputLog();
  }, hoursIntervalInternal);
};

const outputLog = () => {
  console.log('--------------------------------------');
  console.log(`Unique Users: ${usageData.uniqueIps.size}`);
  console.log(`Skill Hits: ${usageData.hits}`);
  console.log(`Vanilla2: ${usageData.modHits.vanilla2} | Vanilla3: ${usageData.modHits.vanilla3}
SFO3: ${usageData.modHits.sfo3} | Rad3: ${usageData.modHits.radious3} | Mixu3: ${usageData.modHits.mixu3} | Lege3: ${usageData.modHits.lege3} | SCM3: ${usageData.modHits.scm3} | Cat3: ${usageData.modHits.cat3} | OVN3: ${usageData.modHits.ovn3} | HoL3: ${usageData.modHits.hol3}
Other: ${usageData.modHits.other}`);
  console.log(`Skill Misses: ${usageData.misses}`);
  console.log(`API Missed Links: ${Array.from(usageData.missList)}`);
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
    scm3: 0,
    cat3: 0,
    ovn3: 0,
    hol3: 0,

    other: 0,
  };
  usageData.misses = 0;
  usageData.missList = new Set();
  usageData.techHits = 0;
  usageData.buildCode = 0;
  usageData.uniqueIps = new Set();
};

export { usageLog, outputLog, usageData };
