import { Container } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import { FaRegArrowAltCircleDown } from "react-icons/fa";

const Map = () => {
	const defaultProps = {
		center: {
			lat: 43.051083,
			lng: -89.55101,
		},
		zoom: 11,
	};

	return (
		<Container id="map" className="content-container mb-3 py-3 px-3">
			<div style={{ height: "50vh", width: "100%" }}>
				<GoogleMapReact
					bootstrapURLKeys={{ key: "" }}
					defaultCenter={defaultProps.center}
					defaultZoom={defaultProps.zoom}
				>
					<Marker lat={43.0699} lng={-89.391045} />
				</GoogleMapReact>
			</div>
		</Container>
	);
};

interface markerProps {
	lat: number;
	lng: number;
}

const Marker = (_props: markerProps) => {
	return (
		<div>
			<FaRegArrowAltCircleDown size={"2em"} color="white" />
		</div>
	);
};

export default Map;
