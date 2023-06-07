import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface Trip {
	tripID: string;
	distance: string;
	fare: string;
	isSelected: boolean;
	positionStart: google.maps.LatLng | google.maps.LatLngLiteral;
	positionEnd: google.maps.LatLng | google.maps.LatLngLiteral;
}

type MapState = {
	trips: Trip[];
};

const initialState: MapState = {
	trips: [
		{
			tripID: "123",
			distance: "12.06",
			fare: "25.93",
			positionStart: { lat: 43.051083, lng: -89.55101 },
			positionEnd: { lat: 43.0699, lng: -89.391045 },
			isSelected: false,
		},
		{
			tripID: "456",
			distance: "6.75",
			fare: "14.98",
			positionStart: { lat: 43.0073, lng: -89.39488 },
			positionEnd: { lat: 43.07459, lng: -89.38027 },
			isSelected: false,
		},
		{
			tripID: "789",
			distance: "5.71",
			fare: "15.98",
			positionStart: { lat: 43.075523, lng: -89.38724 },
			positionEnd: { lat: 43.007923, lng: -89.3957 },
			isSelected: false,
		},
		{
			tripID: "321",
			distance: "11.18",
			fare: "25.94",
			positionStart: { lat: 43.13598, lng: -89.34663 },
			positionEnd: { lat: 43.00785, lng: -89.3956 },
			isSelected: false,
		},
	],
};

export interface ITrip {
	tripID: string;
}

const mapSlice = createSlice({
	name: "map",
	initialState: initialState,
	reducers: {
		resetTrips: () => initialState,
		selectTrip: (state, action: PayloadAction<ITrip>) => {
			let tripInList = state.trips.find(
				(item) => item.tripID === action.payload.tripID
			);
			if (tripInList) {
				tripInList.isSelected = !tripInList.isSelected;
			}
		},
	},
});

export const selectTrips = (state: RootState): Trip[] => {
	return state.map.trips;
};

/**
 * This statement exports the reducer function as the default export of the module,
 * so it can be imported by other parts of the codebase. In this specific case,
 * it is used by the Redux store to manage the state of the shopping cart.
 */
export default mapSlice.reducer;
/**
    Destructures the actions object from the shoppingCartSlice slice and
    assigns the addToCart, removeItem, and setCart action creators to
    constants. These constants can be used to dispatch these actions from
    components or other parts of the Redux store.
    */
export const { selectTrip } = mapSlice.actions;
