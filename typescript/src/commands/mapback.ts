import { State } from "../state.js";

export async function cmdMapBack(state: State) {
	const areas = await state.api.fetchLocationAreas(state.prevLocationURL || undefined);

	for (const result of areas.results) {
		console.log(result.name);
	}

	if (areas.next) state.nextLocationURL = areas.next;
	if (areas.previous) state.prevLocationURL = areas.previous;
}
