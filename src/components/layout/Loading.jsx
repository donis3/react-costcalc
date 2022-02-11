import React from 'react';
import { FaSpinner, FaCog } from 'react-icons/fa';


export default function Loading() {
	return (
		<div className='w-full h-full fixed block top-0 left-0 bg-slate-800 opacity-90 z-50'>
			<span className='text-slate-50 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0'>
				<FaSpinner className='text-6xl animate-spin-slow' />
			</span>
		</div>
	);
}
