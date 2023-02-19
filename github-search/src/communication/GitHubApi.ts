import { buildUrl, encodeQuery } from "./apiHelpers";
import { CodeSearchResultsMatches } from "./apiTypes";

export {
	search
}

const searchCodeUrl = buildUrl(['search', 'code']);

async function search(searchString: string): Promise<CodeSearchResultsMatches | null> {
	const url = searchCodeUrl(encodeQuery(searchString));
	console.log(url);
	const headers = new Headers();
	headers.set("Accept", "application/vnd.github.text-match+json");
	return fetch(
		url,
		{
			method: "GET",
			headers,
		}
	).then(res => res.json())
	.catch(e => {
		console.error(e);
		return null;
	});
}
