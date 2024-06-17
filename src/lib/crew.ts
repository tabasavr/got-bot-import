/**
 * Crew in active part of user input (player data json)
 */ 
export type InputCrew = {
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
export type ImmortalCrew = {
    id: number;
    quantity: number;
}

/**
 * Crew in bot input
 */
export type BotCrew = {
    name: string;
    level: number;
    stars: number; // rarity in InputCrew
    maxstart: number; // max_rarity in InputCrew
    vaulted?: boolean;
};

/**
 * Crew in static game data (crew.json)
 */
export type StaticCrew = {
    name: string;
    max_rarity: number;
}

export function deduplicate(crew: InputCrew[]): InputCrew[] {
    const groupped = Object.groupBy(crew, (member) => member.name);
    return Object.entries(groupped).map((entry) => {
        const [_, members] = entry;

        return members!.toSorted((lhs, rhs) => {
            if (lhs.vaulted != rhs.vaulted) {
                return lhs.vaulted ? 1 : -1;
            }
            if (lhs.level != rhs.level) {
                return lhs.level - rhs.level;
            }
            return lhs.rarity - rhs.rarity;
        })
            .at(-1)!; // get last
    })
}
