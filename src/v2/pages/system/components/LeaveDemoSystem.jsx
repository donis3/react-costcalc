import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import useDefaultButtons from '../../../hooks/forms/useDefaultButtons';
import { ImExit as LeaveIcon } from 'react-icons/im';
import DeleteButton from '../../../components/common/DeleteButton';
import useSystem from '../../../hooks/system/useSystem';

export default function LeaveDemoSystem() {
	const { Cancel } = useDefaultButtons();
	const { t } = useTranslation('pages/system');
	const [radioState, setRadioState] = useState('keep');
	const { actions } = useSystem();

	const handleChange = (e) => {
		setRadioState(e.target.value);
	};

	const handleSubmit = () => {
		actions.leaveDemo(radioState === 'keep');
	};

	return (
		<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
			<ModuleHeader text={t('isDemo.title')} module='system' role='main' customIcon='FaLemon' />
			<p className='opacity-80 text-sm'>{t('isDemo.lead')}</p>

			<div className='p-3 my-5 flex flex-col gap-2'>
				<RadioItem name='leaveDemo' value='wipe' checked={radioState === 'wipe'} onChange={handleChange}>
					{t('isDemo.leaveDemo')}
				</RadioItem>

				<RadioItem name='leaveDemo' value='keep' checked={radioState === 'keep'} onChange={handleChange}>
					{t('isDemo.leaveDemoWithoutWipe')}
				</RadioItem>
			</div>

			<div className='col-span-full border-t pt-3 flex gap-2 justify-between'>
				<DeleteButton onClick={handleSubmit} className='btn bg-red-500 hover:bg-red-900 flex gap-x-1'>
					<LeaveIcon />
					{t('isDemo.leave')}
				</DeleteButton>
				<Link to='/'>
					<Cancel className='btn btn-outline' />
				</Link>
			</div>
		</Card>
	);
}

function RadioItem({ name, value, children, onChange, checked = false }) {
	return (
		<div className='form-control'>
			<label className='label cursor-pointer justify-start gap-2'>
				<input
					type='radio'
					name={name}
					className='radio radio-primary'
					checked={checked}
					value={value}
					onChange={onChange}
				/>
				<span className='label-text'>{children}</span>
			</label>
		</div>
	);
}
