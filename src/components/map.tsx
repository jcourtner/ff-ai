// @ts-nocheck

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
	activeSources: { [key: string]: boolean };
	geoJsonCache: { [key: string]: any };
	flyToCoord: [number, number] | null;
}
function Mapbox({ activeSources, geoJsonCache, flyToCoord }: MapProps) {
	const mapRef = useRef();
	const mapContainerRef = useRef();
	const activeSourcesRef = useRef<Set<string>>(new Set());

	// instantiate Mapbox
	useEffect(() => {
		mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
		mapRef.current = new mapboxgl.Map({
			container: mapContainerRef.current,
			center: [-99.0817, 40.6993],
			zoom: 10.12,
		});

		return () => {
			mapRef.current.remove();
		};
	}, []);

	// watch for changes in activeLayers or the geoJsonCache
	useEffect(() => {
		console.log('inside use effect in mapbox for active changes');
		const map = mapRef.current;
		if (!map || !map.loaded()) return;

		// Function to handle active and inactive sources and layers
		const updateSources = () => {
			const currentActiveSources = [];
			for (const key in activeSources) {
				console.log(`inside active sources loop, ${key}: `, activeSources[key]);
				if (activeSources[key] === true) {
					currentActiveSources.push(key);
				}
			}

			// loop through activeSourcesRef set and delete the spurces no longer active and once it's updated we will render only what's
			// active and set new sources and layers
			// Remove layers that are no longer active
			activeSourcesRef.current.forEach((source) => {
				// check mapName if in activeLayersRef as current
				// if the current active sources does not include the current source that we are looping through in the activesource ref
				// AND the source exists on the map -- then delete the source from the map and the layers associated with it as well as in the active Sources ref
				if (!currentActiveSources.includes(source) && map.getSource(source)) {
					// Remove the layer first (if it exists)
					if (map.getLayer(`${source}-layer`)) {
						map.removeLayer(`${source}-layer`);
					}
					// Then remove the source
					map.removeSource(source);
					activeSourcesRef.current.delete(source);
				}
			});

			// loop through active sources array and Add/update active layers
			currentActiveSources.forEach((sourceName) => {
				const geoJsonData = geoJsonCache[sourceName];
				if (!geoJsonData) return; // Skip if no data available

				// If source doesn't exist yet, add it
				if (!map.getSource(sourceName)) {
					map.addSource(sourceName, {
						type: 'geojson',
						data: geoJsonData,
					});

					// Track this source as added
					activeSourcesRef.current.add(sourceName);

					// Add a new layer for this source
					if (sourceName === 'kearney_poi') {
						map.addLayer({
							id: `${sourceName}-layer`,
							type: 'circle', // Modify based on your data type (point, line, polygon)
							source: sourceName,
							paint: {
								// Customize based on layer type
								'circle-radius': 6,
								'circle-color': '#a855f7',
							},
						});
					} else if (sourceName === 'kearney_roads') {
						map.addLayer({
							id: `${sourceName}-layer`,
							type: 'line', // Modify based on your data type (point, line, polygon)
							source: sourceName,
						});
					} else {
						map.addLayer({
							id: `${sourceName}-layer`,
							type: 'circle', // Modify based on your data type (point, line, polygon)
							source: sourceName,
							paint: {
								// Customize based on layer type
								'circle-radius': 6,
								'circle-color': '#a855f7',
							},
						});
					}
				}
			});
		};

		// If map is already loaded, update layers immediately
		if (map.isStyleLoaded()) {
			updateSources();
		} else {
			// Otherwise wait for the style to load
			const onStyleLoad = () => {
				updateSources();
				map.off('style.load', onStyleLoad);
			};
			map.on('style.load', onStyleLoad);
		}

		// Cleanup function
		return () => {
			if (map && map.loaded()) {
				map.off('style.load', updateSources);
			}
		};
	}, [activeSources, geoJsonCache]);

	useEffect(() => {
		const map = mapRef.current;
		if (flyToCoord !== null) {
			map.flyTo({
				center: flyToCoord,
				essential: true,
				zoom: 17,
			});
		}
	}, [flyToCoord]);

	return (
		<>
			<div id='map-container' ref={mapContainerRef} className='mapbox-map' />
		</>
	);
}

export default Mapbox;
