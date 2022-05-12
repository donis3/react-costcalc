import { useTranslation } from 'react-i18next';

//Create a checkbox with text to control its state
export default function OptionControl({ state = true, setState = null, text = null, checkboxFirst = false }) {
	const { t } = useTranslation('translation');
	if (text === null) text = t('form.checkboxLabel');

	const handleChange = (e) => {
		if (typeof setState === 'function') {
			if (e.target.checked) {
				setState(true);
			} else {
				setState(false);
			}
		}
	};
	return (
		<div className='form-control py-1'>
			<label className={`cursor-pointer flex items-center gap-x-2 ${!checkboxFirst && ' justify-between'}`}>
				{!checkboxFirst && <span className='label-text'>{text}</span>}
				<input type='checkbox' checked={state} className='checkbox checkbox-primary min-w-[25px]' onChange={handleChange} />
				{checkboxFirst && <span className='label-text'>{text}</span>}
			</label>
		</div>
	);
}
