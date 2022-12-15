import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Typescript + Redux wants an explicit state type and initialization for correct type inferrence
// https://redux-toolkit.js.org/usage/usage-with-typescript#defining-the-initial-state-type
type FilterState = {
	filter: string;
};

const initialState: FilterState = {
	filter: "ALL",
};

const filterSlice = createSlice({
	name: "filter",
	initialState,
	reducers: {
		setFilter(state, action: PayloadAction<string>) {
			state.filter = action.payload;
		},
	},
});

export const filterChange = (payload: string) => {
	return {
		type: "filter/setFilter",
		payload,
	};
};

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
