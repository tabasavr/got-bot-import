#!/bin/sh
# curl "https://raw.githubusercontent.com/stt-datacore/website/master/static/structured/crew.json" | jq -c 'map( { (.archetype_id|tostring): .name } ) | add' > crew.json

curl "https://raw.githubusercontent.com/stt-datacore/website/master/static/structured/crew.json" | jq -c 'map( { (.archetype_id|tostring): {"name":.name, "max_rarity": .max_rarity} } ) | add' > crew.json