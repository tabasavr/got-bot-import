<script lang="ts">
	export let data;

	/**
	 * Crew in active part of user input (player data json)
	 */ 
	type InputCrew = {
		name: string;
		level: number;
		in_buy_back_state: boolean;
		rarity: number;
		max_rarity: number;
		vaulted?: boolean; // not part of player data, but simplifies things 
	};

	/**
	 * Crew in immortalized part of user input (player data json)
	 */
	type ImmortalCrew = {
		id: number;
		quantity: number;
	}

	/**
	 * Crew in bot input
	 */
	type BotCrew = {
		name: string;
		level: number;
		stars: number; // rarity in InputCrew
		maxstart: number; // max_rarity in InputCrew
		vaulted?: boolean;
	};

	let formattedCommands: string[] = [];
	let dataInput: string = '';

	let existingDataInput: string = '';
	let existingCrew: {[name: string]: BotCrew} = {};

	// escape `'` in the name because bot doesn't support them
	function escapeName(name: string): string {
		return name.replaceAll("'", "\\'");
	}

	function formatCrew(_event: Event) {
		const apiData = JSON.parse(dataInput);

		// add frozen crew
		const stored_immortals: ImmortalCrew[] = apiData['player']['character']['stored_immortals'];
		const frozen_crew = stored_immortals.map(member => {
			const id = member["id"].toString();
			const archetype = data['archetypes'][id];
			return {
				'name': archetype['name'],
				'level': 100,
				'rarity': archetype['max_rarity'],
				'max_rarity': archetype['max_rarity'],
				'vaulted': true,
				'in_buy_back_state': false,
			}
		});

		// format everything
		const crew: InputCrew[] = apiData['player']['character']['crew'];
		formattedCommands = crew.concat(frozen_crew)
			.filter((member) => !member['in_buy_back_state'])
			.filter((member) => {
				const existing = existingCrew[member['name']];
				return (
					existing === undefined ||
					existing['level'] !== member['level'] ||
					existing['stars'] !== member['rarity'] ||
					existing['vaulted'] !== member['vaulted']
				);
			})
			.map((member) => {
				const name = member['name'];
				const escapedName = escapeName(name);
				const stars = member['rarity'];
				const level = member['level'];
				const vaulted = member['vaulted'] === true;

				const existing = existingCrew[name];
				const hasExisting = existing !== undefined;

				if (!hasExisting) {
					return `-got bot crew add ${escapedName} -s${stars} -l${level}`;
				} else if (vaulted) {
					return `-got bot crew vault ${escapedName}`
				} else if (existing['vaulted'] === true) {
					return `-got bot crew unvault ${escapedName}`
				} else {
					return `-got bot equip ${escapedName} -s${stars} -l${level}`
				}
			});
		dataInput = '';
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}

	async function loadCrew() {
		const data = JSON.parse(existingDataInput);
		existingCrew = data['crew'].reduce((acc: Record<string, any>, member: any) => {
			acc[member['name']] = member;
			return acc;
		}, {});
		existingDataInput = '';
	}
</script>

<h1>GoT bot crew import formatter</h1>

<div>
	<input type="text" bind:value={existingDataInput} />
	<input type="button" on:click={loadCrew} value="Load from bot" />
</div>
<div>
	<input type="text" bind:value={dataInput} />
	<input type="button" on:click={formatCrew} value="Format" />
</div>

<p>Existing crew: {Object.keys(existingCrew).length}</p>

{#each formattedCommands as command (command)}
	<p><button on:click={() => copyToClipboard(command)}>Copy</button> {command}</p>
{/each}
