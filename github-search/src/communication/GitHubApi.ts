import { buildUrl, encodeQuery } from "./apiHelpers";
import { ApiResources, CodeSearchResults, RateLimit } from "./apiTypes";
import { defaultValTo } from "./apiHelpers";

export {
	search,
	getResources,
}

const searchCodeUrl = buildUrl(['search', 'code']);

const rateLimitUrl = buildUrl(['rate_limit']);

let clearRateLimitTimer: number | undefined = undefined;

/**
* search the github api
* this has a side effect of starting the request limit timeout
* so you must provide a function to be ran when the request limit gets reset
* which will be called at the appropriate time
**/
async function search(searchString: string, onClearRateLimit: () => void): Promise<CodeSearchResults | null> {
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
		const parseNumberWithDefaultToNull = (x: any) => defaultValTo(x, null, (y) => Number.parseInt(y, 10));
		return res.json().then(jsonResult => {
			const timeTillReset = defaultValTo(reset, 0, x => Number.parseInt(x) - (Math.floor(new Date().getTime() / 1000)));
			if (clearRateLimitTimer !== undefined) clearTimeout(clearRateLimitTimer);
			setTimeout(onClearRateLimit, timeTillReset);
			
			return Object.assign(
				{},
				jsonResult as CodeSearchResults,
				{
					rateLimit: {
						maxRequests: parseNumberWithDefaultToNull(limit),
						remainingRequests: parseNumberWithDefaultToNull(remaining),
						usedRequests: parseNumberWithDefaultToNull(used),
						timeTillReset,
					} as RateLimit
				}
			);
		});
	}).catch(e => {
		console.error(e);
		return null;
	});
}

async function getResources(): Promise<ApiResources | null> {
	return fetch(
		rateLimitUrl(''),
		{
			method: "GET",
		},
	).then(res => res.json())
	.catch(e => {
		console.error(e);
		return null;
	});
}
