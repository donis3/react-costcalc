import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from './Breadcrumb';
import CurrencyRateDisplay from './CurrencyRateDisplay';

export default function MainLayout({ children, header, footer }) {
	const { t } = useTranslation('translation');
	useEffect(() => {
		window.document.title = t('appname');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<div className='flex flex-col w-full h-screen justify-between'>
				<header className='print:hidden'>{header}</header>
				<main className='mb-auto flex flex-col items-center'>
					<div className='container '>
						<div className='w-full p-3 my-3 flex  justify-between md:items-center items-start flex-wrap md:flex-row flex-col  print:hidden'>
							<Breadcrumb />
							<CurrencyRateDisplay />
						</div>
						{children}
					</div>
				</main>
				<footer className=' print:hidden'>{footer}</footer>
			</div>
		</>
	);
}
