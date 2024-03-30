interface BuildInterface {
  game: string;
  faction: string;
  character: string;
  buildData: Array<Array<number>>;
  rank: number;
  startingSkillPoints: number;
  autoUnlockSkillPoints: number;
  selectedSkills: Array<string>;
  blockedSkills: Array<string>;
}

export default BuildInterface;
