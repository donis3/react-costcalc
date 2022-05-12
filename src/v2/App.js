import { ToastContainer } from 'react-toastify';
import Footer from './components/layout/Footer';
import MainLayout from './components/layout/MainLayout';
import Navbar from './components/layout/Navbar';
import reactToastifyConfig from './config/reactToastify';

import ErrorBoundary from './pages/common/ErrorBoundary';
import Router from './Router';

function App() {
	return (
		// Error boundary will catch thrown errors and display a route
		<ErrorBoundary>
			{/*Global React-Toastify*/}
			<ToastContainer {...reactToastifyConfig} />
			<MainLayout footer={<Footer />} header={<Navbar />}>
				{/* Routes */}
				<Router />
			</MainLayout>
		</ErrorBoundary>
	);
}

export default App;
