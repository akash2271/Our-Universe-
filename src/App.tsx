import { AppProvider, useApp } from './hooks/useApp';
import { AuthProvider } from './hooks/useAuth';
import Dashboard from './components/dashboard/Dashboard';
import LoadingScreen from './components/shared/LoadingScreen';

function AppContent() {
  const { loading } = useApp();

  if (loading) {
    return <LoadingScreen />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}
