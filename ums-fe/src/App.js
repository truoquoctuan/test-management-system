import { Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import KeycloakProvider from './utils/KeycloakProvider.js';
import { lazy } from 'react';
import Layout from './components/layout/Layout.jsx';
import 'animate.css';
import PrivateRoute from './utils/PrivateRouter.js';
import { Toaster } from 'sonner';
import LayoutUser from './components/layout/LayoutUser.jsx';
const Workspace = lazy(() => import('./pages/workspace/Workspace.jsx'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard.jsx'));
const Services = lazy(() => import('./pages/services/Services.jsx'));
const CreateAccount = lazy(() => import('./pages/account/CreateAccount.jsx'));
const UpdateAccount = lazy(() => import('./pages/account/UpdateAccount.jsx'));
const Profile = lazy(() => import('./pages/user/Profile.jsx'));
const Account = lazy(() => import('./pages/account/Account.jsx'));
const UpdateUser = lazy(() => import('./pages/user/UpdateUser.jsx'));
const Setting = lazy(() => import('./pages/setting/Setting.jsx'));
const Security = lazy(() => import('./pages/user/Security.jsx'));
const NotFound = lazy(() => import('./pages/notFound/NotFound.jsx'));
const Help = lazy(() => import('./pages/help/Help.jsx'));
function App() {
  return (
    <KeycloakProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index path="/" element={<Workspace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/accounts" element={<Account />} />
          <Route path="/accounts/create" element={<CreateAccount />} />
          <Route path="/accounts/update/:idUser" element={<UpdateAccount />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/help" element={<Help />} />
        </Route>
        <Route element={<LayoutUser />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update/:idUser" element={<UpdateUser />} />
          <Route path="/security" element={<Security />} />
          <Route path="/help" element={<Help />} />
        </Route>
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-right" />
    </KeycloakProvider>
  );
}

export default App;
