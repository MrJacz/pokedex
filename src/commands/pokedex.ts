import { State } from "../state.js";

export async function cmdPokedex(state: State) {
	console.log("Your Pokedex:");
	for (const poke of Object.values(state.pokedex)) {
		console.log(" - " + poke.name);
	}
}
