type Field = {
  name: string;
  field_type: null | unknown;
  is_key: boolean;
  default_value: null | string;
  is_filename: boolean;
  filename_relative_path: null | string;
  is_reference: null | Array<string>; // Seems to be array of length 2, 0 is table name without the _tables, 1 is the key in that table
  lookup: null | unknown;
  description: string;
  ca_order: number;
  is_bitwise: number;
  enum_values: unknown;
  is_part_of_colour: null | unknown;
};

export type Definition = {
  version: number;
  fields: Array<Field>;
  localised_fields: Array<Field>;
  localised_key_order: Array<number>;
};

/*
 * Array containing an entire db row, each field in the row has has its rust type as the key
 * and the related typed variable as its value. Each fields key is stored in its related definition
 * eg. [{ StringU16: 'example string' }, { Boolean: false }]
 * Parsed row would look like { key: 'example string', isCool: false }
 */
type RawTableRow = Array<{ [key: string]: string | number | boolean }>;

type RawTable = {
  table_name: string;
  definition: Definition;
  definition_patch?: unknown;
  table_data: Array<RawTableRow>;
  altered: boolean;
};

export type DB = {
  mysterious_byte: boolean;
  guid: string;
  table: RawTable;
};

export type Loc = {
  table: RawTable;
};

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
