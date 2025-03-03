// @ts-nocheck

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { GeoData } from '../types/geoJson';

import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
	activeSources: { [key: string]: boolean };
	geoJsonCache: { [key: string]: GeoData };
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
		const map = mapRef.current;
		if (!map || !map.loaded()) return;

		// loop through activeSources from homepage (updated by the button clicks)
		// push the current active sources into a new array to track
		const updateSources = () => {
			const currentActiveSources = [];
			for (const key in activeSources) {
				console.log(`inside active sources loop, ${key}: `, activeSources[key]);
				if (activeSources[key] === true) {
					currentActiveSources.push(key);
				}
			}

			// loop through activeSourcesRef
			// if the active sources array does not include the current source in the ref and the map has that source already displayed, then remove the layer and the source from the map and delete it from the activeSourcesRef
			activeSourcesRef.current.forEach((source) => {
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

			// loop through active sources array and Add/update active layers that have been added
			currentActiveSources.forEach((sourceName) => {
				const geoJsonData = geoJsonCache[sourceName];
				if (!geoJsonData) return; // Skip if no data available

				// If source doesn't exist yet, add it
				if (!map.getSource(sourceName)) {
					map.addSource(sourceName, {
						type: 'geojson',
						data: geoJsonData,
					});

					// Add new source to activeSourcesRef
					activeSourcesRef.current.add(sourceName);

					// Add a new layer for this source
					if (sourceName === 'kearney_poi') {
						map.addLayer({
							id: `${sourceName}-layer`,
							type: 'circle',
							source: sourceName,
							paint: {
								'circle-radius': 6,
								'circle-color': '#a855f7',
							},
						});
					} else if (sourceName === 'kearney_roads') {
						map.addLayer({
							id: `${sourceName}-layer`,
							type: 'line',
							source: sourceName,
						});
					} else {
						map.addLayer({
							id: `${sourceName}-layer`,
							type: 'circle',
							source: sourceName,
							paint: {
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
