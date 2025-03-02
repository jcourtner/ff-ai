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
					colorScheme='purple'
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
					colorScheme='purple'
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
