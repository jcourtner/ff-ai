interface KearneyRoads {
	type: 'MultiLineString';
	coordinates: number[][][];
}

interface KearneyPoi {
	type: 'Feature';
	properties: {
		[key: string]: any;
	};
	geometry: {
		type: string;
		coordinates: any;
	};
	id: string;
}

export interface GeoJSON {
	type: 'FeatureCollection';
	features: KearneyPoi[];
	[key: string]: any;
}

export type GeoData = GeoJSON | KearneyRoads;
