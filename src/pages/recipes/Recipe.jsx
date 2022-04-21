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
	FaCaretDown,
	FaCaretUp,
} from 'react-icons/fa';
import FormInput from '../../components/form/FormInput';

import DocumentDates from '../../components/common/DocumentDates';
import CostTable from '../../components/CostTable/CostTable';
import RecipeCostHistory from './details/RecipeCostHistory';

import ModuleHeader from '../../components/layout/ModuleHeader';

export default function Recipe() {
	const { page } = useAppContext();
	const { recipeId } = useParams();
	const navigate = useNavigate();
	const { displayNumber } = useIntl();
	const { recipe } = useRecipe(recipeId);
	const { t } = useTranslation('pages/recipes', 'translation');
	const [recipeState, setRecipeState] = useState({
		showChangeYield: false,
		recipe: recipe,
		showCostHistory: false,
	});
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
		if (recipe && newYieldRef.current) {
			newYieldRef.current.value = recipe.yield;
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipeId]);

	useEffect(() => {
		//save cost if needed
		if (recipe) recipe.saveUnitCost();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//Show /Hide material modal
	const openCostHistory = () => setRecipeState((state) => ({ ...state, showCostHistory: true }));
	const closeCostHistory = () => setRecipeState((state) => ({ ...state, showCostHistory: false }));

	if (!recipeState.recipe) {
		return <></>;
	}
	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={recipeState.recipe.name} module='recipes' role='view'>
					{/* Links */}
					<Button.Chart forceIcon onClick={openCostHistory}>
						{t('charts.costHistory', { ns: 'translation' })}
					</Button.Chart>
					<Link to={`/recipes/edit/${recipeState.recipe.recipeId}`}>
						<Button.Edit />
					</Link>
				</ModuleHeader>

				{/* Half / Half divided */}
				<div className='w-full flex'>
					<div className='py-3 px-3 w-1/2 '>
						<div>
							{/* Product Name */}
							<h4 className='text-base-content opacity-50 text-sm'>{t('labels.product')}</h4>
							<p className='text-base-content text-base font-medium mb-3'>
								{recipeState.recipe.product && recipeState.recipe.product.name}
							</p>
							{recipeState.recipe.isLiquid() ? (
								<>
									{/* Product Density */}
									<h4 className='text-base-content opacity-50 text-sm'>{t('labels.density', { ns: 'translation' })}</h4>
									<p className='text-base-content text-base font-medium mb-3'>
										{displayNumber(recipeState.recipe.getDensity(), 2)}
										<span className='ml-1 text-xs opacity-50'>
											g/cm<sup>3</sup>
										</span>
									</p>
								</>
							) : (
								''
							)}
						</div>
						<div>
							{/* Editable Yield Section */}
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
							{/* Editable Yield Section END */}
						</div>
					</div>
					<div className='p-3 w-1/2 flex justify-end '>
						{/* Recipe Unit Cost Stat Component */}
						<RecipeUnitCost recipe={recipeState.recipe} />
					</div>
				</div>

				{/* Notes for recipe */}
				{recipeState.recipe.notes && (
					<div className='py-3 px-3 w-full'>
						<h4 className='text-base-content opacity-50 text-sm'>{t('labels.notes')}</h4>
						<p className='mt-2 opacity-80 whitespace-pre leading-snug'>{recipeState.recipe.notes}</p>
					</div>
				)}

				{/* Materials */}
				{recipeState.recipe.materials && recipeState.recipe.materials.length > 0 && (
					<div className='py-3 px-3 w-full overflow-x-auto'>
						<h4 className='text-base-content opacity-50 text-sm mb-3'>{t('labels.contents')}</h4>
						{/* <MaterialsTable recipe={recipeState.recipe} openMaterial={openMaterial} /> */}
						<CostTable
							costs={recipeState.recipe.getCostDetailsForTable()}
							items={recipeState.recipe.getMaterialsForTable()}
						/>
					</div>
				)}
			</Card>

			<DocumentDates updatedAt={recipe?.updatedAt} createdAt={recipe?.createdAt} />
			{recipeState.showCostHistory && <RecipeCostHistory handleClose={closeCostHistory} recipe={recipeState.recipe} />}
		</>
	);
}

function RecipeUnitCost({ recipe = null }) {
	const { t } = useTranslation('pages/recipes');
	const { displayMoney } = useIntl();

	const priceChange = recipe.getCostChangePercent();

	const showPriceChange = (
		<span className={`text-sm flex items-center ${priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
			{/* indicator */}
			{priceChange} % {priceChange > 0 ? <FaCaretUp /> : <FaCaretDown />}
		</span>
	);

	if (!recipe) return <></>;
	return (
		<div className='stats shadow'>
			<div className='stat'>
				<div className='stat-title flex justify-between gap-x-10'>
					<span>{t('recipe.unitCost')}</span>
					{/* Price change indicator */}
					{priceChange !== 0 && showPriceChange}
				</div>

				<div className='stat-value text-3xl'>
					{displayMoney(recipe.getLatestUnitCost('cost'))}
					<span className='text-base font-semibold'>/{recipe.unit}</span>
				</div>
				<div className='stat-desc'>
					{t('recipe.unitCostTax', {
						taxedCost: displayMoney(recipe.getLatestUnitCost('costWithTax')),
						unit: recipe.unit,
					})}
				</div>
			</div>
		</div>
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
