import React, { useContext } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import PanelContext from '../../context/PanelContext';
import './BottomPanel.css';

export default function BottomPanel() {
	const { isOpen, title, content, close } = useContext(PanelContext);
	const panelToggleClass = isOpen ? 'slide-up' : 'slide-down';

	return (
		<div
			className={
				'panel-bottom fixed bottom-0 left-0 w-full z-40 overflow-x-hidden overflow-y-auto bg-base-100 ' +
				panelToggleClass
			}
		>
			<div className='w-full min-h-full'>
				<div className='min-h-6 w-full border-b border-opacity-10 border-b-base-content bg-base-300'>
					<div className='container mx-auto px-5 py-3 flex justify-between items-center'>
						<h2 className='text-2xl font-semibold '>{title}</h2>
						<button className='btn btn-ghost btn-md' onClick={close}>
							<FaCaretDown className='text-2xl' />
						</button>
					</div>
				</div>

				<div className='container mx-auto px-5 py-5'>
					<div className='w-full'>{content}</div>
				</div>
			</div>
		</div>
	);
}
