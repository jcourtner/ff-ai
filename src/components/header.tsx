// src/Components/Header.jsx

import { Button, Flex } from '@chakra-ui/react';

interface HeaderProps {
	showMap: (mapName: string) => Promise<void>;
	activeSources: { [key: string]: boolean };
}

const Header = ({ showMap, activeSources }: HeaderProps) => {
	return (
		<div>
			<Flex as='header' height='60px' justify='center' align='center'>
				<Button
					mr={4}
					size='sm'
					variant={activeSources.kearney_poi ? 'solid' : 'outline'}
					bg='purple.200'
					_hover={{ bg: 'purple.400' }}
					_active={{ bg: 'purple.500' }}
					id='kearney_poi'
					onClick={() => {
						showMap('kearney_poi');
					}}
				>
					Kearney POI Map
				</Button>
				<Button
					size='sm'
					variant={activeSources.kearney_roads ? 'solid' : 'outline'}
					bg='purple.200'
					_hover={{ bg: 'purple.400' }}
					_active={{ bg: 'purple.500' }}
					id='kearney_roads'
					onClick={() => {
						showMap('kearney_roads');
					}}
				>
					Kearney Roads Map
				</Button>
			</Flex>
		</div>
	);
};

export default Header;
