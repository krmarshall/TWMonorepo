type PortraitEntry = {
  id: string;
  camera_settings_body: unknown;
  camera_settings_head: unknown;
  variants: Array<{
    age: number;
    faction_leader: boolean;
    file_diffuse: string; // Base portrait png
    file_mask_1: string; // Masks layered over the base portrait for stuff like faction colors
    file_mask_2: string;
    file_mask_3: string;
    filename: string;
    level: number;
    politician: boolean;
    season: string;
  }>;
};

export type PortraitSettings = {
  version: number;
  entries: Array<PortraitEntry>;
};
