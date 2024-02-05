<script lang="ts">
	let formattedCommands: string[] = [];
	let dataInput: string = '';
	let existingCrew: any[] = [];

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
			.map((member) => {
				const name = escapeName(member['name']);
				const stars = member['rarity'];
				const level = member['level'];
				return `-got bot crew add ${name} -s${stars} -l${level}`;
			});
		dataInput = '';
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}

	async function loadCrew() {
		const dataResponse = await fetch('http://got.glorat.net/user/396618115972333572');
		const data = await dataResponse.json();
		existingCrew = data['crew'];
	}
</script>

<h1>GoT bot crew import formatter</h1>

<input type="button" on:click={loadCrew} value="Load from bot" />
<input type="text" bind:value={dataInput} />
<input type="button" on:click={formatCrew} value="Format" />

<p>Existing crew: {existingCrew.length}</p>

{#each formattedCommands as command (command)}
	<p><button on:click={() => copyToClipboard(command)}>Copy</button> {command}</p>
{/each}
