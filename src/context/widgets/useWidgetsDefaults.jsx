import React from 'react';

export default function useWidgetsDefaults() {
	const widgets = {
		todos: [],
	};

	return { defaultWidgetsData: widgets };
}
