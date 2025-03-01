// src/Components/Header.jsx

// import { Link } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';

interface HeaderProps {
	showMap: (event: React.MouseEvent<HTMLButtonElement>) => void;
	activeLayers: { [key: string]: boolean };
}

const Header = ({ showMap, activeLayers }: HeaderProps) => {
	return (
		<div>
			<h2>Testing my h2</h2>
			<Flex
				as='header'
				height='60px'
				bg='gray.100'
				justify='center'
				align='center'
			>
				<Button
					mr={4}
					size='sm'
					variant={activeLayers.kearney_poi ? 'solid' : 'outline'}
					colorScheme='gray'
					id='kearney_poi'
					onClick={showMap}
				>
					Button 1
				</Button>
				<Button
					size='sm'
					variant={activeLayers.kearney_roads ? 'solid' : 'outline'}
					colorScheme='gray'
					id='kearney_roads'
					onClick={showMap}
				>
					Button 2
				</Button>
			</Flex>
		</div>
	);
};

export default Header;
