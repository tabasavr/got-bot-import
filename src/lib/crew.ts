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
