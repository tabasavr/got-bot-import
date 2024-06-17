import { describe, it, expect } from 'vitest';
import { deduplicate, type InputCrew } from './crew';

function makeCrew(name: string, level: number, stars: number): InputCrew {
    return {
        name: name,
        level: level,
        in_buy_back_state: false,
        rarity: stars,
        max_rarity: 5,
        vaulted: false
    };
}

function makeVaultedCrew(name: string): InputCrew {
    return {
        name: name,
        level: 100,
        in_buy_back_state: false,
        rarity: 5,
        max_rarity: 5,
        vaulted: true
    };
}

describe("deduplicate", () => {
    it("selects vaulted", () => {
        const crew = [
            makeCrew("a", 100, 5),
            makeVaultedCrew("a"),
        ]

        const expected = [
            makeVaultedCrew("a"),
        ]

        expect(deduplicate(crew)).toStrictEqual(expected)
    });
});
