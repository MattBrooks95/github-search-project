export type {
	Item,
	Owner,
	Repository,
	CodeSearchResults,
	CodeSearchResultsMatches
}

export {
	initialCodeSearchResults,
}

type Repository = {
	full_name: string;
}

type Owner = {
	name: string;
	email: string;
	avatar_url: string;
	repos_url: string;
}

type Item = {
	name: string;
	path: string;
	url: string;
	repository: Repository;
}

type Match = {
	text: string;
	indices: number[];
}

type TextMatches = {
	fragment: string;
	matches: Match[];
}

type CodeSearchResultsMatches = CodeSearchResults & {
	text_matches: TextMatches[];
}

type CodeSearchResults = {
	total_count: number;
	incomplete_results: boolean;
	items: Item[];
}

function initialCodeSearchResults(): CodeSearchResultsMatches {
	return {
		total_count: 0,
		incomplete_results: false,
		items: [],
		text_matches: [],
	}
}
