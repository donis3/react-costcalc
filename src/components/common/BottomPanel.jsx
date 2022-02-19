import React from 'react';
import './BottomPanel.css';
import { FaCaretDown } from 'react-icons/fa';

export default function BottomPanel({ isOpen = false, title = null, children, className = null, handleClose = null }) {
	const isOpenClass = isOpen ? ' panel-open ' : '';
	const panelAdditionalClass = ' bg-base-100 ' + className;
	return (
		<div
			className={
				'bottom-panel  fixed bottom-0 left-0 w-full z-40 overflow-x-hidden overflow-y-auto' +
				isOpenClass +
				panelAdditionalClass
			}
			style={{ boxShadow: '0px -1px 10px 6px rgba(0,0,0,0.5)' }}
		>
			<div className='w-full min-h-full'>
				<div className='min-h-6 w-full border-b border-opacity-10 border-b-base-content bg-base-300'>
					<div className='container mx-auto px-5 py-3 flex justify-between items-center'>
						<h2 className='text-2xl font-semibold '>{title}</h2>
						<button className='btn btn-ghost btn-md' onClick={handleClose}>
							<FaCaretDown className='text-2xl' />
						</button>
					</div>
				</div>

				<div className='container mx-auto px-5 py-5'>
					<div className='w-full'>{children}</div>
				</div>
			</div>
		</div>
	);
}
