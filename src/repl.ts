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

	state.readline.on("line", async (line) => {
		const words = cleanInput(line);
		if (words.length === 0) return state.readline.prompt();

		const cmdName = words[0];
		const args = words.slice(1);

		const command = state.commands.get(cmdName);
		if (!command) {
			console.log(`Unknown command: "${cmdName}". Type "help" for a list of commands.`);
			return state.readline.prompt();
		}
		try {
			await command.callback(state, ...args);
		} catch (error) {
			if (error instanceof Error) console.log(error.message);
			else console.log(error);
		}
		state.readline.prompt();
	});
}
