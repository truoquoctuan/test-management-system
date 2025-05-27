import { ApolloProvider } from '@apollo/client';
import 'animate.css';
import { clientRepo } from 'apis/apollo/apolloClient';
import { jwtDecode } from 'jwt-decode';
import EmailPreferences from 'pages/setting/EmailPreferences';
import SystemPreferences from 'pages/setting/SystemPreferences';
import GeneralInfor from 'pages/test-plan/GeneralInformation';
import MemberList from 'pages/test-plan/MemberList';
import Information from 'pages/test-plan/update/Information';
import Member from 'pages/test-plan/update/Member';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import KeycloakProvider from 'utils/KeycloakProvider';
import MainLayout from './components/layouts/MainLayout';
import NotFound from './pages/not-found/index';
import PrivateRoute from './utils/PrivateRouter';
// MainLayout
const Login = React.lazy(() => import('./pages/login/login'));
const CreateIssues = React.lazy(() => import('./pages/issues/CreateIssues'));
const DetailIssues = React.lazy(() => import('./pages/issues/DetailIssues'));
const IssuesManagement = React.lazy(() => import('./pages/issues/index'));
const Repository = React.lazy(() => import('./pages/repositorys/index'));
const TestPlanInfo = React.lazy(() => import('./pages/test-plan/testPlanInfo'));
const RunResult = React.lazy(() => import('./pages/run-result'));
const Statistical = React.lazy(() => import('./pages/statistical'));
const TestPlanList = React.lazy(() => import('./pages/test-plan/testPlanList'));
const Dashboard = React.lazy(() => import('./pages/dashboard/index'));
const DetailTestPlan = React.lazy(() => import('./components/layouts/DetailTestPlan'));
const CreatePlan = React.lazy(() => import('./pages/test-plan/createTestPlan'));
const Setting = React.lazy(() => import('./pages/setting'));
const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [location]);

    useEffect(() => {
        if (location.pathname === '/not-found') {
            toast.error('Page not found');
        }
    }, [location]);

    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        // Tính thời gian còn lại của token trước khi hết hạn (theo đơn vị giây)
        const timeUntilExpiration = (decodedToken.exp - currentTime) * 1000;
        // Thời gian 1 ngày (24 giờ = 24 * 60 * 60 * 1000 milliseconds)
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        if (timeUntilExpiration > 0) {
            // Thiết lập thời gian để xóa token sau 1 ngày hoặc hết hạn token, tùy theo thời gian nào ngắn hơn
            const timeToWait = Math.min(timeUntilExpiration, oneDayInMilliseconds);
            setTimeout(() => {
                toast.warning('Your session has expired!');
                localStorage.removeItem('token');
                navigate('/login');
            }, timeToWait);
        } else {
            // Token đã hết hạn, xóa khỏi localStorage và chuyển hướng người dùng ngay lập tức
            localStorage.removeItem('token');
            navigate('/login');
        }
    }

    return (
        // <Suspense>
        <>
            <Routes>
                <Route
                    index
                    path="/login"
                    element={
                        <React.Suspense>
                            <Login />
                        </React.Suspense>
                    }
                />

                {/* Repository */}
                <Route
                    element={
                        <PrivateRoute>
                            <MainLayout isLoading={isLoading} setIsLoading={setIsLoading} />
                        </PrivateRoute>
                    }
                >
                    {/* Dashboard */}
                    <Route
                        index
                        path="/"
                        element={
                            <React.Suspense>
                                <Dashboard />
                            </React.Suspense>
                        }
                    />
                    {/* Test Plan */}
                    <Route>
                        <Route
                            index
                            path="/test-plan"
                            element={
                                <ApolloProvider client={clientRepo}>
                                    <React.Suspense>
                                        <TestPlanList />
                                    </React.Suspense>
                                </ApolloProvider>
                            }
                        />
                        <Route
                            index
                            path="/test-plan/create"
                            element={
                                <ApolloProvider client={clientRepo}>
                                    <React.Suspense>
                                        <CreatePlan />
                                    </React.Suspense>
                                </ApolloProvider>
                            }
                        />

                        <Route
                            element={
                                <React.Suspense>
                                    {' '}
                                    <DetailTestPlan />
                                </React.Suspense>
                            }
                        >
                            {/* Plan-information */}
                            <Route
                                path="/test-plan/plan-information/:testPlanId"
                                element={
                                    <ApolloProvider client={clientRepo}>
                                        <TestPlanInfo />
                                    </ApolloProvider>
                                }
                            >
                                <Route index element={<GeneralInfor />} />
                                <Route path="member" element={<MemberList />} />
                                <Route path="update/info" element={<Information />} />
                                <Route path="update/member" element={<Member />} />
                            </Route>

                            {/*Repository */}
                            <Route
                                index
                                path="/test-plan/repository/:testPlanId"
                                element={
                                    <ApolloProvider client={clientRepo}>
                                        <React.Suspense>
                                            <Repository />
                                        </React.Suspense>
                                    </ApolloProvider>
                                }
                            />
                            {/*Run-result */}
                            <Route
                                index
                                path="/test-plan/run-result/:testPlanId"
                                element={
                                    <React.Suspense>
                                        <RunResult />
                                    </React.Suspense>
                                }
                            />
                            {/*Statistical */}
                            <Route
                                index
                                path="/test-plan/statistical/:testPlanId"
                                element={
                                    <React.Suspense>
                                        <Statistical />
                                    </React.Suspense>
                                }
                            />
                            {/*issues */}
                            <Route
                                index
                                path="/test-plan/issues/:testPlanId"
                                element={
                                    <React.Suspense>
                                        <IssuesManagement />
                                    </React.Suspense>
                                }
                            />
                            {/*add issues */}
                            <Route
                                index
                                path="/test-plan/issues/:testPlanId/create-issues"
                                element={
                                    <React.Suspense>
                                        <CreateIssues />
                                    </React.Suspense>
                                }
                            />
                            {/*detail issues */}
                            <Route
                                index
                                path="/test-plan/issues/:testPlanId/detail-issues/:id"
                                element={
                                    <React.Suspense>
                                        <DetailIssues />
                                    </React.Suspense>
                                }
                            />
                            {/*Setting */}
                            <Route path="/test-plan/setting/:testPlanId" element={<Setting />}>
                                <Route index element={<SystemPreferences />} />
                                <Route
                                    path="/test-plan/setting/:testPlanId/email-preferences"
                                    element={<EmailPreferences />}
                                />
                            </Route>
                        </Route>
                    </Route>
                </Route>
                {/* NotFound */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-center" richColors />
        </>
    );
};

const AppWrapper = () => (
    <BrowserRouter basename="/">
        <KeycloakProvider>
            <App />
        </KeycloakProvider>
    </BrowserRouter>
);

export default AppWrapper;
