import { buildUrl } from "./apiHelpers";

export {
	search
}

const searchCodeUrl = buildUrl(['search', 'code']);

async function search(searchString: string): Promise<string | null> {
	const url = searchCodeUrl(searchString);
	return fetch(
		url,
		{
			method: "GET",
		}
	).then(res => res.json())
	.catch(e => {
		console.error(e);
		return null;
	});
}
