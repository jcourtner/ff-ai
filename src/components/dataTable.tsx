import { Card, Stack } from '@chakra-ui/react';
import { GeoJSON } from '../types/geoJson';

interface DataTableProps {
	geoJsonCache: { [key: string]: GeoJSON };
	handleItemClick: (coordinates: [number, number]) => void;
}

const DataTable = ({ geoJsonCache, handleItemClick }: DataTableProps) => {
	const { features } = geoJsonCache;

	const listPoi = features.map((place) => (
		<Card.Root
			size='md'
			variant='subtle'
			onClick={() => {
				handleItemClick(place?.geometry?.coordinates);
			}}
			key={place.id}
			bg='purple.200'
			_hover={{
				bg: 'purple.400',
				borderColor: 'blue.500', // Blue border on hover
				boxShadow: 'md', // Add shadow on hover
			}}
			_active={{ bg: 'purple.500' }}
		>
			<Card.Title>{place.properties.name}</Card.Title>
		</Card.Root>
	));

	return (
		<div className='data-table-container'>
			<div className='data-table-scroll'>
				<Stack>{listPoi}</Stack>
			</div>
		</div>
	);
};

export default DataTable;
