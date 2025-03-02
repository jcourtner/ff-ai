// src/Components/Header.jsx

// import { Link } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';

interface HeaderProps {
	showMap: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
					onClick={showMap}
				>
					Button 1
				</Button>
				<Button
					size='sm'
					variant={activeSources.kearney_roads ? 'solid' : 'outline'}
					colorScheme='purple'
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
