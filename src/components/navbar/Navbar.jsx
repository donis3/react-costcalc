import React from 'react';
import theme from '../../config/theme';
import { FaBars } from 'react-icons/fa';
import { ReactComponent as Logo } from '../../img/cost-logo.svg';
import './Navbar.css';
import useWindowType from '../../hooks/useWindowType';
import Modal from '../common/Modal';


export default function Navbar() {
	const [menuOpen, setMenuOpen] = React.useState(false);
	const { windowType } = useWindowType();

	return (
		<>
			
			<nav className={`relative px-3 lg:px-5 py-3 ${theme.navbar.bg}`}>
				<div className='container  mx-auto flex flex-wrap items-center justify-between'>
					<div className='w-full flex justify-between lg:w-auto '>
						<a className='text-neutral-content' href='#logo'>
							<Logo width='200' />
						</a>
						<button className='navbar-collapse-btn' type='button' onClick={() => setMenuOpen(!menuOpen)}>
							<FaBars />
						</button>
					</div>
					<div className={'nav-list-container' + (menuOpen ? ' flex' : ' hidden')}>
						<ul className='nav-list'>
							<li className='nav-item'>
								<a href='#pablo'>Discover</a>
							</li>
							<li className='nav-item'>
								<a href='#pablo'>Discover</a>
							</li>
							<li className='nav-item'>
								<a href='#pablo'>Discover</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>

			<Modal />
		</>
	);
}
