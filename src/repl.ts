import { State } from "./state.js";

export function cleanInput(input: string): string[] {
	return input
		.toLowerCase()
		.trim()
		.split(" ")
		.filter((word) => word !== "");
}

export function startREPL(state: State) {
	state.readline.prompt();

	state.readline.on("line", (line) => {
		const words = cleanInput(line);
		if (words.length === 0) return state.readline.prompt();

		const command = state.commands.get(words[0]);
		if (!command) return console.log("Unknown command");

		command.callback(state);
		state.readline.prompt();
	});
}
