// @ts-nocheck

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
	activeSources: { [key: string]: boolean };
	geoJsonCache: { [key: string]: any };
}
function Mapbox({ activeSources, geoJsonCache }: MapProps) {
	const mapRef = useRef();
	const mapContainerRef = useRef();
	const activeSourcesRef = useRef<Set<string>>(new Set());

	// instantiate Mapbox
	useEffect(() => {
		mapboxgl.accessToken =
			'pk.eyJ1IjoiamNvdXJ0bmVyOTciLCJhIjoiY203aG81cDhiMGs3NjJrb2o4bmxzZ2RvNSJ9.n1R4Gb6JcIkB5PojKA-Caw';
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
								'circle-color': getColorForLayer(sourceName),
							},
						});
					} else if (sourceName === 'kearney_roads') {
						map.addLayer({
							id: `${sourceName}-layer`,
							type: 'line', // Modify based on your data type (point, line, polygon)
							source: sourceName,
						});
					}
				}
			});
		};

		// Helper function to assign different colors to different layers
		const getColorForLayer = (layerId: string) => {
			// Simple hash function to generate colors based on layer ID
			const colors = [
				'#ff0000',
				'#00ff00',
				'#0000ff',
				'#ffff00',
				'#00ffff',
				'#ff00ff',
			];
			const hash = layerId.split('').reduce((acc, char) => {
				return char.charCodeAt(0) + ((acc << 5) - acc);
			}, 0);
			return colors[Math.abs(hash) % colors.length];
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

	return (
		<>
			<div id='map-container' ref={mapContainerRef} className='mapbox-map' />
		</>
	);
}

export default Mapbox;
