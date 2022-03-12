import {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import ProgressBar from '../../../components/common/ProgressBar';
import { useMaterialContext } from '../../../context/MainContext';
import useIntl from '../../../hooks/common/useIntl';
import RecipeFormMaterialItem from './RecipeFormMaterialItem';
import RecipeFormMaterialRow from './RecipeFormMaterialRow';

export default function RecipeFormMaterials({ formState = null, setFormState = null } = {}) {
	const { Materials } = useMaterialContext();
	const { t } = useTranslation('pages/recipes');
	const { displayNumber } = useIntl();
	const [stats, setStats] = useState({ totalWeight: 0, itemCount: 0, progress: 0, progressBar: 'progress-primary' });

	useEffect(() => {
		if (Array.isArray(formState.materials) === false || formState.materials.length === 0) {
			setStats((currentState) => ({ ...currentState, totalWeight: 0, itemCount: 0 }));
		} else {
			const totalWeight = formState.materials.reduce((total, current) => {
				//Find material for this item
				const material = Materials.findById(current.materialId);
				if (!material) return total;
				const currentItemsWeight = parseFloat(material.density) * parseFloat(current.amount);
				return total + currentItemsWeight;
			}, 0);
			const totalCount = formState.materials.length;
			setStats((currentState) => ({ ...currentState, totalWeight: totalWeight, itemCount: totalCount }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.materials]);

	//When yield or material weight changes, our progress percentage changes
	useEffect(() => {
		const ratio = stats.totalWeight / parseFloat(formState.yield);
		const percentage = Math.round(ratio * 100);
		let progressBar = 'bg-primary';
		if (percentage > 50) progressBar = 'bg-warning-content';
		if (percentage > 100) progressBar = 'bg-error-content';
		setStats((currentState) => ({ ...currentState, progress: percentage, progressBar }));
	}, [formState.yield, stats.totalWeight]);


    //========================== Material API add/remove methods
	const addMaterial = ({ materialId = null, amount = 0, unit = 'kg' } = {}) => {
		if (materialId === null || !unit) return;
		if (isNaN(parseFloat(amount))) return;
		amount = parseFloat(amount);

		//Create new material
		const newItem = { materialId, amount: parseFloat(amount), unit };

		//Check if material already in state. If so, combine them
		if (formState.materials.find((item) => item.materialId === materialId)) {
			//Combination required
			setFormState((currentState) => {
				//Generate a new materials array and combine the duplicate
				const newMaterialsArray = currentState.materials.map((materialItem) => {
					if (materialItem.materialId === materialId) {
						//Combine old material and newly added one's amounts
						return { materialId, amount: parseFloat(materialItem.amount) + amount, unit };
					} else {
						return materialItem;
					}
				});

				//return new material array to state
				return { ...currentState, materials: newMaterialsArray };
			});
		} else {
			//Add as new item
			setFormState((currentState) => {
				return { ...currentState, materials: [...currentState.materials, newItem] };
			});
		}
	};

	const removeMaterial = (materialId = null) => {
		if (materialId === null) return;
		//Set form state without this material
		setFormState((currentState) => {
			//Generate a new materials array and filter out the removal request
			const newMaterialsArray = currentState.materials.filter((item) => item.materialId !== materialId);
			//return new material array to state
			return { ...currentState, materials: newMaterialsArray };
		});
	};


    //========================== JSX
	if (!formState || !setFormState) return <></>;

	return (
		<>
			{/* Content section title */}
			<div className='flex py-1  justify-between items-end'>
				<h1 className='text-xl m-0 p-0'>
					{t('form.titleMaterials')}
					<span className='text-sm opacity-60 ml-1'>({stats.itemCount})</span>
				</h1>
				<div className='text-secondary text-sm'>
					{t('form.contentStats', {
						amount: displayNumber(stats.totalWeight, 2),
						max: displayNumber(formState.yield, 2),
					})}
				</div>
			</div>
			<div className='mb-5 w-full'>
				<ProgressBar className={stats.progressBar} percentage={stats.progress} />
			</div>

			{stats.itemCount === 0 && <div className='mb-5 text-base-content opacity-50'>{t('form.noContent')}</div>}

			<div className='grid grid-cols-6 items-end gap-x-0 gap-y-2 mb-5'>
				{formState.materials &&
					formState.materials.map((item, i) => {
						//Find corresponding material
						const Material = Materials.findById(item.materialId, true);

						return (
							<RecipeFormMaterialItem
								key={i}
                                index={i}
								material={Material}
								amount={item.amount}
								unit={item.unit}
								handleDelete={removeMaterial}
							/>
						);
					})}
			</div>

			<RecipeFormMaterialRow materials={Materials} addMaterial={addMaterial} />
		</>
	);
}
