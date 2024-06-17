import { base } from '$app/paths';
import type { StaticCrew } from '$lib/crew'

export const ssr = false; //todo: can this be set to true?

export async function load({ params }) {
	let archetypes = await fetch(base + '/crew.json'); 
    let archetypesJson: { [id: string]: StaticCrew } = await archetypes.json();
    return {
        "archetypes": archetypesJson,
    };
}
