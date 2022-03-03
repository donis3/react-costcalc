import React from 'react';
import Breadcrumb from './Breadcrumb';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MainLayout({ children, header, footer }) {
	return (
		<>
			<div className='flex flex-col w-full h-screen justify-between'>
				<header>{header}</header>
				<main className='mb-auto flex flex-col items-center'>
					<div className='container '>
						<div className='w-full p-3 my-3'>
							<Breadcrumb />
						</div>
						{children}
					</div>
				</main>
				<footer>{footer}</footer>
			</div>

			{/* React-Toastify configured here. */}
			<ToastContainer
				position='top-center'
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover
			/>
		</>
	);
}
