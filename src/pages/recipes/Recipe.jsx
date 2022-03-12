import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import { useAppContext } from '../../context/AppContext';
import useRecipe from '../../hooks/recipes/useRecipe';
import Button from '../../components/common/Button';
import useIntl from '../../hooks/common/useIntl';
import {
	FaPen as ChangeYieldIcon,
	FaCheck as SaveYieldIcon,
	FaTimes as CancelYieldIcon,
	FaUndo as ResetYieldIcon,
} from 'react-icons/fa';
import FormInput from '../../components/form/FormInput';

export default function Recipe() {
	const { page } = useAppContext();
	const { recipeId } = useParams();
	const navigate = useNavigate();
	const { displayNumber } = useIntl();
	const { recipe } = useRecipe(recipeId);
	const { t } = useTranslation('pages/recipes', 'translation');
	const [recipeState, setRecipeState] = useState({ showChangeYield: false, recipe: recipe });
	const newYieldRef = useRef();

	//Handle recipeId change
	useEffect(() => {
		//If recipe object is falsy, recipe doesnt exist
		if (!recipe) {
			navigate('/notfound');
		}
		//Load recipe to state
		if (recipe !== recipeState.recipe) {
			setRecipeState((state) => ({ ...state, recipe: recipe }));
		}
		//Set breadcrumb
		page.setBreadcrumb(recipe?.name);

		//Set yield amount for change yield input
		newYieldRef.current.value = recipe.yield;

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipeId]);

	if (!recipeState.recipe) {
		return <></>;
	}
	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				{/* Header */}
				<div className='w-full flex justify-between items-center border-b'>
					{/* Card Title */}
					<h3 className='text-2xl py-2 font-semibold'>{recipeState.recipe.name}</h3>
					{/* Action Button */}
					<Link to={`/recipes/edit/${recipeState.recipe.recipeId}`}>
						<Button.Edit />
					</Link>
				</div>

				<div className='py-3 px-3'>
					<h4 className='text-base-content opacity-50 text-sm'>{t('labels.product')}</h4>
					<p className='text-base-content text-md font-medium mb-3'>
						{recipeState.recipe.product && recipeState.recipe.product.name}
					</p>
				</div>
				<div className='text-red-600 p-5 text-xl font-medium'>
					TODO: SHOW COST / UNIT
				</div>
				<div className='py-3 px-3 max-w-2xl'>
					<div className={`w-1/2 ${recipeState.showChangeYield ? ' hidden' : ''}`}>
						<h4 className='text-base-content opacity-50 text-sm'>
							{t('labels.yield')}
							<button
								type='button'
								className='text-neutral text-xs ml-2 p-1 hover:bg-base-300 rounded-lg'
								title={t('recipe.changeYield')}
								onClick={() => setRecipeState((state) => ({ ...state, showChangeYield: !state.showChangeYield }))}
							>
								<ChangeYieldIcon />
							</button>
						</h4>
						<p className='text-base-content text-md font-medium mb-3'>
							{displayNumber(recipeState.recipe.yield, 2)} {recipeState.recipe.unit}
						</p>
					</div>
					{/* Show editable yield */}
					<EditableYield state={recipeState} setState={setRecipeState} yieldRef={newYieldRef} />
				</div>

				{recipeState.recipe.notes && (
					<div className='py-3 px-3 max-w-2xl'>
						<h4 className='text-base-content opacity-50 text-sm'>{t('labels.notes')}</h4>
						<p className='mt-2 opacity-80 whitespace-pre leading-snug'>{recipeState.recipe.notes}</p>
					</div>
				)}

				{/* Materials */}
				{recipeState.recipe.materials && recipeState.recipe.materials.length > 0 && (
					<div className='py-3 px-3 max-w-2xl'>
						<h4 className='text-base-content opacity-50 text-sm mb-3'>{t('labels.contents')}</h4>
						<MaterialsTable materials={recipeState.recipe.materials} />
					</div>
				)}
			</Card>
		</>
	);
}

function EditableYield({ state, setState, yieldRef }) {
	const { t } = useTranslation('pages/recipes');

	//Will change recipe yield temporarily.
	const changeYield = () => {
		const newYield = parseFloat(yieldRef.current.value);
		if (isNaN(newYield)) return;
		if (newYield <= 0) return;
		//Request change yield to recipe class and save the result in state
		const newRecipeState = state.recipe.changeRecipeYield(newYield);
		if (!newRecipeState) return; //Nothing to change
		//Send to state and hide change yield
		setState((state) => ({ ...state, recipe: newRecipeState, showChangeYield: false }));
	};
	const hideChangeYield = () => {
		setState((state) => ({ ...state, showChangeYield: false }));
	};
	const resetYield = () => {
		const newRecipeState = state.recipe.resetRecipeYield();
		if (!newRecipeState) return hideChangeYield();
		setState((state) => ({ ...state, recipe: newRecipeState, showChangeYield: false }));
	};

	return (
		<div className={`form-control ${state.showChangeYield ? '' : ' hidden'}`}>
			<label className='label'>
				<span className='label-text'>{t('recipe.newYield', { unit: state.recipe.unit })}</span>
			</label>
			<div className='input-group'>
				{/* <input type='text' className='input input-bordered' ref={yieldRef} /> */}
				<FormInput.Text reference={yieldRef} filter='number' name='newYield' />
				<button className='btn btn-outline text-green-800 ' onClick={changeYield}>
					<SaveYieldIcon />
				</button>
				{state.recipe.yield !== state.recipe.recipe.yield && (
					<button className='btn btn-outline text-blue-700 ' onClick={resetYield}>
						<ResetYieldIcon />
					</button>
				)}

				<button className='btn btn-outline text-red-600 ' onClick={hideChangeYield}>
					<CancelYieldIcon />
				</button>
			</div>
		</div>
	);
}

function MaterialsTable({ materials = null } = {}) {
	const { t } = useTranslation('pages/recipes', 'translation');
	const { displayNumber } = useIntl();

	if (!materials || !Array.isArray(materials) || materials.length === 0) {
		return <p className='mt-1 text-sm italic'>{t('recipe.noContent')}</p>;
	}
	return (
		<>
			<table className='table table-zebra w-full table-compact'>
				<thead>
					<tr>
						<th className='w-1/6'>#</th>
						<th className='w-3/6'>{t('labels.material')}</th>
						<th className='w-2/6'>{t('labels.amount')}</th>
					</tr>
				</thead>
				<tbody>
					{materials.map((item, i) => {
						return (
							<tr key={i}>
								<td>{i + 1}</td>
								<td>{item.name}</td>
								<td>
									{displayNumber(item.amount, 2)}{' '}
									{t(`units.${item.unit}`, { ns: 'translation', count: Math.round(item.amount) })}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</>
	);
}
