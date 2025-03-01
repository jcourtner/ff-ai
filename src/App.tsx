// @ts-nocheck
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Test from './pages/Test';
import Header from './components/header';
import DataTable from './components/dataTable';
import Mapbox from './components/map';

import './App.css';

function Home() {
	// const [kearneyPoiData, setKearneyPoiData] = useState<{ [key: string]: any }>({});
	// const [kearneyRoadsData, setKearneyRoadsData] = useState<{[key: string]: any}>({});
	const [geoJsonCache, setGeoJsonCache] = useState<{ [key: string]: any }>({});

	const [activeLayers, setActiveLayers] = useState<{
		[key: string]: boolean;
	}>({ kearney_poi: false, kearney_roads: false });

	const fetchData = async (layer: string) => {
		try {
			const url = `./src/geoJson/${layer}.json`;
			const response = await fetch(url);
			if (!response) throw new Error('network error');

			const layerData = await response.json();

			console.log('successful fetch, geoJson data', layerData);

			setGeoJsonCache((prev) => ({
				...prev,
				[layer]: layerData,
			}));

			return layerData;
		} catch (err) {
			console.log(err);
			return null;
		}
	};

	const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const currLayer = event.target.id;
		const isActive = activeLayers[currLayer] ? false : true;

		setActiveLayers((prev) => ({ ...prev, [currLayer]: isActive }));

		// check if geoJson is already in the cache
		if (isActive === true && !geoJsonCache[currLayer]) {
			await fetchData(currLayer);
		}
	};
	// use effect can watch active layers for changes
	// useEffect(() => {
	// 	//logic goes here?
	// }, [activeLayers]);
	return (
		<div className='app-container'>
			<Header showMap={handleClick} activeLayers={activeLayers} />
			<div className='content-container'>
				<div className='table-container'>
					<DataTable />
				</div>
				<div className='map-container'>
					<Mapbox activeLayers={activeLayers} geoJsonCache={geoJsonCache} />
				</div>
			</div>
		</div>
	);
}

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/test' element={<Test />} />
			</Routes>
		</>
	);
}

export default App;
