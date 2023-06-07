import { Col, Container, Row } from "react-bootstrap";
// import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from "react-icons/fa";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import MapList from "./mapList";
import { selectTrip, selectTrips } from "../../store/map";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";

const containerStyle = {
	height: "50vh",
	width: "100%",
};

const Map = () => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();
	// Reference to shopping cart
	const trips = useSelector(selectTrips);

	const center = {
		lat: 43.0722,
		lng: -89.4008,
	};

	return (
		<Container id="map" className="content-container mb-3 py-3 px-3">
			<Row className="align-items-center justify-content-center">
				<Col xs={12} md={9}>
					<LoadScript googleMapsApiKey="">
						<GoogleMap
							id="marker-example"
							mapContainerStyle={containerStyle}
							center={center}
							zoom={10}
						>
							{/* Only works in production mode!
							https://github.com/JustFly1984/react-google-maps-api/issues/2978
							Child components, such as markers, info windows, etc. */}
							{trips.map(
								({ tripID, positionStart, isSelected }) => {
									if (isSelected) {
										console.log("selected start:", tripID);
										return (
											<Marker
												position={positionStart}
												key={tripID + "start"}
												onClick={() => {
													dispatch(
														selectTrip({
															tripID: tripID,
														})
													);
												}}
											/>
										);
									} else {
										console.log("non start:", tripID);
										return (
											<Marker
												position={positionStart}
												key={tripID + "start"}
												opacity={0.5}
												onClick={() => {
													dispatch(
														selectTrip({
															tripID: tripID,
														})
													);
												}}
											/>
										);
									}
								}
							)}
							{trips.map(
								({ tripID, positionEnd, isSelected }) => {
									if (isSelected) {
										console.log("selected end:", tripID);
										return (
											<Marker
												position={positionEnd}
												key={tripID}
												onClick={() => {
													dispatch(
														selectTrip({
															tripID: tripID,
														})
													);
												}}
											/>
										);
									} else {
										console.log("non end:", tripID);
										return (
											<Marker
												position={positionEnd}
												key={tripID}
												opacity={0.5}
												onClick={() => {
													dispatch(
														selectTrip({
															tripID: tripID,
														})
													);
												}}
											/>
										);
									}
								}
							)}
						</GoogleMap>
					</LoadScript>
				</Col>
				<Col xs={12} md={3}>
					<MapList />
				</Col>
			</Row>
		</Container>
	);
};

export default Map;
