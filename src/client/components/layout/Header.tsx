import { ClientLink } from '../common/ClientLink';
import { useAuth } from '../../context/AuthContext';
import { useClientNavigation } from '../../hooks/useClientNavigation';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useClientNavigation();

  const handleLogout = async () => {
    await logout();
    // Use our improved navigation hook which properly uses History API
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <ClientLink to="/" className="text-xl font-bold text-blue-600">Task Manager</ClientLink>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <ClientLink
                to="/"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </ClientLink>
              {user && (
                <ClientLink
                  to="/tasks"
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Tasks
                </ClientLink>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Hello, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <ClientLink
                  to="/login"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Log In
                </ClientLink>
                <ClientLink
                  to="/signup"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign Up
                </ClientLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
