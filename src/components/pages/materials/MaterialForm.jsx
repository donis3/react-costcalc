import React from 'react';


export default function MaterialForm() {
	return (
		<form className='grid sm:grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1'>
			<FormItem label='Material Name' altLabel='Details about material' error=''>
				<input type='text' className='input input-bordered ' />
			</FormItem>
		</form>
	);
}

function FormItem({ children, label = null, error = null, altLabel = null }) {
	return (
		<div className='form-control '>
			<label className='label'>
				<span className='label-text'>{label}</span>
			</label>
			{children}
			<label className={error ? 'label text-error font-semibold' : 'label'}>
				<span className='leading-3 text-sm'>{error ? error : altLabel}</span>
			</label>
		</div>
	);
}
