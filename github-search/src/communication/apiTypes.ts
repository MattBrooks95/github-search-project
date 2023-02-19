export type {
	Item,
	Owner,
	Repository,
	CodeSearchResults,
	RateLimit,
	ApiResources,
	Error,
}

export {
	initialCodeSearchResults,
	isError,
}

type HtmlUrl = {
	html_url: string;
}

type Repository = HtmlUrl & {
	full_name: string;
}

type Owner = {
	name: string;
	email: string;
	avatar_url: string;
	repos_url: string;
}

type Item = HtmlUrl & {
	name: string;
	path: string;
	url: string;
	repository: Repository;
	text_matches?: TextMatches[];
}

type Match = {
	text: string;
	indices: number[];
}

type TextMatches = {
	fragment: string;
	matches: Match[];
}

type CodeSearchResults = {
	total_count: number;
	incomplete_results: boolean;
	items: Item[];
	nextLink?: string;
	prevLink?: string;
}

function initialCodeSearchResults(): CodeSearchResults {
	return {
		total_count: 0,
		incomplete_results: false,
		items: [],
	}
}

type ApiResources = {
	resources: {
		search: LimitInfo;
	}
}

type LimitInfo = {
	limit: number;
	remaining: number;
	reset: number;
	used: number;
}

type RateLimit = {
	maxRequests: number | null;
	remainingRequests: number | null;
	usedRequests: number | null;
	timeTillReset: number | null;
}

function isError(x: any): x is Error {
	return (x as Error).message !== undefined;
}
type Error = {
	message: string;
}
