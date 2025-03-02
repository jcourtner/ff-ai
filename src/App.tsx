// @ts-nocheck
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Test from './pages/Test';
import Header from './components/header';
import DataTable from './components/dataTable';
import Mapbox from './components/map';

import './App.css';

function Home() {
	const [geoJsonCache, setGeoJsonCache] = useState<{ [key: string]: any }>({});

	const [activeSource, setActiveSource] = useState<{
		[key: string]: boolean;
	}>({ kearney_poi: false, kearney_roads: false });

	//location that is currently clicked -- what do we want to store?
	const [selectedLocation, setSelectedLocation] = useState<{
		[key: string]: any;
	}>({});
	const [currentCoord, setCurrentCoord] = useState<[number, number]>(null);

	const fetchData = async (source: string) => {
		try {
			const url = `./src/geoJson/${source}.json`;
			const response = await fetch(url);
			if (!response) throw new Error('network error');

			const sourceData = await response.json();

			setGeoJsonCache((prev) => ({
				...prev,
				[source]: sourceData,
			}));
		} catch (err) {
			console.log(err);
		}
	};

	const handleItemClick = async (coordinates) => {
		// do something here
		console.log('inside handle item click -- expect coordinates', coordinates);
		setCurrentCoord(coordinates);
	};

	const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const currSource = event.target.id;
		const isActive = activeSource[currSource] ? false : true;

		setActiveSource((prev) => ({ ...prev, [currSource]: isActive }));

		// check if geoJson is already in the cache
		if (isActive === true && !geoJsonCache[currSource]) {
			await fetchData(currSource);
		}
	};

	return (
		<div className='app-container'>
			<Header showMap={handleClick} activeSources={activeSource} />
			<div className='content-container'>
				{activeSource.kearney_poi && geoJsonCache.kearney_poi ? (
					<div className='table-container'>
						<DataTable
							geoJsonCache={geoJsonCache.kearney_poi}
							handleItemClick={handleItemClick}
						/>
					</div>
				) : activeSource.kearney_poi ? (
					<div className='table-container'>
						<p>Loading data...</p>
					</div>
				) : null}
				<div className='map-container'>
					<Mapbox
						activeSources={activeSource}
						geoJsonCache={geoJsonCache}
						flyToCoord={currentCoord}
					/>
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
