import { ListGroup } from "react-bootstrap";
import { selectTrip, selectTrips } from "../../store/map";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";

// Define the ShoppingCart component
const MapList = () => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();
	// Reference to shopping cart
	// Reference to shopping cart
	const trips = useSelector(selectTrips);

	return (
		<ListGroup>
			{trips.map(({ tripID, distance, fare, isSelected }) => {
				return (
					<ListGroup.Item
						variant="light"
						key={tripID}
						action
						active={isSelected}
						onClick={() => {
							dispatch(selectTrip({ tripID: tripID }));
						}}
					>
						Distance: {distance} Fare: {fare}
					</ListGroup.Item>
				);
			})}
		</ListGroup>
	);
};

export default MapList;
