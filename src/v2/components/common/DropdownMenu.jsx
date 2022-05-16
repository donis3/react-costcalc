import { useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Add a dropdown with periods to select
 * will change uiToggle showPeriod data
 * requires useUiToggles setter and getter
 * @param {*} param0
 * @returns
 */
export default function DropdownMenu({ children, icon, className, ...props }) {
	const [isActive, setIsActive] = useState(false);
	const handleOpen = () => setIsActive(true);
	const handleClose = () => setIsActive(false);

	return (
		<div className={`relative  ${className}`} {...props}>
			<button type='button' onClick={handleOpen} className='px-1 py-2 hover:text-primary'>
				{icon}
			</button>
			{isActive && (
				<FocusTrap
					active
					focusTrapOptions={{
						initialFocus: false,
						allowOutsideClick: true,
						clickOutsideDeactivates: true,
						onDeactivate: handleClose,
					}}
				>
					<div className='absolute right-1 top-6 z-50 min-w-[100px] w-fit'>
						<ul className='flex flex-col py-1 px-2 gap-y-1 shadow-md rounded-box bg-base-100 w-auto border min-w-fit'>
							{children}
						</ul>
					</div>
				</FocusTrap>
			)}
		</div>
	);
}
function DropdownItem({ children, icon = null, callback = null, active = false, disabled = false }) {
	if (typeof active !== 'boolean') active = false;

	return (
		<li className='w-auto min-w-fit'>
			<button
				type='button'
				onClick={disabled ? null : callback}
				disabled={disabled}
				className={`w-full btn btn-ghost whitespace-nowrap  gap-2 flex-nowrap justify-end ${active && 'btn-active'}`}
			>
				{children}
				{icon && icon}
			</button>
		</li>
	);
}

function DropdownLink({ children, icon = null, to = '/', active = false }) {
	if (typeof active !== 'boolean') active = false;
	const { pathname } = useLocation();
	if (pathname === to) active = true;

	return (
		<li className='w-auto min-w-fit'>
			<Link
				to={to}
				className={`w-full btn btn-ghost whitespace-nowrap  gap-2 flex-nowrap justify-end ${active && 'btn-active'}`}
			>
				{children}
				{icon && icon}
			</Link>
		</li>
	);
}

DropdownMenu.Item = DropdownItem;
DropdownMenu.Link = DropdownLink;
