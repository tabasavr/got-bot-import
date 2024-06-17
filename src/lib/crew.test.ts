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
            makeCrew("a", 1, 5),
            makeVaultedCrew("a"),
            makeCrew("a", 100, 5),
        ]

        const expected = [
            makeVaultedCrew("a"),
        ]

        expect(deduplicate(crew)).toStrictEqual(expected)
    });

    it ("selects higher level", () => {
        const crew = [
            makeCrew("a", 1, 5),
            makeCrew("a", 100, 1),
            makeCrew("a", 10, 5),
        ]

        const expected = [
            makeCrew("a", 100, 1),
        ]

        expect(deduplicate(crew)).toStrictEqual(expected)
    })

    it ("selects higher stars", () => {
        const crew = [
            makeCrew("a", 1, 1),
            makeCrew("a", 1, 5),
            makeCrew("a", 1, 4),
        ]

        const expected = [
            makeCrew("a", 1, 5),
        ]

        expect(deduplicate(crew)).toStrictEqual(expected)
    })

    it ("keeps different crew", () => {
        const crew = [
            makeCrew("a", 1, 1),
            makeCrew("b", 1, 1),
        ]

        const expected = [
            makeCrew("a", 1, 1),
            makeCrew("b", 1, 1)
        ]

        expect(deduplicate(crew)).toStrictEqual(expected)
    })
});
