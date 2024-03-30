import schema from '../../bins/jsonSchemas/schema_wh3.json';

interface FieldInterface {
  name: string;
  field_type: null | any;
  is_key: boolean;
  default_value: null | string;
  is_filename: boolean;
  filename_relative_path: null | string;
  is_reference: null | Array<string>; // Seems to be array of length 2, 0 is table name without the _tables, 1 is the key in that table
  lookup: null | any;
  description: string;
  ca_order: number;
  is_bitwise: number;
  enum_values: any;
  is_part_of_colour: null | any;
}

interface TableInterface {
  version: number;
  fields: Array<FieldInterface>;
  localised_fields: Array<FieldInterface>;
  localised_key_order: Array<number>;
}

interface PatchInterface {
  [key: string]: {
    default_value?: string;
    explanation: string;
    not_empty?: string;
    is_reference?: string;
  };
}

interface SchemaInterface {
  version: number;
  definitions: { [key: string]: Array<TableInterface> };
  patches: { [key: string]: PatchInterface };
}

export type DirectSchema = typeof schema;

export { SchemaInterface, TableInterface };
