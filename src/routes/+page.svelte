<script lang="ts">
	let formattedCommands: string[] = [];
	let dataInput: string = '';

	let existingDataInput: string = '';
	let existingCrew: Record<string, any> = [];

	// escape `'` in the name because bot doesn't support them
	function escapeName(name: string): string {
		function escapeSegment(s: string): string {
			if (s.startsWith("'") && s.endsWith("'")) {
				return escapeSegment(s.substring(1, s.length - 1));
			}
			const index = s.indexOf("'");
			if (index == -1) {
				return s;
			} else {
				return s.substring(index + 1);
			}
		}
		return name.split(' ').map(escapeSegment).join(' ');
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
					existing['rarity'] !== member['rarity']
				);
			})
			.map((member) => {
				const name = escapeName(member['name']);
				const stars = member['rarity'];
				const level = member['level'];

				const hasExisting = existingCrew[name] !== undefined;
				const command = hasExisting ? 'equip' : 'crew add';

				return `-got bot ${command} ${name} -s${stars} -l${level}`;
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

<p>Existing crew: {existingCrew.length}</p>

{#each formattedCommands as command (command)}
	<p><button on:click={() => copyToClipboard(command)}>Copy</button> {command}</p>
{/each}
