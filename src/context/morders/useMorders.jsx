import React, { useContext } from 'react';
import { MordersContext } from '../MordersContext';

export default function useMorders() {
	const { morders, dispatch } = useContext(MordersContext);
	

	return { morders };
}
