import { useTranslation } from "react-i18next";

//Create a checkbox with text to control its state
export default function OptionControl({ state = true, setState = null, text = null }) {
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
		<div className='form-control'>
			<label className='cursor-pointer label'>
				<span className='label-text mr-1'>{text}</span>
				<input type='checkbox' checked={state} className='checkbox checkbox-primary' onChange={handleChange} />
			</label>
		</div>
	);
}
