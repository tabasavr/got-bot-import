import { base } from '$app/paths';

export const ssr = false; //todo: can this be set to true?

export async function load({ params }) {
	let archetypes = await fetch(base + '/crew.json'); 
    return {
        "archetypes": await archetypes.json()
    };
}
