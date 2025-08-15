import { State } from "../state.js";

export async function cmdCatch(state: State, ...args: string[]) {
	const pokemon = args[0];
	console.log(`Throwing a Pokeball at ${pokemon}...`);
	const data = await state.api.fetchPokemon(pokemon);

	const caught = calculateCatch(data.base_experience);

	if (caught) {
		console.log(`${pokemon} was caught!`);
		state.pokedex[pokemon] = data;
	} else {
		console.log(`${pokemon} escaped!`);
	}
}

const MIN_EXP = 40;
const MAX_EXP = 255;
const MIN_CHANCE = 0.05;
const MAX_CHANCE = 0.95;
const curveFactor = 2; // or tune this for steeper/easier curves

function calculateCatch(baseExp: number): boolean {
	const difficulty = (baseExp - MIN_EXP) / (MAX_EXP - MIN_EXP);
	const chance = Math.max(MIN_CHANCE, Math.min(MAX_CHANCE, Math.pow(1 - difficulty, curveFactor)));

	return Math.random() < chance;
}
