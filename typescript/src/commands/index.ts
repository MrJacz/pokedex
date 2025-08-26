import { State } from "../state.js";
import { cmdExit } from "./exit.js";
import { cmdHelp } from "./help.js";
import { cmdMap } from "./map.js";
import { cmdMapBack } from "./mapback.js";
import { cmdExplore } from "./expore.js";
import { cmdCatch } from "./catch.js";
import { cmdInspect } from "./inspect.js";
import { cmdPokedex } from "./pokedex.js";

export type CLICommand = {
	name: string;
	description: string;
	callback: (state: State, ...args: string[]) => Promise<void> | void;
};

const cmds: CLICommand[] = [
	{
		name: "exit",
		description: "Exits the pokedex",
		callback: cmdExit
	},
	{
		name: "help",
		description: "Shows how to use the pokedex cli tool",
		callback: cmdHelp
	},
	{
		name: "map",
		description: "",
		callback: cmdMap
	},
	{
		name: "mapb",
		description: "",
		callback: cmdMapBack
	},
	{
		name: "explore",
		description: "",
		callback: cmdExplore
	},
	{
		name: "catch",
		description: "",
		callback: cmdCatch
	},
	{
		name: "inspect",
		description: "",
		callback: cmdInspect
	},
	{
		name: "pokedex",
		description: "",
		callback: cmdPokedex
	}
];

export const commands = new Map<string, CLICommand>();

for (const cmd of cmds) commands.set(cmd.name, cmd);
