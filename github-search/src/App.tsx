import { Button, InputLabel, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import { ApiResources, CodeSearchResults, initialCodeSearchResults, isError } from './communication/apiTypes';
import { getResources, search } from './communication/GitHubApi';
import { SearchBar } from './components/SearchBar';
import { SearchResultItem } from './components/SearchResultItem';
import './css/common.css';

function App() {
	const [searchString, setSearchString] = useState<string>("map \\(\\ repo:MattBrooks95/advent-of-code");

	const [searchResults, setSearchResults] = useState<CodeSearchResults | Error>(initialCodeSearchResults);
	const [rateState, setRateState] = useState<ApiResources | null>(null);

	const [resultsPerPage, setResultsPerPage] = useState(5);

	const [searchDisabled, setSearchDisabled] = useState<boolean>(false);

	const searchEntryField = <TextField size="small" sx={{backgroundColor: "white"}} value={searchString} onChange={(e) => setSearchString(e.target.value)}></TextField>;

	async function doPaginateSearch(url: string) {
		const searchResult = await search({searchLink: url});
		if (searchResult !== null) setSearchResults(searchResult);
	}

	async function doSearch() {
		//need a condition to disallow submitting a search when we are over the rate limit
		const searchResult = await search({searchString}, resultsPerPage);
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

	const newPerPageValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVal = Number.parseInt(e.target.value, 10);
		if (Number.isNaN(newVal) || newVal <= 0) return 0;
		setResultsPerPage(newVal);
	};

	return (
		<div className="app-layout fill-parent flex-col">
		<SearchBar
			searchField={searchEntryField}
			searchButton={<Button disabled={rateState !== null && rateState.resources.search.remaining === 0} variant="contained" onClick={doSearch}>Search</Button>}
			rateLimit={rateState}
			//perPageControl={<div style={{backgroundColor: "white", padding: "6px",}}><TextField size="small" variant="outlined" label="Results per page" type="number" value={resultsPerPage} onChange={newPerPageValue} /></div>}
			perPageControl={<div style={{backgroundColor: "white", padding: "6px",}}><TextField size="small" variant="outlined" label="Results per page" type="number" value={resultsPerPage} onChange={newPerPageValue} /></div>}
			/>
			<div className="flex-row">
			
			{!isError(searchResults) && searchResults.prevLink !== undefined && <Button variant="contained" onClick={() => doPaginateSearch(searchResults.prevLink as string)}>Prev Page</Button>}
			{!isError(searchResults) && searchResults.nextLink !== undefined && <Button variant="contained" onClick={() => doPaginateSearch(searchResults.nextLink as string)}>Next Page</Button>}
			</div>
			<div className="results">
			{isError(searchResults)
				? <div>{searchResults.message}</div>
				: searchResults.items !== undefined && searchResults.items.map((i, idx) => <SearchResultItem key={idx} item={i} />)}
			</div>
		</div>
	)
}

export default App
