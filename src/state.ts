import { createInterface, type Interface } from "readline";
import { CLICommand, commands } from "src/commands";

export type State = {
	readline: Interface;
	commands: Map<string, CLICommand>;
};

export function initState(): State {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: "Pokedex > "
	});

	return {
		readline: rl,
		commands
	};
}
