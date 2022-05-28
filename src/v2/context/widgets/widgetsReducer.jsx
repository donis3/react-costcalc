import { v4 as uuidv4, validate as isUuid } from 'uuid';

/**
 * Available Dispatches:
 *
 * @param {*} state current state
 * @param {*} action dispatch request params
 */
export default function widgetsReducer(state, action) {
	const { type, payload = {}, error, success, dependencies = {} } = action;
	const { defaultTodo } = dependencies;

	const onSuccess = (newState) => {
		success?.();
		return newState;
	};

	const onError = (code) => {
		error?.(code);
		return state;
	};

	/**
	 *  ======================================================================
	 *                                  Actions
	 *  ======================================================================
	 */
	switch (type) {
		//=========================// TODOS //========================//
		/**
		 * TODO Widget ADD action
		 */
		case 'Todos.Add': {
			//Validate
			if (!payload) return onError('invalidData');
			//Add default fields and generate id
			const newTodo = {
				...defaultTodo,
				todoId: uuidv4(),
				text: payload,
			};
			//Check duplicate
			if (Array.isArray(state.todos)) {
				if (state.todos.find((item) => item.text === newTodo.text)) {
					//ALready Exists
					return onError('duplicate');
				}
			}
			//Add
			const newTodos = [...state?.todos, newTodo];
			return onSuccess({ ...state, todos: newTodos });
		}

		/**
		 * TODO Widget TOGGLE action
		 * toggles isComplete value of a todo
		 */
		case 'Todos.Toggle': {
			//Validate
			if (!Array.isArray(state?.todos) || state.todos.length === 0) return onError();
			const todoId = payload;
			if (!isUuid(todoId)) return onError('invalidData');
			//find requested todo
			const target = state.todos.find((item) => item.todoId === todoId);
			if (!target) return onError('invalidData');
			//generate new todo state
			const newTodoState = state.todos.map((item) => {
				if (item.todoId !== todoId) return item;
				//Return toggled item
				return { ...item, isComplete: !item.isComplete, updatedAt: Date.now() };
			});
			//Update state

			return onSuccess({ ...state, todos: newTodoState });
		}

		/**
		 * TODO Widget DELETE action
		 * Removes a todo from todos
		 */
		case 'Todos.Delete': {
			//Validate
			if (!Array.isArray(state?.todos) || state.todos.length === 0) return onError();
			const todoId = payload;
			if (!isUuid(todoId)) return onError('invalidData');
			//find requested todo
			const target = state.todos.find((item) => item.todoId === todoId);
			if (!target) return onError('invalidData');
			//generate new todo state
			const newTodoState = state.todos.filter((item) => item.todoId !== todoId);
			//Update state
			return onSuccess({ ...state, todos: newTodoState });
		}

		/**
		 * TODO Widget RESET action
		 * Removes all todos
		 */
		case 'Todos.Reset': {
			//Update state
			return onSuccess({ ...state, todos: [] });
		}
		/**
		 * Invalid Dispatch
		 */
		default: {
			throw new Error('Invalid Dispatch Type @ Widgets');
		}
	}
} //EOF
