import React from 'react';
import { Link } from 'react-router-dom';

export default function Recipes() {
	return (
		<div>
			Recipes
			<Link to='/recipes/add' className='btn btn-primary m-2 p-2'>
				New Recipe
			</Link>
			<Link to='/recipes/edit/1' className='btn btn-primary m-2 p-2'>
				Edit Recipe
			</Link>
		</div>
	);
}
