<script lang="ts">
	import type { BotCrew, DuplicateResolutionResult, ImmortalCrew, InputCrew } from '$lib/crew.js';
	import { deduplicate } from '$lib/crew.js';

	export let data;

	let formattedCommands: string[] = [];
	let nontrivialDuplicateResolutions: DuplicateResolutionResult[] = []
	let dataInput: string = '';

	let botUserId: string = '';
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

		const duplicateResolutionResults = deduplicate(crew.concat(frozen_crew));
		
		const deduplicated = duplicateResolutionResults.map(result => result.result);
		formattedCommands = deduplicated
			.toSorted((lhs, rhs) => lhs.name.localeCompare(rhs.name))
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

		nontrivialDuplicateResolutions = duplicateResolutionResults.filter(result => result.candidates.length > 1)

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

<main>
	<h1>GoT bot crew import formatter</h1>

	<div>
		<h2>Optional: import existing crew from bot</h2>
		<p>Find yourself in the <a href="http://got.glorat.net/users" target="_blank" rel="noopener noreferrer">list of players</a> and copy your id into this field:</p>
		<input type="text" bind:value={botUserId} /> 

		<p><a href="http://got.glorat.net/user/{botUserId}" target="_blank" rel="noopener noreferrer">Open player data</a> and copy-paste everything into this field and click "Load from bot":</p>
		<input type="text" bind:value={existingDataInput} />
		<input type="button" on:click={loadCrew} value="Load from bot" />
	</div>
	<div>
		<h2>Import player data</h2>
		<p><a href="https://app.startrektimelines.com/player?client_api=20&only_read_state=true" target="_blank" rel="noopener noreferrer">Open player data</a> and copy-paste everything into this field and click "Format":</p>
		<input type="text" bind:value={dataInput} />
		<input type="button" on:click={formatCrew} value="Format" />
	</div>

	<p>Existing crew: {Object.keys(existingCrew).length}</p>

	<h2>Bot commands:</h2>
	{#each formattedCommands as command (command)}
		<p><button on:click={() => copyToClipboard(command)}>Copy</button> {command}</p>
	{/each}
	{#if formattedCommands.length == 0}
		<p>Everything is up to date!</p>
		<p>Note: bot currently does not print commands to delete crew that was dismissed after being added to the bot</p>
	{/if}

	<h2>Duplicate resolution results:</h2>
	{#each nontrivialDuplicateResolutions as resolution (resolution)}
		<h3>Candidates:</h3>
		{#each resolution.candidates as candidate (candidate)}
			<p>{candidate.name} {candidate.rarity}/{candidate.max_rarity} lvl: {candidate.level}
			{#if candidate.vaulted || false}
				frozen
			{/if}
			{#if candidate.in_buy_back_state}
				in buyback
			{/if}
			</p>
		{/each}
		<h3>Selected</h3>
		{resolution.result.name} {resolution.result.rarity}/{resolution.result.max_rarity} lvl: {resolution.result.level}
		{#if resolution.result.vaulted || false}
			frozen
		{/if}
		{#if resolution.result.in_buy_back_state}
			in buyback
		{/if}
	{/each}
	{#if nontrivialDuplicateResolutions.length == 0}
		<p>No duplicates</p>
	{/if}
</main>

<style>
	main {
		margin: 40px auto;
		max-width: 650px;
		line-height: 1.6;
		font-size: 18px;
		color: #454545;
		padding: 0 10px;
	}
	h1, h2, h3{
		line-height: 1.2;
	}
</style>
