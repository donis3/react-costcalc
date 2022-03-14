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
	FaCaretRight,
} from 'react-icons/fa';
import FormInput from '../../components/form/FormInput';
import MaterialInfo from '../materials/MaterialInfo';

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
		showMaterial: false,
		materialId: null,
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
		newYieldRef.current.value = recipe.yield;

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipeId]);

	//Show /Hide material modal
	const closeMaterial = () => setRecipeState((state) => ({ ...state, showMaterial: false, materialId: null }));
	const openMaterial = (materialId) => setRecipeState((state) => ({ ...state, showMaterial: true, materialId }));

	if (!recipeState.recipe) {
		return <></>;
	}
	return (
		<>
			<div className='mb-1'>
				<Link to='/recipes'>
					<Button.Back />
				</Link>
			</div>

			<Card className='w-100 px-3 py-5 ' shadow='shadow-lg'>
				{/* Header */}
				<div className='w-full flex justify-between items-center border-b'>
					{/* Card Title */}
					<h3 className='text-4xl py-2 font-semibold'>{recipeState.recipe.name}</h3>
					{/* Action Button */}
					<Link to={`/recipes/edit/${recipeState.recipe.recipeId}`}>
						<Button.Edit />
					</Link>
				</div>

				{/* Half / Half divided */}
				<div className='w-full flex'>
					<div className='py-3 px-3 w-1/2 '>
						<div>
							{/* Product Name */}
							<h4 className='text-base-content opacity-50 text-sm'>{t('labels.product')}</h4>
							<p className='text-base-content text-base font-medium mb-3'>
								{recipeState.recipe.product && recipeState.recipe.product.name}
							</p>
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
						<MaterialsTable recipe={recipeState.recipe} openMaterial={openMaterial} />
					</div>
				)}
			</Card>
			{recipeState.showMaterial && <MaterialInfo handleClose={closeMaterial} materialId={recipeState.materialId} />}
		</>
	);
}

function RecipeUnitCost({ recipe = null }) {
	const { t } = useTranslation('pages/recipes');
	const { displayMoney } = useIntl();

	if (!recipe) return <></>;
	return (
		<div className='stats shadow'>
			<div className='stat'>
				<div className='stat-title'>{t('recipe.unitCost')}</div>
				<div className='stat-value text-3xl'>
					{displayMoney(recipe.unitCost)}
					<span className='text-base font-semibold'>/{recipe.unit}</span>
				</div>
				<div className='stat-desc'>
					{t('recipe.unitCostTax', {
						taxedCost: displayMoney(recipe.unitCostWithTax),
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

function MaterialsTable({ recipe = null, openMaterial = null } = {}) {
	const { t } = useTranslation('pages/recipes', 'translation');

	if (!recipe || !recipe.materials || !Array.isArray(recipe.materials) || recipe.materials.length === 0) {
		return <p className='mt-1 text-sm italic'>{t('recipe.noContent')}</p>;
	}

	return (
		<div className='w-full'>
			<div className='grid grid-cols-12 font-semibold uppercase bg-base-300 text-base-content rounded-t-md'>
				<div className='col-span-4 p-3'>{t('labels.material')}</div>
				<div className='col-span-2 p-3'>{t('labels.unitPrice', { ns: 'translation' })}</div>
				<div className='col-span-2 p-3'>{t('labels.tax', { ns: 'translation' })}</div>
				<div className='col-span-2 p-3'>{t('labels.amount')}</div>
				<div className='col-span-2 p-3'>{t('labels.cost', { ns: 'translation' })}</div>
			</div>
			<div className='grid grid-cols-12  leading-snug'>
				{recipe.materials.map((data, i) => (
					<MaterialsTableRow index={i} data={data} key={i} openMaterial={openMaterial} />
				))}
			</div>
			<MaterialsTableFooter cost={recipe.cost} costWithTax={recipe.costWithTax} costDetails={recipe.getTaxCosts()} />
		</div>
	);
}

function MaterialsTableFooter({ cost, costWithTax, costDetails }) {
	const { t } = useTranslation('translation');
	const { displayMoney } = useIntl();
	const [showDetails, setShowDetails] = useState(false);

	const toggleDetails = () => {
		setShowDetails((state) => !state);
	};

	return (
		<div className='grid grid-cols-12  leading-snug border-t-4 pt-2 gap-y-1'>
			{/* Taxed Total always shown */}
			<div className='col-span-10 px-3 flex justify-end'>
				<button onClick={toggleDetails} className='flex gap-x-1 items-center'>
					{showDetails ? <FaCaretDown className='text-blue-600' /> : <FaCaretRight className='text-blue-600' />}
					<span className='border-b border-neutral border-dotted'>{t('labels.totalWitTax')}</span>
				</button>
			</div>
			<div className='col-span-2 px-3  text-left font-medium'>{displayMoney(costWithTax)}</div>

			{/* Optional Details */}
			{showDetails ? (
				// Show Details
				<>
					<MaterialsTableFooterRow text={t('labels.total')} amount={cost} />
					{Object.keys(costDetails).map((key, i) => {
						if (key === 'total') {
							return <MaterialsTableFooterRow key={i} text={t('labels.taxTotal')} amount={costDetails[key]} />;
						} else {
							return (
								<MaterialsTableFooterRow
									key={i}
									text={t('labels.taxPercent', { percent: key })}
									amount={costDetails[key]}
								/>
							);
						}
					})}
				</>
			) : (
				// Dont show details
				<></>
			)}
		</div>
	);
}

function MaterialsTableFooterRow({ text = '', amount = 0 }) {
	const { displayMoney } = useIntl();
	return (
		<>
			<div className='col-span-10 px-3 text-right '>{text}</div>
			<div className='col-span-2 px-3  text-left font-medium'>{displayMoney(amount)}</div>
		</>
	);
}

function MaterialsTableRow({ index, data, openMaterial = null }) {
	const { name = '', price = 0, tax = 0, amount = 0, unit = 'kg', cost = 0 } = data;
	const { displayNumber, displayMoney } = useIntl();
	const stripeClass = index % 2 === 0 ? '  ' : ' bg-base-200 ';
	const additionalClass = ' p-3 ';

	return (
		<>
			<div className={'col-span-4 ' + stripeClass + additionalClass}>
				<button
					type='button'
					onClick={() => openMaterial(data.materialId)}
					className='font-semibold border-b border-dotted border-base-content'
				>
					{name}
				</button>
			</div>
			<div className={'col-span-2 ' + stripeClass + additionalClass}>{displayMoney(price)}</div>
			<div className={'col-span-2 ' + stripeClass + additionalClass}>% {displayNumber(tax, 1)}</div>
			<div className={'col-span-2 ' + stripeClass + additionalClass}>
				{displayNumber(amount, 2)} {unit}
			</div>
			<div className={'col-span-2 ' + stripeClass + additionalClass}>{displayMoney(cost)}</div>
		</>
	);
}
