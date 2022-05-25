import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { WidgetsDispatchContext } from '.';
import useWidgets from './useWidgets';

export default function useTodos() {
	const { t } = useTranslation('pages/homepage', 'translation');
	const { widgets } = useWidgets();
	const dispatch = useContext(WidgetsDispatchContext);

	function addTodo(text = null) {
		const action = {
			type: 'Todos.Add',
			payload: text,
			error: function () {
				const msg = t('error.addName', { ns: 'translation', name: t('widgets.todosName') });
				toast.error(msg, { toastId: 'todo' });
			},
		};
		dispatch(action);
	}

	function toggleTodo(todoId = null) {
		const action = {
			type: 'Todos.Toggle',
			payload: todoId,
		};
		dispatch(action);
	}

	function removeTodo(todoId = null) {
		const action = {
			type: 'Todos.Delete',
			payload: todoId,
			error: function () {
				const msg = t('error.delete', { ns: 'translation', name: t('widgets.todosName') });
				toast.error(msg, { toastId: 'todo' });
			},
		};
		dispatch(action);
	}

	function resetTodos() {
		const action = {
			type: 'Todos.Reset',
			payload: null,
			error: function () {
				const msg = t('error.delete', { ns: 'translation', name: t('widgets.todosName') });
				toast.error(msg, { toastId: 'todo' });
			},
			success: function () {
				const msg = t('success.reset', { ns: 'translation', name: t('widgets.todosName') });
				toast.success(msg, { toastId: 'todo' });
			},
		};
		dispatch(action);
	}

	return { todos: widgets.todos, actions: { add: addTodo, toggle: toggleTodo, remove: removeTodo, reset: resetTodos } };
}
