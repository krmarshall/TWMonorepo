export interface CompilationGroupsInterface {
  mods: Array<string>;
  nodeSets: { [nodeSetKey: string]: string /*Mod Name*/ };
}
