import { useState } from 'react';
import Header from '../components/header';
import DataTable from '../components/dataTable';
import Mapbox from '../components/map';

interface KearneyRoads {
	type: 'MultiLineString';
	coordinates: number[][][]; // Array of arrays of points, where each point is [longitude, latitude]
}

interface KearneyPoi {
	type: 'Feature';
	properties: {
		[key: string]: any; // Accepts any properties
	};
	geometry: {
		type: string; // "Point", "LineString", etc.
		coordinates: any; // Any valid coordinates structure
	};
	id: string;
}

interface GeoJSON {
	type: 'FeatureCollection';
	features: KearneyPoi[];
	[key: string]: any; // Any additional top-level properties
}

type GeoData = GeoJSON | KearneyRoads;

function Homepage() {
	const [geoJsonCache, setGeoJsonCache] = useState<{ [key: string]: GeoData }>(
		{}
	);

	const [activeSource, setActiveSource] = useState<{
		[key: string]: boolean;
	}>({ kearney_poi: false, kearney_roads: false });

	const [currentCoord, setCurrentCoord] = useState<[number, number] | null>(
		null
	);

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

	const handleItemClick = async (coordinates: [number, number]) => {
		setCurrentCoord(coordinates);
	};

	const handleClick = async (mapName: string) => {
		const isActive = activeSource[mapName] ? false : true;
		setActiveSource((prev) => ({ ...prev, [mapName]: isActive }));
		// check if geoJson is already in the cache
		if (isActive === true && !geoJsonCache[mapName]) {
			await fetchData(mapName);
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

export default Homepage;
