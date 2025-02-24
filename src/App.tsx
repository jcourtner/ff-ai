// @ts-nocheck

import { Route, Routes } from 'react-router-dom';
import Test from './pages/Test';
import Header from './components/header';
import DataTable from './components/dataTable';
import Mapbox from './components/map';

import './App.css';

function App() {
	return (
		<>
			<div className='app-container'>
				<Header />
				<div className='content-container'>
					<div className='table-container'>
						<DataTable />
					</div>
					<div className='map-container'>
						<Mapbox />
					</div>
				</div>
			</div>
			<Routes>
				<Route path='/test' element={<Test />} />
			</Routes>
		</>
	);
}

export default App;
