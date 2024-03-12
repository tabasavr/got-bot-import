<script lang="ts">
	let formattedCommands: string[] = [];
	let dataInput: string = '';

	let existingDataInput: string = '';
	let existingCrew: Record<string, any> = [];

	// escape `'` in the name because bot doesn't support them
	function escapeName(name: string): string {
		return name.replaceAll("'", "\\'");
	}

	function formatCrew(_event: Event) {
		const data = JSON.parse(dataInput);
		const crew: any[] = data['player']['character']['crew'];
		formattedCommands = crew
			.filter((member) => !member['in_buy_back_state'])
			.filter((member) => {
				const existing = existingCrew[member['name']];
				return (
					existing === undefined ||
					existing['level'] !== member['level'] ||
					existing['stars'] !== member['rarity']
				);
			})
			.map((member) => {
				const name = member['name'];
				const escapedName = escapeName(name);
				const stars = member['rarity'];
				const level = member['level'];

				const hasExisting = existingCrew[name] !== undefined;
				const command = hasExisting ? 'equip' : 'crew add';

				return `-got bot ${command} ${escapedName} -s${stars} -l${level}`;
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
