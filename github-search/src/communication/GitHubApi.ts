import { buildUrl, encodeQuery } from "./apiHelpers";
import { CodeSearchResults, RateLimit } from "./apiTypes";
import { defaultValTo } from "./apiHelpers";

export {
	search
}

const searchCodeUrl = buildUrl(['search', 'code']);

async function search(searchString: string): Promise<CodeSearchResults | null> {
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
	).then(res => {
		const limit = res.headers.get("x-ratelimit-limit");
		const remaining = res.headers.get("x-ratelimit-remaining");
		const used = res.headers.get("x-ratelimit-used");
		const reset = res.headers.get("x-ratelimit-reset");
		return res.json().then(jsonResult => {
			return Object.assign(
				{},
				jsonResult as CodeSearchResults,
				{
					rateLimit: {
						maxRequests: limit,
						remainingRequests: remaining,
						usedRequests: used,
						timeTillReset: defaultValTo(reset, 0, x => Number.parseInt(x) - (new Date().getTime() / 1000)),
					} as RateLimit
				}
			);
		});
	}).catch(e => {
		console.error(e);
		return null;
	});
}
