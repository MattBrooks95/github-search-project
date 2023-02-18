import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import { search } from './communication/GitHubApi';
import { SearchBar } from './components/SearchBar';
import './css/common.css';

function App() {
	const [searchString, setSearchString] = useState<string>("");

	const [searchResults, setSearchResults] = useState<string>("");

	const searchEntryField = <TextField sx={{backgroundColor: "white"}} value={searchString} onChange={(e) => setSearchString(e.target.value)}></TextField>;

	return (
		<div className="app-layout fill-parent flex-col">
		<SearchBar
			searchField={searchEntryField}
			searchButton={<Button variant="contained" onClick={async () => setSearchResults(await search(searchString))}>Search</Button>}
			/>
			<div>{searchResults}</div>
		</div>
	)
}

export default App
