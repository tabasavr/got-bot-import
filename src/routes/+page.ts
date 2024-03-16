export const ssr = false; //todo: can this be set to true?

export async function load({ params }) {
	let archetypes = await fetch('/crew.json'); 
    return {
        "archetypes": await archetypes.json()
    };
}
