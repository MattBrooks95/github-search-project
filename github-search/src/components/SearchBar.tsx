import { ReactElement } from "react";
import { RateLimit } from "../communication/apiTypes";
import "./SearchBar.css"

type SearchBarProps = {
	searchButton: ReactElement;
	searchField: ReactElement;
	rateLimit?: RateLimit;
}
export function SearchBar(props: SearchBarProps) {
	return (
	<div className="SearchBar-layout flex-col">
		<div className="search-bar flex-row">
			{props.searchField}
			{props.searchButton}
		</div>
		{props.rateLimit !== undefined && <div className="rate-limit flex-row">
			{[
				["Max Requests", props.rateLimit.maxRequests],
				["Used requests", props.rateLimit.usedRequests],
				["Requests Remaining", props.rateLimit.remainingRequests],
				["Time till reset", props.rateLimit.timeTillReset],
			].map(x => <div key={x[0]}>{x[0]}:{x[1]}</div>)}
		</div>}
	</div>
	);
}
