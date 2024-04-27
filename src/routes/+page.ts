import { base } from '$app/paths';

export const ssr = false; //todo: can this be set to true?

/**
 * Crew in static game data (crew.json)
 */
type StaticCrew = {
    name: string;
    max_rarity: number;
}

export async function load({ params }) {
	let archetypes = await fetch(base + '/crew.json'); 
    let archetypesJson: { [id: string]: StaticCrew } = await archetypes.json();
    return {
        "archetypes": archetypesJson,
    };
}
