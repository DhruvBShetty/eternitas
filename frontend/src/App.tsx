import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage'; // Adjust the path if necessary
import SignUpPage from './SignUpPage'; // Adjust the path if necessary
import ForgotPasswordPage from './ForgotPasswordPage'; // Adjust the path if necessary
import ProfilePage from './ProfilePage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />  {/* Default route */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SignUpPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/forgot" element={<ForgotPasswordPage />} />
            </Routes>
        </Router>
    );
}

export default App;
