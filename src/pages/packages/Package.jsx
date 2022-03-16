import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Package() {
	const { packageId } = useParams();
	const navigate = useNavigate();

	//Verify the package OR navigate to packages
	useEffect(() => {
		if (isNaN(parseInt(packageId))) {
			return navigate('/packages');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [packageId]);


    //Render
	return <div>Show Package ID: {packageId}</div>;
}
