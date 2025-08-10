import { State } from "src/state.js";
import { cmdExit } from "./exit.js";
import { cmdHelp } from "./help.js";

export type CLICommand = {
	name: string;
	description: string;
	callback: (state: State) => void;
};

const cmds = [
	{
		name: "exit",
		description: "Exits the pokedex",
		callback: cmdExit
	},
	{
		name: "help",
		description: "Shows how to use the pokedex cli tool",
		callback: cmdHelp
	}
];

export const commands = new Map<string, CLICommand>();

for (const cmd of cmds) commands.set(cmd.name, cmd);
