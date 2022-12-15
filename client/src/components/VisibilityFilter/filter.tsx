import { filterChange } from "./filterReducer";
import { useAppDispatch } from "../../store";

const VisibilityFilter = () => {
	const dispatch = useAppDispatch();

	return (
		<div>
			all
			<input
				type="radio"
				name="filter"
				onChange={() => dispatch(filterChange("ALL"))}
			/>
			important
			<input
				type="radio"
				name="filter"
				onChange={() => dispatch(filterChange("IMPORTANT"))}
			/>
			nonimportant
			<input
				type="radio"
				name="filter"
				onChange={() => dispatch(filterChange("NONIMPORTANT"))}
			/>
		</div>
	);
};

export default VisibilityFilter;
