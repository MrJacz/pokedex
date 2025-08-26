import { State } from "../state.js";

export async function cmdInspect(state: State, ...args: string[]) {
	const pokemon = state.pokedex[args[0]];

	if (!pokemon) return console.log("you have not caught that pokemon");

	console.log(`Name: ${pokemon.name}`);
	console.log(`Height: ${pokemon.height}`);
	console.log(`Weight: ${pokemon.weight}`);
	console.log("Stats:");

	for (const stat of pokemon.stats) {
		console.log(`  -${stat.stat.name}: ${stat.base_stat}`);
	}

	console.log("Types:");

	for (const type of pokemon.types) {
		console.log("  - " + type.type.name);
	}
}
