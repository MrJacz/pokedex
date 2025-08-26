import { createInterface, type Interface } from "readline";
import { CLICommand, commands } from "./commands/index.js";
import { PokeAPI, Pokemon } from "./PokeAPI.js";

export type State = {
	readline: Interface;
	commands: Map<string, CLICommand>;
	api: PokeAPI;
	nextLocationURL: string | null;
	prevLocationURL: string | null;
	pokedex: Record<string, Pokemon>;
};

export function initState(): State {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: "Pokedex > "
	});

	return {
		readline: rl,
		api: new PokeAPI(),
		commands,
		nextLocationURL: null,
		prevLocationURL: null,
		pokedex: {}
	};
}
