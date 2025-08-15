import { PokeCache } from "./PokeCache.js";

export class PokeAPI {
	private static readonly baseURL = "https://pokeapi.co/api/v2";

	#cache = new PokeCache(1000 * 60 * 5); // 5 minutes

	async fetchLocations() {
		return this.baseRequest<NamedAPIResourceList>(PokeAPI.baseURL + Endpoints.Location);
	}

	async fetchLocation(id: string | number) {
		return this.baseRequest<Location>(PokeAPI.baseURL + Endpoints.Location + id);
	}

	async fetchLocationAreas(url?: string) {
		return this.baseRequest<NamedAPIResourceList>(url ? url : PokeAPI.baseURL + Endpoints.LocationArea);
	}

	async fetchLocationArea(id: string | number) {
		return this.baseRequest<LocationArea>(PokeAPI.baseURL + Endpoints.LocationArea + id);
	}

	async fetchPokemon(id: string | number) {
		return this.baseRequest<Pokemon>(PokeAPI.baseURL + Endpoints.Pokemon + id);
	}

	async baseRequest<T>(url: string): Promise<T> {
		try {
			const cached = this.#cache.get<T>(url);

			if (cached) return cached;

			const response = await fetch(url);

			if (!response.ok) throw new Error("PokeAPI: Failed to fetch");

			const data = await response.json();

			this.#cache.add<T>(url, data);

			return data as T;
		} catch (error) {
			if (error instanceof Error) throw error.message;
			throw `PokeAPI: ${error}`;
		}
	}
}

export const enum Endpoints {
	Location = "/location/",
	LocationArea = "/location-area/",
	Pokemon = "/pokemon/"
}

export type Location = {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** The region this location can be found in */
	region: NamedAPIResource;
	/** The name of this resource listed in different languages */
	names: Name[];
	/** A list of game indices relevent to this location by generation */
	game_indices: GenerationGameIndex[];
	/** Areas that can be found within this location */
	areas: NamedAPIResource[];
};

export type LocationArea = {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** The internal id of an API resource within game data */
	game_index: number;
	/** A list of methods in which Pokémon may be encountered in this area and how likely the method will occur depending on the version of the game */
	encounter_method_rates: EncounterMethodRate;
	/** The region this location area can be found in */
	location: NamedAPIResource;
	/** The name of this resource listed in different languages */
	names: Name[];
	/** A list of Pokémon that can be encountered in this area along with version specific details about the encounter */
	pokemon_encounters: PokemonEncounter[];
};

export type NamedAPIResource = {
	/** The name of the referenced resource */
	name: string;
	/** The URL of the referenced resource */
	url: string;
};

export type Name = {
	/** The localized name for an API resource in a specific language */
	name: string;
	/** The language this name is in */
	language: NamedAPIResource;
};

export type GenerationGameIndex = {
	/** The internal id of an API resource within game data */
	game_index: number;
	/** The generation relevent to this game index */
	generation: NamedAPIResource;
};

export type EncounterMethodRate = {
	/** The method in which Pokémon may be encountered in an area */
	encounter_method: NamedAPIResource;
	/** The chance of the encounter to occur on a version of the game */
	version_details: EncounterVersionDetails[];
};

export type EncounterVersionDetails = {
	/** The chance of an encounter to occur */
	rate: number;
	/** The version of the game in which the encounter can occur with the given chance */
	version: NamedAPIResource;
};

export type PokemonEncounter = {
	/** The Pokémon being encountered */
	pokemon: NamedAPIResource;
	/** A list of versions and encounters with Pokémon that might happen in the referenced location area */
	version_details: VersionEncounterDetail[];
};

export type VersionEncounterDetail = {
	/** The game version this encounter happens in */
	version: NamedAPIResource;
	/** The total percentage of all encounter potential */
	max_chance: number;
	/** A list of encounters and their specifics */
	encounter_details: Encounter[];
};

/** Information of a pokemon encounter */
export type Encounter = {
	/** The lowest level the Pokémon could be encountered at */
	min_level: number;
	/** The highest level the Pokémon could be encountered at */
	max_level: number;
	/** A list of condition values that must be in effect for this encounter to occur */
	condition_values: NamedAPIResource[];
	/** Percent chance that this encounter will occur */
	chance: number;
	/** The method by which this encounter happens */
	method: NamedAPIResource;
};

export type NamedAPIResourceList = {
	/** The total number of resources available from this API */
	count: number;
	/** The URL for the next page in the list */
	next: string | null;
	/** The URL for the previous page in the list */
	previous: string | null;
	/** A list of named API resources */
	results: NamedAPIResource[];
};

export type Pokemon = {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** The base experience gained for defeating this Pokémon */
	base_experience: number;
	/** The height of this Pokémon in decimetres */
	height: number;
	/** Set for exactly one Pokémon used as the default for each species */
	is_default: boolean;
	/** Order for sorting. Almost national order, except families are grouped together */
	order: number;
	/** The weight of this Pokémon in hectograms */
	weight: number;
	/** A list of abilities this Pokémon could potentially have */
	abilities: PokemonAbility[];
	/** A list of forms this Pokémon can take on */
	forms: NamedAPIResource[];
	/** A list of game indices relevent to Pokémon item by generation */
	game_indices: VersionGameIndex[];
	/** A list of items this Pokémon may be holding when encountered */
	held_items: PokemonHeldItem[];
	/** A link to a list of location areas, as well as encounter details pertaining to specific versions */
	location_area_encounters: string;
	/** A list of moves along with learn methods and level details pertaining to specific version groups */
	moves: PokemonMove[];
	/** A set of sprites used to depict this Pokémon in the game. */
	sprites: PokemonSprites;
	/** A set of cries used to depict this Pokémon in the game. */
	cries: PokemonCries;
	/** The species this Pokémon belongs to */
	species: NamedAPIResource;
	/** A list of base stat values for this Pokémon */
	stats: PokemonStat[];
	/** A list of details showing types this Pokémon has */
	types: PokemonType[];
	/** Data describing a Pokemon's types in a previous generation. */
	past_types: PokemonPastType[];
};

export type PokemonCries = {
	/** The legacy depiction of this Pokémon's cry. */
	legacy: string;
	/** The latest depiction of this Pokémon's cry. */
	latest: string;
};

export type PokemonAbility = {
	/** Whether or not this is a hidden ability */
	is_hidden: boolean;
	/** The slot this ability occupies in this Pokémon species */
	slot: number;
	/** The ability the Pokémon may have */
	ability: NamedAPIResource;
};

export type PokemonType = {
	/** The order the Pokémon's types are listed in */
	slot: number;
	/** The type the referenced Pokémon has */
	type: NamedAPIResource;
};

export type VersionGameIndex = {
	/** The internal id of an API resource within game data */
	game_index: number;
	/** The version relevent to this game index */
	version: NamedAPIResource;
};

export type PokemonHeldItem = {
	/** The item the referenced Pokémon holds */
	item: NamedAPIResource;
	/** The details of the different versions in which the item is held */
	version_details: PokemonHeldItemVersion[];
};

export type PokemonMove = {
	/** The move the Pokémon can learn */
	move: NamedAPIResource;
	/** The details of the version in which the Pokémon can learn the move */
	version_group_details: PokemonMoveVersion[];
};

/**
 * The details of the version in which the Pokémon can learn the move
 */
export type PokemonMoveVersion = {
	/** The method by which the move is learned */
	move_learn_method: NamedAPIResource;
	/** The version group in which the move is learned */
	version_group: NamedAPIResource;
	/** The minimum level to learn the move */
	level_learned_at: number;
};

export type PokemonSprites = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny female depiction of this Pokémon from the front in battle */
	front_shiny_female: string | null;
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The female depiction of this Pokémon from the back in battle */
	back_female: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	back_shiny_female: string | null;
	/** Dream World, Official Artwork and Home sprites */
	other?: OtherPokemonSprites;
	/** Version Sprites of this Pokémon */
	versions: VersionSprites;
};

/** Other Pokemon Sprites (Dream World and Official Artwork sprites) */
export type OtherPokemonSprites = {
	/** Dream World Sprites of this Pokémon */
	dream_world: DreamWorld;
	/** Official Artwork Sprites of this Pokémon */
	"official-artwork": OfficialArtwork;
	/** Home Artwork Sprites of this Pokémon */
	home: Home;
	/** Pokemon Showdown animated sprites of this Pokémon */
	showdown: Showdown;
};

export type DreamWorld = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
};

/** Official Artwork sprites */
export type OfficialArtwork = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
};

/** Home sprites */
export type Home = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the front in battle */
	front_shiny_female: string | null;
};

/** Showdown Sprites */
export type Showdown = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the front in battle */
	front_shiny_female: string | null;
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The female depiction of this Pokémon from the back in battle */
	back_female: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	back_shiny_female: string | null;
};

export type PokemonStat = {
	/** The stat the Pokémon has */
	stat: NamedAPIResource;
	/** The effort points (EV) the Pokémon has in the stat */
	effort: number;
	/** The base value of the stat */
	base_stat: number;
};

export type PokemonPastType = {
	/** The generation of this Pokémon Type. */
	generation: NamedAPIResource;
	/** Types this of this Pokémon in a previos generation. */
	types: PokemonType[];
};

export type PokemonHeldItemVersion = {
	/** The version in which the item is held */
	version: NamedAPIResource;
	/** How often the item is held */
	rarity: number;
};

export type VersionSprites = {
	/** Generation-I Sprites of this Pokémon */
	"generation-i": GenerationISprites;
	/** Generation-II Sprites of this Pokémon */
	"generation-ii": GenerationIISprites;
	/** Generation-III Sprites of this Pokémon */
	"generation-iii": GenerationIIISprites;
	/** Generation-IV Sprites of this Pokémon */
	"generation-iv": GenerationIVSprites;
	/** Generation-V Sprites of this Pokémon */
	"generation-v": GenerationVSprites;
	/** Generation-VI Sprites of this Pokémon */
	"generation-vi": GenerationVISprites;
	/** Generation-VII Sprites of this Pokémon */
	"generation-vii": GenerationVIISprites;
	/** Generation-VIII Sprites of this Pokémon */
	"generation-viii": GenerationVIIISprites;
};

export type GenerationISprites = {
	/** Red-blue sprites of this Pokémon */
	"red-blue": RedBlue;
	/** Yellow sprites of this Pokémon  */
	yellow: Yellow;
};

/** Red/Blue Sprites */
export type RedBlue = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The gray depiction of this Pokémon from the back in battle */
	back_gray: string | null;
	/** The transparent depiction of this Pokémon from the back in battle */
	back_transparent: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The gray depiction of this Pokémon from the front in battle */
	front_gray: string | null;
	/** The transparent depiction of this Pokémon from the front in battle */
	front_transparent: string | null;
};

/** Yellow sprites */
export type Yellow = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The gray depiction of this Pokémon from the back in battle */
	back_gray: string | null;
	/** The transparent depiction of this Pokémon from the back in battle */
	back_transparent: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The gray depiction of this Pokémon from the front in battle */
	front_gray: string | null;
	/** The transparent depiction of this Pokémon from the front in battle */
	front_transparent: string | null;
};

/** Generation-II Sprites */
export type GenerationIISprites = {
	/** Crystal sprites of this Pokémon */
	crystal: Crystal;
	/** Gold sprites of this Pokémon */
	gold: Gold;
	/** Silver sprites of this Pokémon */
	silver: Silver;
};

/** Crystal sprites */
export type Crystal = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The back shiny transparent depiction of this Pokémon from the back in battle */
	back_shiny_transparent: string | null;
	/** The transparent depiction of this Pokémon from the back in battle */
	back_transparent: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The front shiny transparent depiction of this Pokémon from the front in battle */
	front_shiny_transparent: string | null;
	/** The transparent depiction of this Pokémon from the front in battle */
	front_transparent: string | null;
};

export type Gold = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The transparent depiction of this Pokémon from the front in battle */
	front_transparent: string | null;
};

/** Silver sprites */
export type Silver = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The transparent depiction of this Pokémon from the front in battle */
	front_transparent: string | null;
};

/** Generation-III Sprites */
export type GenerationIIISprites = {
	/** Emerald sprites of this Pokémon */
	emerald: Emerald;
	/** Firered-Leafgreen sprites of this Pokémon */
	"firered-leafgreen": FireredLeafgreen;
	/** Ruby-Sapphire sprites of this Pokémon */
	"ruby-sapphire": RubySapphire;
};

/** Emerald sprites */
export type Emerald = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
};

/** FireRead LeafGreen sprites  */
export type FireredLeafgreen = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
};

/** Ruby/Sapphire sprites */
export type RubySapphire = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
};

/** Generation-IV Sprites */
export type GenerationIVSprites = {
	/** Diamond-pearl Generation sprites of this Pokémon */
	"diamond-pearl": DiamondPearl;
	/** Heartgold-Soulsilver sprites of this Pokémon */
	"heartgold-soulsilver": HeartgoldSoulsilver;
	/** Platinum sprites of this Pokémon */
	platinum: Platinum;
};

export type DiamondPearl = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The female depiction of this Pokémon from the back in battle */
	back_female: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	back_shiny_female: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	front_shiny_female: string | null;
};

export type HeartgoldSoulsilver = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The female depiction of this Pokémon from the back in battle */
	back_female: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	back_shiny_female: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	front_shiny_female: string | null;
};

export type Platinum = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The female depiction of this Pokémon from the back in battle */
	back_female: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	back_shiny_female: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	front_shiny_female: string | null;
};

/** Generation-V Sprites */
export type GenerationVSprites = {
	/** Black-white sprites of this Pokémon */
	"black-white": BlackWhite;
};

/** Black/White sprites */
export type BlackWhite = {
	/** The animated sprite of this pokémon */
	animated: Animated;
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The female depiction of this Pokémon from the back in battle */
	back_female: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	back_shiny_female: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	front_shiny_female: string | null;
};
export type Animated = {
	/** The default depiction of this Pokémon from the back in battle */
	back_default: string | null;
	/** The shiny depiction of this Pokémon from the back in battle */
	back_shiny: string | null;
	/** The female depiction of this Pokémon from the back in battle */
	back_female: string | null;
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	back_shiny_female: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	front_shiny_female: string | null;
};

/** Generation-VI Sprites */
export type GenerationVISprites = {
	/** Omegaruby-Alphasapphire sprites of this Pokémon */
	"omegaruby-alphasapphire": OmegarubyAlphasapphire;
	/** X-Y sprites of this Pokémon */
	"x-y": XY;
};

/** Omega/Ruby Alpha/Sapphire sprites */
export type OmegarubyAlphasapphire = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	front_shiny_female: string | null;
};

/** XY sprites */
export type XY = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	front_shiny_female: string | null;
};

/** Generation-VII Sprites */
export type GenerationVIISprites = {
	/** Icon sprites of this Pokémon */
	icons: GenerationViiIcons;
	/** Ultra-sun-ultra-moon sprites of this Pokémon */
	"ultra-sun-ultra-moon": UltraSunUltraMoon;
};

/** Generation VII icons */
export type GenerationViiIcons = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
};

/** Ultra Sun Ultra Moon sprites */
export type UltraSunUltraMoon = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
	/** The shiny depiction of this Pokémon from the front in battle */
	front_shiny: string | null;
	/** The shiny female depiction of this Pokémon from the back in battle */
	front_shiny_female: string | null;
};

/** Generation-VIII Sprites */
export type GenerationVIIISprites = {
	/** Icon sprites of this Pokémon */
	icons: GenerationViiiIcons;
};

/** Generation VIII icons */
export type GenerationViiiIcons = {
	/** The default depiction of this Pokémon from the front in battle */
	front_default: string | null;
	/** The female depiction of this Pokémon from the front in battle */
	front_female: string | null;
};
