import { ReactElement } from "react";
import "./SearchBar.css"

type SearchBarProps = {
	searchButton: ReactElement;
	searchField: ReactElement;
}
export function SearchBar(props: SearchBarProps) {
	return (<div className="SearchBar-layout flex-row">
	{props.searchField}
	{props.searchButton}
	</div>);
}
