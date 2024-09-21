import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage'; // Adjust the path if necessary
import SignUpPage from './SignUpPage'; // Adjust the path if necessary
import ForgotPasswordPage from './ForgotPasswordPage'; // Adjust the path if necessary

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SignUpPage />} />
                <Route path="/forgot" element={<ForgotPasswordPage />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
