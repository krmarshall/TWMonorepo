# TotalWarhammerDataParser
 
Requires rpfm_cli.exe under ./bins

Uses NConvert and a webp plugin from XnConvert to convert images and strip metadata.

Reverse engineered DB schema (kinda rough and not totally complete, but handy reference): https://dbdiagram.io/d/6212fade485e433543e7fe91

When CA adds weird stuff that probably needs new tables (like mounts getting autoleveled) check https://github.com/Frodo45127/rpfm-schemas commits to look through table changes.

## Weird Errors

- If workers error with diagnosticCodes its probably a typescript issue
- If localRefs or foreignRefs arent linked correctly it could be a schema update renaming a field, and the cached extract still has the old field name. Try deleting extracted_files to force a re-extract

## Keep any eye on

- effect_bonus_value_unit_list_junctions_tables | ui_effect_excluded_units_and_sets_tables related to showing what units benefit from effects?
- technology_ui_tabs_tables | technology_ui_tabs_to_technology_nodes_junctions_tables

## How To Use

- Ensure an updated version of rpfm_cli.exe exists in ./bins
- Ensure TW3 Assembly Kit is installed and up to date, assumed location is the same as TW3 location
- Check absolute file paths in ./bins/copySource.bat and create a .env in root following example.env
- Make sure all mods are downloaded on steam
- npm run fullBuild
- Extracted character skill trees and images will be in the ./output and ./output_img folders as parsed json and webp's

## Image Extraction

Required image folders (M) need to be manually checked, rest should be in ./output_img:
- skilltree related:
- ui/battle ui/ability_icons/
- ui/campaign ui/effect_bundles/
- ui/campaign ui/skills/
- (M) ui/skins/default/icon_stat_*
- flags/characters:
- (M) ui/flags
- (M) ui/portraits/portholes

WH3 also needs
- (M) ui/skins/default/modifier_icon_*
- (M) ui/battle ui/ability_icons/resistance_* (put with the skins/default)
- (M) ui/campaign ui/skills/item_arcane_item (from WH2, missing from 3)

WH2 has a lot of placeholder ui/skins/default that get hardcode fixed. So copy over imgs in that folder from WH3.

XnConvert webp settings for different conversions:
- skilltree related: quality 90
- flags: lossless
- characters quality 90

Warhammer 3 character portholes arent circularized like wh2/1, can use imagemagick to automate cropping/circularizing them. Note the mask is strangely sized, for whatever reason thats what results in a 164x164 output. The mask also loses inner transparency for black, which then gets replaced, so watch for image artifacts. Can try faffing around with using pink instead?

magick -size 165x166 xc:Transparent -fill White -draw 'circle 83 83 83 1' -alpha Copy mask.png

$files = Get-ChildItem ".\example\"
foreach ($f in $files){
magick .\example\${f} -gravity Center mask.png -compose CopyOpacity -composite -trim -transparent Black .\out\${f}
}

Alternatively use xnconvert actions or gimp if transparency gets munted.

## Adding a mod

- Add relevant robocopies in the copySource.bat
- Add relevant id's to ./src/lists/modIdMap.ts
- If its a multi pack mod add pack names and an enum in ./src/lists/extractLists/modPackNames.ts
- Add a new workerMod to the mods base game worker (worker2/worker3)
- Check for characters in agent_subtypes that arent in faction_agent_permitted_subtypes, add to addAgents in ./src/lists/processFactionsLists.ts
- If adding a subculture potentially add it to ./src/lists/subcultureMap.ts
- Check for manually extracted image paths: 
- ui/skins/default/fe_logo.png
- ui/skins/default/icon_stat_*
- ui/flags
- ui/portraits/portholes
WH3 also needs
- ui/skins/default/modifier_icon_*
- ui/battle ui/ability_icons/resistance_* (put with the skins/default)
- Use the above image conversion settings/scripts appropriately
- Copy extracted data TWPData repo
- Copy extracted imgs TotalWarhammerPlanner repo frontend/public/imgs

## Character Skill Node Faction/Subcultures

Skill nodes are able to only be added to trees when they are part of specific factions or subcultures. Mods use this somewhat inconsistently where sometimes its good they aren't added to the "generic" node set, but sometimes they should be.

## Techs

For Sigmar knows what reason tech indents start at -2, I realigned them to start at 0 for easier array usage. So all indents in output data will be 2 higher than in packs.

## Potential Automation

If enough monthly donations can look at upgrading the droplet to something that could handle running the data parser builds (4-32GB mem, ~100GB storage). Use steamcmd to grab workshop files every x interval, if they changed trigger a rebuild. Would probably want to properly automate portrait extraction/linking.
