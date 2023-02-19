import { ReactElement } from "react";
import { ApiResources, RateLimit } from "../communication/apiTypes";
import "./SearchBar.css"

type SearchBarProps = {
	searchButton: ReactElement;
	searchField: ReactElement;
	rateLimit: ApiResources | null;
}
export function SearchBar(props: SearchBarProps) {
	const calcTimeTillReset = (resetTimestamp: number) => Math.ceil(resetTimestamp - (new Date().getTime() / 1000));
	return (
	<div className="SearchBar-layout flex-col">
		<div className="search-bar flex-row">
			{props.searchField}
			{props.searchButton}
		</div>
		{props.rateLimit !== null && <div className="rate-limit flex-row">
			{[
				["Max Requests", props.rateLimit.resources.search.limit],
				["Used requests", props.rateLimit.resources.search.used],
				["Requests Remaining", props.rateLimit.resources.search.remaining],
				["Time till reset", calcTimeTillReset(props.rateLimit.resources.search.reset)],
			].map(x => <div key={x[0]}>{x[0]}:{x[1]}</div>)}
		</div>}
	</div>
	);
}
