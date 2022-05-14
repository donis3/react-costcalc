import React from 'react';
import useSettings from '../context/settings/useSettings';

export default function Home() {
	const { settings } = useSettings();

	return <div>Home</div>;
}
