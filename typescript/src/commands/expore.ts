import { State } from "../state.js";

export async function cmdExplore(state: State, ...args: string[]) {
	const areaArg = args[0];
	console.log(`Exploring ${areaArg}...`);
	const area = await state.api.fetchLocationArea(areaArg);

	console.log("Found Pokemon:");
	for (const result of area.pokemon_encounters) {
		console.log(" - " + result.pokemon.name);
	}
}
