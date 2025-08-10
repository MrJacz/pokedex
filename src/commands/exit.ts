import { State } from "../state.js";

export function cmdExit(state: State) {
	console.log("Closing the Pokedex... Goodbye!");
	state.readline.close();
	process.exit(0);
}
