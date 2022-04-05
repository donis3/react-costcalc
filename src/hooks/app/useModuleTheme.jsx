import useConfig from './useConfig';

//Roles enum
const roles = ['main', 'add', 'edit', 'view', 'other'];
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
		case roles[1]:
			//Add
			icon = 'FaPlusSquare';
			showBackButton = true;
			break;
		case roles[2]:
			//Edit
			icon = 'FaPencilAlt';
			showBackButton = true;
			break;
		case roles[3]:
			//view
			showBackButton = true;
			break;
		case roles[4]:
			//other
			showBackButton = true;
			break;
		case roles[0]:
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
