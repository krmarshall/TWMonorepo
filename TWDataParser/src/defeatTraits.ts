import type { GlobalDataInterface } from './@types/GlobalDataInterface.ts';
import type RpfmClient from './rpfmClient.ts';

// Many hard coded assumptions around script/campaign/wh2_campaign_traits.lua format
const defeatTraits = async (globalData: GlobalDataInterface, rpfmClient: RpfmClient) => {
  const filePath = (await rpfmClient.listFiles('script/campaign/wh2_campaign_traits.lua'))[0];
  const file = await rpfmClient.fileRead(filePath);
  const fileString = file.contents.data.Text?.contents;
  if (fileString === undefined) {
    throw `Failed to read defeat traits file`;
  }
  const rawTraits = fileString.match(/legendary_lord_defeated_traits = {[a-zA-Z0-9\n\r\s-_=,'"[\]()]*},/);
  const splitTraits = rawTraits?.[0].split('\r\n');
  if (splitTraits === undefined) {
    throw `Failed to split defeat traits`;
  }
  splitTraits.shift(); // legendary_lord_defeated_traits = {
  splitTraits.shift(); // --["character key"] (agent_subtypes) = "trait key" (character_traits)
  splitTraits.pop(); // },

  const agentDefeatTraitMap: Record<string, string> = {};
  splitTraits.forEach((rawString) => {
    // '\t\t["wh_main_emp_karl_franz"] =\t\t\t\t"wh2_main_trait_defeated_karl_franz", \t\t\t\t\t-- Karl Franz'
    const splitStrings = rawString.split('"');
    const agentKey = splitStrings[1];
    const traitKey = splitStrings[3];
    agentDefeatTraitMap[agentKey] = traitKey;
  });
  globalData.agentDefeatTraitMap = agentDefeatTraitMap;
};

export default defeatTraits;
