import { ToastContainer } from 'react-toastify';
import Footer from './components/layout/Footer';
import MainLayout from './components/layout/MainLayout';
import Navbar from './components/layout/Navbar';
import reactToastifyConfig from './config/reactToastify';
import ContextWrapper from './context/ContextWrapper';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './pages/other/ErrorBoundary';
import Router from './router/';


function App() {
	

	return (
		// Error boundary will catch thrown errors and display a route
		<ErrorBoundary>
			{/*Global React-Toastify*/}
			<ToastContainer {...reactToastifyConfig} />
			<ContextWrapper>
				<MainLayout footer={<Footer />} header={<Navbar />}>
					<Router />
				</MainLayout>
			</ContextWrapper>
		</ErrorBoundary>
	);
}

export default App;
