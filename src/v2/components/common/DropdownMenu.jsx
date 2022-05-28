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
export default function DropdownMenu({ children, icon, text, className, align, ...props }) {
	const [isActive, setIsActive] = useState(false);
	const handleOpen = () => setIsActive(true);
	const handleClose = () => setIsActive(false);

	return (
		<div className={`relative  ${className}`} {...props}>
			{text ? (
				<button type='button' onClick={handleOpen} className='btn btn-sm btn-ghost gap-1'>
					{text}
					{icon}
				</button>
			) : (
				<button type='button' onClick={handleOpen} className='px-1 py-2 hover:text-primary'>
					{icon}
				</button>
			)}
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
					<div
						className={`absolute top-6 z-50 min-w-[100px] w-fit ${align === 'right' && 'right-1'} ${
							align === 'left' && 'left-1'
						}`}
					>
						<ul className='flex flex-col py-1 px-2 gap-y-1 shadow-md rounded-box bg-base-100 w-auto border min-w-fit'>
							{children}
						</ul>
					</div>
				</FocusTrap>
			)}
		</div>
	);
}

DropdownMenu.defaultProps = {
	icon: null,
	text: null,
	className: null,
	align: 'right',
};

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

function DropdownElement({ children }) {
	return <li className='w-auto min-w-fit'>{children}</li>;
}

DropdownMenu.Item = DropdownItem;
DropdownMenu.Link = DropdownLink;
DropdownMenu.Element = DropdownElement;
