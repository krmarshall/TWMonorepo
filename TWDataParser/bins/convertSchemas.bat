rpfm_cli.exe --game warhammer_3 schemas to-json --schemas-path ../rpfm-schemas

ROBOCOPY "..\rpfm-schemas" ".\jsonSchemas" schema_wh2.json schema_wh3.json /NJH /NJS /MOV

del ..\rpfm-schemas\*.json
