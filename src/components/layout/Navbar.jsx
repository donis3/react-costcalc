import React, { useContext, useEffect, useState, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { ReactComponent as Logo } from '../../img/cost-logo.svg';
import './Navbar.css';

import LangSelect from './LangSelect';
import AppContext from '../../context/AppContext';
import ReactCountryFlag from 'react-country-flag';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useClickOutside from '../../hooks/common/useClickOutside';
import useConfig from '../../hooks/app/useConfig';
import Icon from '../common/Icon';

export default function Navbar() {
	const { t } = useTranslation('routes', 'translation');
	const [menuOpen, setMenuOpen] = useState(false);
	const [isLangModalOpen, setLangModalOpen] = useState(false);
	const { language } = useContext(AppContext);
	const loc = useLocation();

	const navbarRef = useRef();
	useClickOutside(navbarRef, () => setMenuOpen(false));

	//Close menu when location changes
	useEffect(() => {
		setMenuOpen(false);
	}, [loc.pathname]);

	return (
		<>
			<nav ref={navbarRef} className={`relative px-3 lg:px-5 py-3 bg-neutral`}>
				<div className='container  mx-auto flex flex-wrap items-center justify-between'>
					<div className='w-full flex justify-between lg:w-auto'>
						<Link to='/' className='text-neutral-content'>
							<Logo width='200' />
						</Link>
						<button className='navbar-collapse-btn' type='button' onClick={() => setMenuOpen(!menuOpen)}>
							<FaBars />
						</button>
					</div>
					<div className={'nav-list-container lg:w-3/5 ' + (menuOpen ? 'flex' : ' hidden')}>
						<ul className='nav-list  flex flex-wrap'>
							{/* Business Links */}
							<NavbarItem to='/endproducts' module='endproducts'>
								{t('endproducts')}
							</NavbarItem>
							<NavbarItem to='/materials' module='materials'>
								{t('materials')}
							</NavbarItem>
							<NavbarItem to='/packages' module='packages'>
								{t('packages')}
							</NavbarItem>
							<NavbarDropdown text={t('nav.manufacturing', { ns: 'translation' })} module='manufacturing'>
								<NavbarItem to='/products' module='products'>
									{t('nav.products', { ns: 'translation' })}
								</NavbarItem>
								<NavbarItem to='/recipes' module='recipes'>
									{t('nav.recipes', { ns: 'translation' })}
								</NavbarItem>
							</NavbarDropdown>

							{/* Company Nested */}
							<NavbarDropdown text={t('nav.company', { ns: 'translation' })} module='company'>
								<NavbarNestedItem to='/company/expenses' module='expenses'>
									{t('nav.expenses', { ns: 'translation' })}
								</NavbarNestedItem>
								<NavbarNestedItem to='/company/employees' module='employees'>
									{t('nav.employees', { ns: 'translation' })}
								</NavbarNestedItem>
								<NavbarNestedItem to='/company' module='company'>
									{t('nav.company', { ns: 'translation' })}
								</NavbarNestedItem>
							</NavbarDropdown>
							{/* Language Selector */}
							<li className='nav-item lg:border-l lg:mt-0 mt-3 ml-3 border-white border-opacity-50'>
								<button onClick={() => setLangModalOpen(true)} className=' opacity-50 text-sm'>
									{language.nativeName}
									<ReactCountryFlag svg countryCode={language.countryCode} className='ml-2 text-2xl' />
								</button>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			{/* Modals */}

			<LangSelect isOpen={isLangModalOpen} setIsOpen={setLangModalOpen} />
		</>
	);
}

function NavbarItem({ children, to = '/', module = null }) {
	const config = useConfig();
	const icon = config.get(`modules.${module}.icon`);

	const activeLink = ({ isActive }) => {
		if (isActive) {
			return 'nav-active';
		} else {
			return '';
		}
	};
	return (
		<li className='nav-item'>
			<NavLink to={to} className={activeLink}>
				{children}
				{icon && <Icon icon={icon} className='ml-1' />}
			</NavLink>
		</li>
	);
}

function NavbarNestedItem({ children, to = '/', module = null }) {
	const config = useConfig();
	const icon = config.get(`modules.${module}.icon`);
	const loc = useLocation();

	const activeLink = ({ isActive }) => {
		if (isActive) {
			if (loc.pathname === to) {
				return 'nav-active';
			}
		}
		return '';
	};
	return (
		<li className='nav-item'>
			<NavLink to={to} className={activeLink}>
				{children}
				{icon && <Icon icon={icon} className='ml-1' />}
			</NavLink>
		</li>
	);
}

function NavbarDropdown({ text = 'dropdown', children, module = null }) {
	const [isOpen, setOpen] = useState(false);
	const handleClick = () => setOpen((state) => !state);
	//const openDropdown = () => setOpen(() => true);
	const closeDropdown = () => setOpen(() => false);
	const dropdownElement = useRef();
	useClickOutside(dropdownElement, closeDropdown);

	const config = useConfig();
	const icon = config.get(`modules.${module}.icon`);
	const moduleChildren = config.get(`modules.${module}.children`);
	const loc = useLocation();
	let buttonClass = '';

	//Determine if this module or one of the sub-modules is active.
	//If so, display nav-active class for this dropdown toggle btn
	const paths = loc.pathname.split('/').filter((item) => item.length > 0); //Get each path item

	if (paths.includes(module)) {
		buttonClass = 'nav-active';
	} else if (Array.isArray(moduleChildren)) {
		moduleChildren.forEach((key) => {
			if (typeof key !== 'string') return;
			key = key.toLowerCase();
			if (paths.includes(key)) {
				buttonClass = 'nav-active';
			}
		});
	}

	if (!children) {
		return <></>;
	}
	return (
		<li className='nav-dropdown nav-item' ref={dropdownElement}>
			<button onClick={handleClick} className={'flex items-center justify-center gap-x-1 ' + buttonClass}>
				{text}
				{icon && <Icon icon={icon} className='opacity-50' />}
			</button>

			<ul style={{ display: isOpen ? null : 'none' }}>
				{/* Must have nav item childs */}
				{children}
			</ul>
		</li>
	);
}
