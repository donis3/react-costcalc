import useConfig from './useConfig';

//Roles enum
const roles = ['main', 'add', 'edit', 'view', 'other', 'chart', 'pie'];
const modules = [
	'home',
	'products',
	'materials',
	'recipes',
	'packages',
	'endproducts',
	'currency',
	'other',
	'company',
	'employees',
	'expenses',
	'morders',
];

export default function useModuleTheme({ module = 'home', role = 'main' }) {
	const config = useConfig();
	//Extract theme colors and icon
	if (!modules.includes(module)) {
		//console.warn(`Unknown module name provided (${module})`);
		module = modules[0];
	}
	if (!roles.includes(role)) {
		//console.warn(`Unknown role name provided (${role})`);
		role = roles[0];
	}

	let { icon, colors } = config.get(`modules.${module}`);

	const bgColor = Array.isArray(colors) && colors.length > 1 ? colors[1] : undefined;
	const color = Array.isArray(colors) && colors.length > 0 ? colors[0] : undefined;
	if (!icon) icon = 'FaHome';

	//Back btn toggle
	let showBackButton = false;

	//Role specific actions
	switch (role) {
		case 'add':
			//Add
			icon = 'FaPlusSquare';
			showBackButton = true;
			break;
		case 'edit':
			//Edit
			icon = 'FaPencilAlt';
			showBackButton = true;
			break;
		case 'view':
			//view
			showBackButton = true;
			break;
		case 'other':
			//other
			showBackButton = true;
			break;
		case 'chart':
			//other
			showBackButton = true;
			icon = 'FaChartLine';
			break;
		case 'pie':
			//other
			showBackButton = true;
			icon = 'FaChartPie';
			break;
		case 'main':
		default:
			//main
			showBackButton = false;
			break;
	}

	return {
		icon,
		color,
		bgColor,
		backBtn: showBackButton,
	};
}
