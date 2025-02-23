// import { useState } from 'react';
// import { Route, Routes, useNavigate } from 'react-router-dom';
// import Test from './pages/Test';
// import Header from './components/header';
// @ts-nocheck

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
// import Mapbox from './components/map';

// const Button = () => {
// 	const navigate = useNavigate();

// 	const handleClick = () => {
// 		navigate('/');
// 	};

// 	return (
// 		<button
// 			onClick={handleClick}
// 			style={{
// 				padding: '10px 20px',
// 				fontSize: '16px',
// 				cursor: 'pointer',
// 				outline: 'none',
// 				border: '2px solid green',
// 				borderRadius: '4px',
// 				marginTop: '16px',
// 				marginBottom: '16px',
// 			}}
// 		>
// 			Go to Home
// 		</button>
// 	);
// };

function App() {
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
			<div id='map-container' ref={mapContainerRef} />
		</>
	);
}

export default App;
