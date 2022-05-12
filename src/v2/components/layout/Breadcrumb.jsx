import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';

import Icon from '../common/Icon';

//These paths wont be shown as links
const linkBlacklist = [
	'/recipes/edit',
	'/materials/edit',
	'/packages/edit',
	'/products/edit',
	'/endproducts/edit',
	'/company/employees/edit',
	'/company/expenses/edit',
];

export default function Breadcrumb() {
	const { pathname } = useLocation();
	const { t } = useTranslation('routes');
	const crumbs = pathname.split('/').filter((item) => item && item.length > 0);

	const page = 'home';
	console.log('Breadcrumb needs to know current page')

	const crumbsJsx = [];
	crumbs.reduce((accumulator, current, index) => {
		//Add current path to accumulated array
		accumulator.push(current);
		//join the array to create link
		const linkToCurrent = accumulator.join('/');
		//Create crumb element
		const element = (
			<Crumb currentPath={pathname} targetPath={'/' + linkToCurrent} key={index}>
				{/* Add reference if this is the last element */}
				{crumbs.length - 1 === index ? (
					// This is the last breadcrumb
					<span className='opacity-50'>
						{/* Try to get breadcrumb from app context if available. Or fallback to current pathname */}
						{t(`${current}`, { defaultValue: page.getBreadcrumb(pathname) || current })}
					</span>
				) : (
					//This is normal breadcrumb
					<span className='opacity-50'>{t(`${current}`, { defaultValue: current })}</span>
				)}
			</Crumb>
		);
		//Push it to crumbs
		crumbsJsx.push(element);
		//Return accumulator
		return accumulator;
	}, []);

	return (
		<div className='text-sm breadcrumbs'>
			<ul>
				<Crumb currentPath={pathname} targetPath='/'>
					<Icon icon='FaHome' className='mr-1 opacity-50' />
					{t('home')}
				</Crumb>
				{crumbsJsx && crumbsJsx.length > 0 && crumbsJsx.map((crumb) => crumb)}
			</ul>
		</div>
	);
}

function Crumb({ currentPath, targetPath, children }) {
	//This is active link
	if (currentPath === targetPath || linkBlacklist.includes(targetPath)) {
		return <li>{children}</li>;
	}

	return (
		<li>
			<Link to={targetPath} className='link'>
				{children}
			</Link>
		</li>
	);
}
