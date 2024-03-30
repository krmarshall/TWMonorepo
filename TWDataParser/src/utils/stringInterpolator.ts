import { TableRecord } from '../interfaces/GlobalDataInterface';
import log from './log';

// Locs have tags that interpolate into various things, colored text, images, text replacement ect.
// [[col:<color>]]<text>[[/col]] Colors the <text> to be <color> inside the tags
// [[overridecol:<color>]]<text>[[/overridecol]] Same as above?
// [[img:<image path>]][[/img]] inserts image at <image path>, some are path literals, some are just names, not sure where the names resolve to
// {{tr:<key>}} inserts text from (i think) the ui_text_replacements__.loc, these can contain more tags for interpolation
// [[sl:<key>]]<text>[[/sl]] ¯\_(ツ)_/¯ used somewhat in ui_text_replacements?
// [[sl_tooltip:<key>]]<text>[[/sl_tooltip]] ¯\_(ツ)_/¯ used somewhat in ui_text_replacements?
// [[url:<link>]]<text>[[/url]] Creates url
// [[tooltip:<key>]]<text>[[/tooltip]] Creates tooltip
// [[b]]<text>[[/b]] Bold?
// {{tt:key}} inserts text for tooltip, not sure from what table

// For the time being just does text replacement for {{tr}} tags, and returns whatever is inside [[]] tags

const stringInterpolator = (string: string, loc: TableRecord): string => {
  // Can have issues with mods referencing outdated tables/records
  if (string === undefined) {
    log(`Invalid stringInterpolator call`, 'red');
    return '!InvalidStringInterpolatorCall';
  }
  if (!string.includes('[[') && !string.includes('{{')) {
    // Replacing this before going through the rest of string interpolator breaks element innertext checks at bottom.
    if (string.includes('\\\\n')) {
      string = string.replaceAll('\\\\n', '\n\t');
    }
    return string;
  }

  // Remove color tags
  string = string.replaceAll(/\[\[(col:[a-zA-Z]*|\/col)\]\]/g, '');
  // Remove bold tags
  string = string.replaceAll(/\[\[b\]\]/g, '');
  string = string.replaceAll(/\[\[\/b\]\]/g, '');

  if (string.includes('{{')) {
    const tagR = string.match(/\{\{[a-zA-Z0-9:_./ ]*\}\}/);
    if (tagR === null) {
      log(`Invalid {{tr}} loc: ${string}`, 'yellow');
    } else {
      let cleanedKey = tagR[0].replace('{{tr:', '');
      cleanedKey = cleanedKey.replace('}}', '');
      let replacementText = loc[`ui_text_replacements_localised_text_${cleanedKey}`] as string;
      // WH3 can text replace from loc tables besides ui_text_replacements_localised_text, see if the lookup is valid for that case
      if (replacementText === undefined) {
        replacementText = loc[cleanedKey] as string;
      }
      if (replacementText === undefined) {
        log(`Missing {{tr}} loc: ${string}`, 'yellow');
        string = string.replace(tagR[0], '!Missing!');
      } else {
        string = string.replace(tagR[0], replacementText);
      }
    }
  }

  if (string.includes('[[')) {
    // Grab element within first tag and last tag of the same tagName
    const regex = new RegExp(/\[\[(?<tagName>[a-zA-Z_]*)[:=]?(?<tagAttribute>[a-zA-Z0-9_./ ]*)\]\](?<innerText>.*)\[\[\/\k<tagName>\]\]/);
    let element = string.match(regex);
    // If its an img we want the first instance of its closing tagName not the last.
    if (element?.groups?.tagName === 'img') {
      element = string.match(
        /\[\[(?<tagName>[a-zA-Z_]*)[:=]?(?<tagAttribute>[a-zA-Z0-9_./ ]*)\]\](?<innerText>[a-zA-Z0-9_.!?, ]*)\[\[\/\k<tagName>\]\]/,
      );
    }

    // Hardcode Fixes
    // Vanilla locs occasionally have opening img tags without closing tags
    if (element === null) {
      element = string.match(/\[\[img[:=][a-zA-Z0-9_./ ]*\]\]/);
    }
    // overridecol sometimes closes with /col and sometimes with /overridecol
    if (element === null) {
      element = string.match(/\[\[overridecol:[a-zA-Z0-9_./ ]*\]\](?<innerText>.*)\[\[\/col\]\]/);
    }
    // WH3 has [[/col]] tags missing a closing ]
    if (element === null) {
      element = string.match(/\[\[col:[a-zA-Z0-9_./ ]*\]\](?<innerText>.*)\[\[\/col\]/);
    }
    // WH3 adds a bunch of col tags that arent closed by anything
    if (element === null) {
      element = string.match(/\[\[col:[a-zA-Z0-9_./ ]*\]\]/);
    }
    // SFO2 has bugged img tags such as [[img:icon_ap] (that also dont have closing tags)
    if (element === null) {
      element = string.match(/\[\[(?<tagName>[a-zA-Z_]*):[a-zA-Z0-9_./ ]*\](?<innerText>[^\]])/);
    }
    // SFO3 has closing /col tags with no opening tag
    if (element === null) {
      element = string.match(/\[\[\/col\]\]/);
    }

    if (element === null) {
      log(`Invalid [[]] loc: ${string}`, 'red');
    } else {
      let innerText;
      if (element.groups?.innerText === null || element.groups?.innerText === undefined) {
        innerText = '';
      } else if (element.groups.tagName === 'img' && element.groups.tagAttribute === 'icon_arrow_up') {
        innerText = '➕';
      } else if (element.groups.tagName === 'img' && element.groups.tagAttribute === 'icon_arrow_down') {
        innerText = '➖';
      } else {
        innerText = element.groups.innerText;
      }
      string = string.replace(element[0], innerText);
    }
  }
  return stringInterpolator(string, loc);
};

export default stringInterpolator;
