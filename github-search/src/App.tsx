import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import { CodeSearchResults, initialCodeSearchResults } from './communication/apiTypes';
import { search } from './communication/GitHubApi';
import { SearchBar } from './components/SearchBar';
import { SearchResultItem } from './components/SearchResultItem';
import './css/common.css';

function App() {
	const [searchString, setSearchString] = useState<string>("");

	const [searchResults, setSearchResults] = useState<CodeSearchResults>(initialCodeSearchResults);

	const searchEntryField = <TextField sx={{backgroundColor: "white"}} value={searchString} onChange={(e) => setSearchString(e.target.value)}></TextField>;

	async function doSearch() {
		//need a condition to disallow submitting a search when we are over the rate limit
		if (!true) return;
		const searchResult = await search(searchString);
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

	return (
		<div className="app-layout fill-parent flex-col">
		<SearchBar
			searchField={searchEntryField}
			searchButton={<Button variant="contained" onClick={doSearch}>Search</Button>}
			/>
			{/*<div>{searchResults.text_matches !== undefined ? searchResults.text_matches.map(x => <div>{x.fragment}</div>) : "no text matches =("}</div>*/}
			{searchResults.items.map((i, idx) => <SearchResultItem key={idx} item={i} />)}
		</div>
	)
}

export default App
