// @ts-nocheck

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

function Mapbox() {
	const mapRef = useRef();

	const mapContainerRef = useRef();

	useEffect(() => {
		mapboxgl.accessToken =
			'pk.eyJ1IjoiamNvdXJ0bmVyOTciLCJhIjoiY203aG81cDhiMGs3NjJrb2o4bmxzZ2RvNSJ9.n1R4Gb6JcIkB5PojKA-Caw';
		mapRef.current = new mapboxgl.Map({
			container: mapContainerRef.current,
			center: [-74.0242, 40.6941],
			zoom: 10.12,
		});

		return () => {
			mapRef.current.remove();
		};
	}, []);
	return (
		<>
			<div id='map-container' ref={mapContainerRef} className='mapbox-map' />{' '}
		</>
	);
}

export default Mapbox;
