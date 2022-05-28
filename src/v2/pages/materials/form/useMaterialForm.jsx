import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MaterialsDispatchContext } from '../../../context/materials';
import useMaterialsDefaults from '../../../context/materials/useMaterialsDefaults';
import useRecipes from '../../../context/recipes/useRecipes';
import useConfig from '../../../hooks/app/useConfig';
import useMoney from '../../../hooks/app/useMoney';
import useFormBuilder from '../../../hooks/forms/useFormBuilder';

export default function useMaterialForm({ material = null, isEdit = false }) {
	const { t } = useTranslation('pages/materials', 'translation');
	const config = useConfig();
	const navigate = useNavigate();
	const { selectCurrencyArray, defaultCurrency } = useMoney();

	//Load Required Repos
	const { recipes } = useRecipes();
	const dispatch = useContext(MaterialsDispatchContext);

	//==========================// Form States //===================================//
	//is form submitted
	const [isSubmitted, setSubmitted] = useState(false);
	let initialState = { name: '', unit: 'kg', density: 1, currency: defaultCurrency, provider: '', price: '', tax: '' };
	if (material) {
		initialState = { ...initialState, ...material };
	}

	//==========================// Form Handling Library //===================================//
	const { schema, register, getError, handleChange, getFormData, setValue, getValue, resetForm } = useFormBuilder({
		initialState,
		isSubmitted,
	});

	//Add schema rules
	useMaterialsDefaults({ schema, isEdit });

	//==========================// Form Select Arrays Data //===================================//
	const selectCurrency = selectCurrencyArray();
	const selectUnit = config.getLocalizedUnitSelectOptions({ weight: true, volume: true });

	//==========================// Form Handlers //===================================//
	const handleSubmit = (e) => {
		//Define dispatches
		const handleUpdateMaterial = (data) => {
			dispatch({
				type: 'update',
				payload: data,
				success: () => {
					toast.success(t('form.updateSuccess', { name: data.name }));
					navigate('/materials/' + data.materialId);
				},
				error: (code = 'update') => toast.error(t('error.' + code, { ns: 'translation' })),
			});
		};
		const handleAddMaterial = (data) => {
			dispatch({
				type: 'add',
				payload: data,
				success: () => {
					toast.success(t('form.addSuccess', { name: data.name }));
				},
				error: (code = 'add') => toast.error(t('error.' + code, { ns: 'translation' })),
			});
			navigate('/materials/');
		};

		//Execute
		try {
			const data = getFormData(true);
			if (!isEdit) {
				handleAddMaterial(data);
			} else {
				handleUpdateMaterial(data);
			}
		} catch (err) {
			//Form errors.
		}
	};

	const handleReset = () => {
		resetForm();
	};

	const handleDelete = () => {
		if (!material) return;
		const boundRecipes = recipes?.getByMaterial?.(material.materialId) || [];

		//If any recipe is using this material, disallow
		if (boundRecipes && Array.isArray(boundRecipes) && boundRecipes.length > 0) {
			toast.error(t('form.boundRecipeError', { count: boundRecipes.length }));
			return;
		}
		dispatch({
			type: 'delete',
			payload: material,
			success: () => {
				toast.success(t('form.deleteSuccess', { name: material.name }));
				navigate('/materials/');
			},
			error: (code = 'delete') => toast.error(t('error.' + code, { ns: 'translation' })),
		});
	};

	return {
		select: { currencies: selectCurrency, units: selectUnit },
		initialState,
		getValue,
		setValue,
		handleSubmit,
		handleReset,
		handleChange,
		register,
		setSubmitted,
		getError,
		handleDelete,
	};
}
