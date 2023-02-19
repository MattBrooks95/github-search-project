import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import { ApiResources, CodeSearchResults, initialCodeSearchResults, RateLimit } from './communication/apiTypes';
import { getResources, search } from './communication/GitHubApi';
import { SearchBar } from './components/SearchBar';
import { SearchResultItem } from './components/SearchResultItem';
import './css/common.css';

function App() {
	const [searchString, setSearchString] = useState<string>("");

	const [searchResults, setSearchResults] = useState<CodeSearchResults>(initialCodeSearchResults);
	const [rateState, setRateState] = useState<ApiResources | null>(null);

	const [searchDisabled, setSearchDisabled] = useState<boolean>(false);

	const searchEntryField = <TextField sx={{backgroundColor: "white"}} value={searchString} onChange={(e) => setSearchString(e.target.value)}></TextField>;

	async function doSearch() {
		//need a condition to disallow submitting a search when we are over the rate limit
		const searchResult = await search(searchString, () => setSearchDisabled(false));
		console.log(searchResult);
		if (searchResult !== null) setSearchResults(searchResult);
	}

	function searchOnEnter(e: KeyboardEvent) {
		//console.log(`key: ${e.key}`);
		if (e.key === "Enter") {
			doSearch();
		}
	}

	useEffect(() => {
		document.addEventListener("keydown", searchOnEnter);
		return () => {
			document.removeEventListener("keydown", searchOnEnter);
		}
	});

	if (!searchDisabled
		&& rateState !== null
		&& rateState.resources.search.remaining !== undefined
		&& rateState.resources.search.remaining === 0) {
		setSearchDisabled(true);
	}

	useEffect(() => {
		let seconds = setInterval(
			async () => {
				const rateLimit: ApiResources | null = await getResources();
				if (rateLimit !== null) {
					setRateState(rateLimit);
				}
			},
			1000
		);
		return () => {
			clearInterval(seconds);
		}
	}, []);

	return (
		<div className="app-layout fill-parent flex-col">
		<SearchBar
			searchField={searchEntryField}
			searchButton={<Button disabled={rateState !== null && rateState.resources.search.remaining === 0} variant="contained" onClick={doSearch}>Search</Button>}
			rateLimit={rateState}
			/>
			{searchResults.items !== undefined && searchResults.items.map((i, idx) => <SearchResultItem key={idx} item={i} />)}
		</div>
	)
}

export default App
