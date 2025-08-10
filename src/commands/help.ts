import { State } from "src/state";

export function cmdHelp(state: State) {
	console.log("Welcome to the Pokedex!");
	console.log("Usage:\n");

	for (const [name, command] of state.commands) {
		console.log(`${name}: ${command.description}`);
	}
}
