// @ts-nocheck
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Test from './pages/Test';
import Header from './components/header';
import DataTable from './components/dataTable';
import Mapbox from './components/map';

import './App.css';

function Home() {
	const [activeMap, setActiveMap] = useState<string | null>(null);
	const [currentData, setCurrentData] = useState<T | null>(null);

	const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		await setActiveMap(event.target.id);
	};
	console.log('current active map after button click', activeMap);
	useEffect(() => {
		if (!activeMap) return;
		const fetchData = async () => {
			try {
				const url = `./src/geoJson/${activeMap}.json`;
				console.log('url');
				const response = await fetch(url);
				if (!response.ok) throw new Error('Network error');
				console.log('respnse', response);
				const result: T = await response.json();
				console.log('resulting json', result);
				setCurrentData(result);
			} catch (error) {
				console.error('Fetch error:', error);
			}
		};
		fetchData();
	}, [activeMap]);

	return (
		<div className='app-container'>
			<Header showMap={handleClick} />
			<div className='content-container'>
				<div className='table-container'>
					<DataTable />
				</div>
				<div className='map-container'>
					<Mapbox />
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
