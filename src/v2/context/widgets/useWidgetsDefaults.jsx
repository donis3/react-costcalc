export default function useWidgetsDefaults() {
	const widgets = {
		todos: [],
	};

	const defaultTodo = {
		todoId: null,
		text: null,
		isComplete: false,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};

	return { defaultWidgetsData: widgets, defaultTodo };
}
