import { Card, Stack } from '@chakra-ui/react';

interface DataTableProps {
	geoJsonCache: { [key: string]: any };
}

const DataTable = ({ geoJsonCache }: DataTableProps) => {
	const { features } = geoJsonCache;

	const listPoi = features.map((place) => (
		<Card.Root size='md' variant='subtle'>
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
