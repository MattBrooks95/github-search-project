export {
	CodeFragment,
}

type CodeFragmentProps = {
	value: string;
}
function CodeFragment(props: CodeFragmentProps) {
	return (<code>
	{props.value}
	</code>);
}
