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

	const fetchData = async (source: string) => {
		try {
			const url = `./src/geoJson/${source}.json`;
			const response = await fetch(url);
			if (!response) throw new Error('network error');

			const sourceData = await response.json();

			console.log('successful fetch, geoJson data', sourceData);

			setGeoJsonCache((prev) => ({
				...prev,
				[source]: sourceData,
			}));
		} catch (err) {
			console.log(err);
		}
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
				{activeSource.kearney_poi && (
					<div className='table-container'>
						<DataTable />
					</div>
				)}
				<div className='map-container'>
					<Mapbox activeSources={activeSource} geoJsonCache={geoJsonCache} />
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
