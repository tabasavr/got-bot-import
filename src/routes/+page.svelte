<script lang="ts">
    let formattedCommands: string[] = []
    let dataInput: string = ""

    // escape `'` in the name because bot doesn't support them
    function escapeName(name: string): string {
        function escapeSegment(s: string): string {
            if (s.startsWith("'") && s.endsWith("'")) {
                return escapeSegment(s.substring(1, s.length - 1))
            }
            const index = s.indexOf("'")
            if (index == -1) {
                return s
            } else {
                return s.substring(index + 1)
            }
        }
        return name.split(" ").map(escapeSegment).join(" ")
    }

    function formatCrew(_event: Event) {
        const data = JSON.parse(dataInput)
        const crew: any[] = data["player"]["character"]["crew"]
        formattedCommands = crew.map((member) => {
            const name = escapeName(member["name"])
            const stars = member["rarity"]
            const level = member["level"]
            return "-got bot crew add ${name} -s${stars} -l${level}"
        })
    }
</script>

<h1>GoT bot crew import formatter</h1>

<input type="text" bind:value={dataInput}/>
<input type="button" on:click={formatCrew} value="Format"/>

{#each formattedCommands as command (command)}
    <p>{command}</p>
{/each}
