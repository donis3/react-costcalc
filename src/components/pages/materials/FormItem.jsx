import React from 'react';

export default function FormItem({ children, label = null, error = null, altLabel = null, colSpan = 1 }) {
	return (
		<div className={'form-control ' + (colSpan > 1 ? `col-span-${colSpan}` : '')}>
			<label className='label'>
				<span className='label-text'>{label}</span>
			</label>
			{children}
			<label className={error ? 'label text-error-content font-semibold' : 'label text-base'}>
				<span className='leading-3 ' dangerouslySetInnerHTML={{ __html: error ? error : altLabel }} />
			</label>
		</div>
	);
}
