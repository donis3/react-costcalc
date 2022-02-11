import React from 'react';

export default function MainLayout({ children, header, footer }) {
	return (
		<div className='flex flex-col w-full h-screen justify-between'>
			<header>{header}</header>
			<main className='mb-auto'>{children}</main>
			<footer>{footer}</footer>
		</div>
	);
}
