import React from 'react';

export default function HomePage() {
	let arr = [];
	for (let i = 0; i < 10; i++) {
		arr[i] = 'Dynamic Content Height Generation - Row: ' + (i+1);
	}
	return (
		<div className='text-center hero-content mx-auto'>
			<div className='max-w-2xl'>
				<h1 className='mb-5 text-5xl font-bold'>React + DaisyUi Template</h1>
				<p className='mb-5 text-xl'>
					Welcome to the starter template for react apps using Tailwind and DaisyUi.
				</p>
				<button className='btn btn-primary'>Get Started</button>
				<hr className='mt-5 mb-2'/>
				<h3 className='my-2 text-2xl font-bold text-left'>Features</h3>
				<ul className='list-disc text-lg text-left ml-5'>
					<li>Main layout component consists of a header, body and a footer in a flex-col justify between</li>
					<li>Footer always at the bottom</li>
					<li>Icon component that can dynamically load Fa icons</li>
					<li>Theme selection for DaisyUi in navbar</li>
					<li>Selected theme is saved in local storage as activeTheme</li>
					<li>Theme loading is done via changind data-theme attribute of document</li>
				</ul>
				<hr className='mt-5 mb-2'/>
				{arr.map((item, index) => (
					<p key={index}>{item}</p>
				))}

				
			</div>
		</div>
	);
}
