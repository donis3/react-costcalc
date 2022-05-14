import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useConfig from '../../hooks/app/useConfig';
import { getRepoStorageKey } from '../../hooks/common/useStorageRepo';

/**
 * HOW TO ADD MORE DEMOS:
 * After you've decided on your demo name for example: lemonade,
 * go to public/img and create a lemonade.jpg
 * go to public/locales/demo.json and create a lemonade key with title, scenario texts
 * go to src/data and create a lemonade.json with a backup data for the given demo
 * and lastly, just add the demo name to demos array below
 * ['lemonade']
 *
 */
const demos = ['lemonade', 'supplement'];

export default function Demo() {
	const { t } = useTranslation('pages/demo');
	const config = useConfig();
	const appname = config.get('app.name');
	let loadTimer = null; //Timeout reference to clear on dismount

	/**
	 * Asynchronously attempts to load the data/demoname.json
	 * If the file exists and is an object with keys,
	 * converts it to a json string and saves it to local storage appName.application
	 * then creates a timeout of 2 seconds before reloading the app
	 * @param {string} demoName Name of the demo file
	 * @returns {void}
	 */
	const loadDemo = async (demoName = null) => {
		if (!demoName) return;
		let demoData = '';
		try {
			demoData = await import(`../../data/${demoName}.json`);
		} catch (error) {
			toast.error(t('fileError', { name: demoName }));
			return;
		}
		try {
			//Application data in this key
			const storageKey = getRepoStorageKey('application', config.all);
			//Last backup date etc in this key
			const systemKey = getRepoStorageKey('system', config.all);
			let jsonString = '';
			if (demoData && Object.keys(demoData).length > 0) {
				jsonString = JSON.stringify(demoData);
			} else {
				throw new Error();
			}
			//Json string is ready to load and reload app
			localStorage.setItem(storageKey, jsonString);
			localStorage.removeItem(systemKey);
			toast.success(t('success'));
			loadTimer = setTimeout(() => {
				window.location.reload();
			}, 2000);
		} catch (error) {
			toast.error(t('error'));
			return;
		}
	};

	/**
	 * If there is an active timeout, clear it on dismount
	 */
	useEffect(() => {
		return () => {
			if (loadTimer) {
				clearTimeout(loadTimer);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={t('title', { appname })} module='demo' role='other' />
				<p className='p3 leading-relaxed text-lg font-light'>{t('lead')}</p>
			</Card>
			<div className='mb-10 w-full p-5 flex flex-col gap-y-20'>
				{demos.map((demo, i) => (
					<DemoCard key={i} demoName={demo} callback={() => loadDemo(demo)} />
				))}
			</div>
		</>
	);
}

function DemoCard({ demoName = 'demo', callback = null } = {}) {
	const [warn, setWarn] = useState(false);
	const { t } = useTranslation('pages/demo');

	const handleCb = () => {
		setWarn(false);
		callback?.();
	};

	if (!callback) {
		return (
			<div>
				<p className='font-light text-lg'>{t('unavailable')}</p>
			</div>
		);
	}
	return (
		<div className='w-full card border border-neutral border-opacity-25 lg:card-side bg-base-100 shadow-xl'>
			<figure className='w-full lg:w-1/4'>
				<img
					className=' max-h-44 lg:max-h-full h-full object-cover w-full'
					src={`/img/${demoName}.jpg`}
					alt={demoName}
				/>
			</figure>
			<div className='card-body w-full lg:w-3/4 h-[500px] '>
				<h2 className='card-title text-2xl'>{warn ? t('warningTitle') : t(`${demoName}.title`)}</h2>
				<p className='whitespace-pre-wrap'>{warn ? t('warningText') : t(`${demoName}.scenario`)}</p>

				{warn ? (
					<div className='card-actions justify-center'>
						<button className='btn btn-primary btn-lg gap-2' onClick={handleCb}>
							<FaCheck />
							{t('agree')}
						</button>
						<button className='btn btn-outline btn-lg gap-2' onClick={() => setWarn(false)}>
							<FaTimes />
							{t('cancel')}
						</button>
					</div>
				) : (
					<div className='card-actions justify-center'>
						<button className='btn btn-primary btn-lg gap-2' onClick={() => setWarn(true)}>
							<FaCloudUploadAlt />
							{t('loadBtn')}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
