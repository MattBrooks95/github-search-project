import { buildUrl, encodeQuery } from "./apiHelpers";
import { ApiResources, CodeSearchResults, RateLimit } from "./apiTypes";
import { defaultValTo } from "./apiHelpers";
import { exceedsCharacterLimit } from "../validation/SearchValidation";

export {
	search,
	getResources,
}

const searchCodeUrl = buildUrl(['search', 'code']);

const rateLimitUrl = buildUrl(['rate_limit']);

function isFreshSearch(x: SearchMethod): x is FreshSearch {
	return (x as FreshSearch).searchString !== undefined;
}
type FreshSearch = {
	searchString: string;
}

function isPaginationSearch(x: SearchMethod): x is PaginationSearch {
	return (x as PaginationSearch).searchLink !== undefined;
}
type PaginationSearch = {
	searchLink: string;
}

type SearchMethod = FreshSearch | PaginationSearch;

/**
* search the github api
* @param searchMethod the keywords for the github search api
* @param perPage force pagination by setting a small per page value, defaults to 2
**/
async function search(searchMethod: SearchMethod, perPage: number = 2): Promise<CodeSearchResults | Error | null> {
	if (isPaginationSearch(searchMethod)) {
		return searchUrl(searchMethod.searchLink);
	} else if (isFreshSearch(searchMethod)) {
		if (exceedsCharacterLimit(searchMethod.searchString)) return null;
		const url = searchCodeUrl(`?per_page=${perPage}`+encodeQuery(searchMethod.searchString));
		return searchUrl(url);
	} else {
		console.error(`GitHubApi::search bad search method`, searchMethod);
		return null;
	}
}

async function searchUrl(url: string): Promise<CodeSearchResults | Error | null> {
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
		const link = res.headers.get("link");
		console.log(link);
		const {prevUrl, nextUrl} = getLinkUrls(link);
		console.log({ link, nextUrl, prevUrl });
		const parseNumberWithDefaultToNull = (x: any) => defaultValTo(x, null, (y) => Number.parseInt(y, 10));
		return res.json().then(jsonResult => {
			const timeTillReset = defaultValTo(reset, 0, x => Number.parseInt(x) - (Math.floor(new Date().getTime() / 1000)));
			console.log(jsonResult)
			return Object.assign(
				{},
				jsonResult as CodeSearchResults,
				{
					rateLimit: {
						maxRequests: parseNumberWithDefaultToNull(limit),
						remainingRequests: parseNumberWithDefaultToNull(remaining),
						usedRequests: parseNumberWithDefaultToNull(used),
						timeTillReset,
					} as RateLimit,
					nextLink: nextUrl,
					prevLink: prevUrl,
				}
			);
		});
	}).catch(e => {
		console.error(e);
		return null;
	});
}

/**
* get the current rate limit information
**/
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

function getLinkUrls(link: string | null): {
	prevUrl: string | undefined;
	nextUrl: string | undefined;
} {
	if (link === null) {
		return {
			nextUrl: undefined,
			prevUrl: undefined,
		}
	}
	const nextUrlMatches = link.match(/<(\S+)>; rel="next"/);
	const prevUrlMatches = link.match(/<(\S+)>; rel="prev"/);

	return {
		nextUrl: nextUrlMatches !== null && nextUrlMatches.length > 0 ? nextUrlMatches[0] : undefined,
		prevUrl: prevUrlMatches !== null && prevUrlMatches.length > 0 ? prevUrlMatches[0] : undefined,
	}
}
