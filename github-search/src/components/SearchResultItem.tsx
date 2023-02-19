import { TextField } from "@mui/material";
import { Item } from "../communication/apiTypes";
import { CodeFragment } from "./CodeFragment";
import "./SearchResultItem.css"

export {
	SearchResultItem,
}

type SearchResultItemProps = {
	item: Item;

}

function SearchResultItem(props: SearchResultItemProps) {
	return (<div className="SearchResultItem-layout flex-col rounded-border">
	<div className="flex-row SearchResultItem-links">
		<a href={props.item.repository.html_url}><div className="rounded-border">{props.item.repository.full_name}</div></a>
	<a href={props.item.html_url}><div className="rounded-border">{props.item.name}</div></a>
	</div>
	<div className="code-fragments flex-col">
		{props.item.text_matches !== undefined && props.item.text_matches.map((x, idx) => <CodeFragment key={idx} value={x.fragment} />)}
	</div>
	</div>);
}
