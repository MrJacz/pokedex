export type CacheEntry<T> = {
	createdAt: number;
	value: T;
};

export class PokeCache {
	#cache = new Map<string, CacheEntry<unknown>>();
	#reapIntervalId: NodeJS.Timeout | null = null;
	#interval: number;

	constructor(interval: number) {
		this.#interval = interval;
		this.#startReapLoop();
	}

	add<T>(key: string, value: T) {
		const entry: CacheEntry<T> = {
			value,
			createdAt: Date.now()
		};
		return this.#cache.set(key, entry);
	}

	get<T>(key: string): T | undefined {
		const val = this.#cache.get(key);
		return val ? (val.value as T) : undefined;
	}

	stopReapLoop() {
		if (this.#reapIntervalId) {
			clearInterval(this.#reapIntervalId);
			this.#reapIntervalId = null;
		}
	}

	#reap() {
		const now = Date.now();
		for (const [key, val] of this.#cache) {
			if (now - val.createdAt > this.#interval) this.#cache.delete(key);
		}
	}

	#startReapLoop() {
		this.#reapIntervalId = setInterval(this.#reap.bind(this), this.#interval);
	}
}
