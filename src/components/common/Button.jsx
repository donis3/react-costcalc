import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	FaSave as SaveIcon,
	FaPencilAlt as EditIcon,
	FaTrashAlt as DeleteIcon,
	FaTimes as RemoveIcon,
	FaCheck as SubmitIcon,
	FaUndo as ResetIcon,
	FaTimes as CancelIcon,
	FaTimes as CloseIcon,
	FaPlus as AddIcon,
	FaArrowLeft as BackIcon,
} from 'react-icons/fa';

function Button({ children, type, ...attributes }) {
	return (
		<button type={type} className='btn btn-primary' {...attributes}>
			{children}
		</button>
	);
}
Button.defaultProps = {
	type: 'button',
};

//Premade Buttons

function SaveButton({ children, iconFirst = true, ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				{iconFirst && <SaveIcon className='mr-1' />}
				{t('buttons.save')}
				{!iconFirst && <SaveIcon className='ml-1' />}
			</>
		);
	}
	return (
		<button className='btn btn-primary btn-sm' {...attributes}>
			{children}
		</button>
	);
}

function SubmitButton({ children, iconFirst = true, ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				{iconFirst && <SubmitIcon className='mr-1' />}
				{t('buttons.submit')}
				{!iconFirst && <SubmitIcon className='ml-1' />}
			</>
		);
	}
	return (
		<button className='btn btn-primary btn-sm' {...attributes}>
			{children}
		</button>
	);
}

function ResetButton({ children, iconFirst = true, ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				{iconFirst && <ResetIcon className='mr-1' />}
				{t('buttons.reset')}
				{!iconFirst && <ResetIcon className='ml-1' />}
			</>
		);
	}
	return (
		<button className='btn btn-accent btn-sm' {...attributes}>
			{children}
		</button>
	);
}
function CancelButton({ children, iconFirst = true, ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				{iconFirst && <CancelIcon className='mr-1' />}
				{t('buttons.cancel')}
				{!iconFirst && <CancelIcon className='ml-1' />}
			</>
		);
	}
	return (
		<button className='btn btn-secondary btn-sm' {...attributes}>
			{children}
		</button>
	);
}
function CloseButton({ children, iconFirst = true, ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				{iconFirst && <CloseIcon className='mr-1' />}
				{t('buttons.close')}
				{!iconFirst && <CloseIcon className='ml-1' />}
			</>
		);
	}
	return (
		<button className='btn btn-sm' {...attributes}>
			{children}
		</button>
	);
}

function EditButton({ children, iconFirst = true, ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				{iconFirst && <EditIcon className='mr-1' />}
				{t('buttons.edit')}
				{!iconFirst && <EditIcon className='ml-1' />}
			</>
		);
	}
	return (
		<button className='btn btn-ghost btn-outline btn-sm' {...attributes}>
			{children}
		</button>
	);
}

function DeleteButton({ children, iconFirst = true, ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				{iconFirst && <DeleteIcon className='mr-1' />}
				{t('buttons.delete')}
				{!iconFirst && <DeleteIcon className='ml-1' />}
			</>
		);
	}
	return (
		<button className='btn btn-error btn-sm' {...attributes}>
			{children}
		</button>
	);
}

function RemoveButton({ children, hasText = true, ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				<RemoveIcon className='' />
				{hasText && <span className='ml-1'>{t('buttons.remove')}</span>}
			</>
		);
	}
	return (
		<button className='btn btn-error btn-sm px-2' {...attributes}>
			{children}
		</button>
	);
}

function AddButton({ children, iconFirst = true, ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				{iconFirst && <AddIcon className='mr-1' />}
				{t('buttons.add')}
				{!iconFirst && <AddIcon className='ml-1' />}
			</>
		);
	}
	return (
		<button className='btn btn-primary btn-sm' {...attributes}>
			{children}
		</button>
	);
}

function NewButton({ children, iconFirst = true, name = '', ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				{iconFirst && <AddIcon className='mr-1' />}
				{t('buttons.new')}
				{name && ` ${name}`}
				{!iconFirst && <AddIcon className='ml-1' />}
			</>
		);
	}
	return (
		<button className='btn btn-primary btn-sm' {...attributes}>
			{children}
		</button>
	);
}

function EditSmall({ ...attributes }) {
	return (
		<button className='btn btn-ghost btn-sm' {...attributes}>
			<EditIcon />
		</button>
	);
}

function BackButton({ children, iconFirst = true, name = '', ...attributes }) {
	const { t } = useTranslation('translation');
	if (!children) {
		children = (
			<>
				{iconFirst && <BackIcon className='mr-1' />}
				{t('buttons.back')}
				{name && ` ${name}`}
				{!iconFirst && <BackIcon className='ml-1' />}
			</>
		);
	}
	return (
		<button className='btn btn-ghost btn-sm' {...attributes}>
			{children}
		</button>
	);
}

//Add custom buttons
Button.Save = SaveButton;
Button.Submit = SubmitButton;
Button.Reset = ResetButton;
Button.Cancel = CancelButton;
Button.Close = CloseButton;
Button.Edit = EditButton;
Button.Delete = DeleteButton;
Button.Remove = RemoveButton;
Button.Add = AddButton;
Button.New = NewButton;
Button.EditSmall = EditSmall;
Button.Back = BackButton;

export default Button;
