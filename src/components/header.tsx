// src/Components/Header.jsx

// import { Link } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';

interface HeaderProps {
	showMap: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ showMap }) => {
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
					variant='surface'
					colorPalette='gray.400'
					id='kearney_poi'
					onClick={showMap}
				>
					Button 1
				</Button>
				<Button
					size='sm'
					variant='surface'
					colorPalette='gray.400'
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
