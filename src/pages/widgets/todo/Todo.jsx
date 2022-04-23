import React, { useRef} from 'react';
import useTodos from '../../../context/widgets/useTodos';
import { FaTasks, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import useJoi from '../../../hooks/common/useJoi';
import DeleteButton from '../../../components/common/DeleteButton';
import ReactTooltip from 'react-tooltip';

export default function Todo() {
	const { t } = useTranslation('pages/homepage', 'translation');
	const todoTextRef = useRef();
	const todoErrorRef = useRef();
	const Joi = useJoi();
	const { todos, actions } = useTodos();

	const schema = Joi.string().min(3).max(200).label(t('widgets.todosName'));

	const showError = (msg = '') => {
		if (msg) {
			todoErrorRef.current.innerText = msg;
		} else {
			todoErrorRef.current.innerText = '';
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const { value, error } = schema.validate(todoTextRef.current?.value);
		if (error && error.details && Array.isArray(error.details) && error.details[0]) {
			showError(error.details[0].message);
		} else {
			//Add value
			actions.add(value);
			//Clear error
			showError();
			//clear text
			todoTextRef.current.value = '';
		}
	};

	const handleReset = () => {
		actions.reset();
	};

	return (
		<div>
			<ReactTooltip effect='solid' multiline id='tasks' />
			<div className='border-b p-2 flex flex-wrap items-center justify-between bg-base-300'>
				<div className='flex items-center gap-x-2'>
					<FaTasks className='text-xl' />
					<h3 className='font-semibold text-xl'>{t('widgets.todosTitle')}</h3>
				</div>
				<DeleteButton
					data-tip={t('widgets.todosReset')}
					data-for='tasks'
					small
					onClick={handleReset}
					className='btn btn-ghost btn-xs'
				>
					<FaTrashAlt />
				</DeleteButton>
			</div>
			<div className='pt-3 px-5 bg-base-100'>
				<form onSubmit={handleSubmit}>
					<div className=' flex items-center gap-x-2'>
						<input type='text' name='todo' className='input input-bordered flex-1' ref={todoTextRef} />
						<button type='submit' className='btn w-1/12 '>
							{t('buttons.add', { ns: 'translation' })}
						</button>
					</div>
					<label ref={todoErrorRef} className='pt-1 text-sm text-error-content'></label>
				</form>
			</div>

			<div className='px-3 mt-5 pb-3'>
				{Array.isArray(todos) && todos.length > 0 ? (
					<ul>
						{todos.map((todo, i) => {
							return <TodoItem key={i} data={todo} toggle={actions.toggle} remove={actions.remove} />;
						})}
					</ul>
				) : (
					<p className='text-sm italic'>{t('widgets.todosNoItems')}</p>
				)}
			</div>
		</div>
	);
}

function TodoItem({ data, toggle, remove } = {}) {
	if (!toggle || typeof toggle !== 'function' || typeof remove !== 'function') return <></>;
	const { text, isComplete, todoId } = data;

	const handleToggle = () => {
		toggle(todoId);
	};
	const handleDelete = () => {
		remove(todoId);
	};
	return (
		<li className='p-0 rounded-md border m-3 flex justify-between items-center'>
			<div
				className='flex gap-x-2 items-center flex-1 cursor-pointer select-none p-2 hover:bg-base-200'
				onClick={handleToggle}
			>
				<input
					type='checkbox'
					className={`checkbox checkbox-sm ${isComplete && 'checkbox-primary'}`}
					readOnly
					checked={isComplete}
				/>
				<label className={`text-base font-medium ${isComplete && 'line-through'}`}>{text}</label>
			</div>
			<button
				type='button'
				className='p-3 border-l  w-1/12 flex justify-center hover:bg-base-300'
				onClick={handleDelete}
			>
				<FaTimes />
			</button>
		</li>
	);
}
