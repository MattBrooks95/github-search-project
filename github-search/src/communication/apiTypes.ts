export type {
	Item,
	Owner,
	Repository,
	CodeSearchResults,
}

export {
	initialCodeSearchResults,
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
}

function initialCodeSearchResults(): CodeSearchResults {
	return {
		total_count: 0,
		incomplete_results: false,
		items: [],
	}
}
