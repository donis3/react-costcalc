import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';
import Router from './Router';
import { loadThemeFromStorage } from './helpers/themeHelper';
import Navbar from './components/layout/Navbar';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContextWrapper from './ContextWrapper';
import toastConfig from './config/toasterConfig';

function App() {
	loadThemeFromStorage();

	return (
		// Error boundary will catch thrown errors and display a route
		<ErrorBoundary>
			{/*Global React-Toastify*/}
			<ToastContainer {...toastConfig} />
			{/* All contexts in this wrapper */}
			<ContextWrapper>
				{/* Main layout object */}
				<MainLayout footer={<Footer />} header={<Navbar />}>
					{/* Routes */}
					<Router />
				</MainLayout>
			</ContextWrapper>
		</ErrorBoundary>
	);
}

export default App;
