import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { AttributeInterface } from '../@types/CharacterInterface.ts';
import findImage from '../utils/findImage.ts';
import stringInterpolator from '../utils/stringInterpolator.ts';

const processAttribute = (
  folder: string,
  globalData: GlobalDataInterface,
  attribute: TableRecord,
  attributeType?: string,
) => {
  // Attribute imued_effect_text is generally just the attribute name, but sometimes has below bullet text format
  const description = stringInterpolator(
    (attribute.imued_effect_text as string) ?? '',
    globalData.parsedData[folder].text,
  );
  const splitDescription = description.split('||');
  const strippedDescription = splitDescription[0];

  // Attribute bullet text has the format AttributeName||AttributeDescription, just want the description
  const bulletText = stringInterpolator((attribute.bullet_text as string) ?? '', globalData.parsedData[folder].text);
  const splitBulletText = bulletText.split('||');
  const strippedBulletText = splitBulletText[splitBulletText?.length - 1];

  const returnAttribute: AttributeInterface = {
    key: attribute.key as string,
    description: strippedDescription,
    bullet_text: strippedBulletText,
    icon: findAttributeImage(folder, globalData, attribute.key as string),
  };
  if (attributeType === 'negative') {
    returnAttribute.description = 'Removes ' + returnAttribute.description.trimStart();
  }

  return returnAttribute;
};

export default processAttribute;

const findAttributeImage = (folder: string, globalData: GlobalDataInterface, attributeKey: string) => {
  const searchArray = [
    `campaign_ui/effect_bundles/attribute_${attributeKey}`,
    `campaign_ui/effect_bundles/attribute_${attributeKey.toLowerCase()}`,
    `battle_ui/ability_icons/${attributeKey}`,
    `battle_ui/ability_icons/${attributeKey.toLowerCase()}`,
  ];

  return findImage(folder, globalData, searchArray, attributeKey);
};
