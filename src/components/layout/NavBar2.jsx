import React from 'react';
import theme from '../../config/theme';
import { FaBars } from 'react-icons/fa';
import { ReactComponent as Logo } from '../../img/cost-logo.svg';

export default function NavBar2() {
	const [menuOpen, setMenuOpen] = React.useState(false);
	return (
		<>
			<nav className={`relative px-3 lg:px-5 py-3 ${theme.navbar.bg}`}>
				<div className='container  mx-auto flex flex-wrap items-center justify-between'>
					<div className='w-full flex justify-between lg:w-auto '>
						<a className='text-neutral-content' href='#logo'>
							<Logo width='200' />
						</a>
						<button
							className='text-neutral-content cursor-pointer text-xl leading-none px-0 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none'
							type='button'
							onClick={() => setMenuOpen(!menuOpen)}
						>
							<FaBars />
						</button>
					</div>
					<div className={'lg:flex flex-grow items-center' + (menuOpen ? ' flex' : ' hidden')} id='example-navbar-info'>
						<ul className='flex flex-col items-end lg:flex-row list-none lg:ml-auto  w-full lg:w-auto text-md lg:text-lg'>
							<li className='nav-item'>
								<a
									className='px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75'
									href='#pablo'
								>
									Discover
								</a>
							</li>
							<li className='nav-item'>
								<a
									className='px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75'
									href='#pablo'
								>
									Discover
								</a>
							</li>
							<li className='nav-item'>
								<a
									className='px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75'
									href='#pablo'
								>
									Discover
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
}
