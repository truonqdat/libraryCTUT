import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { isJsonString } from './utils/json';
import { jwtDecode } from 'jwt-decode';
import * as UserServices from './services/UserServices';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/slides/user/userSlide';
// import axios from 'axios';
import ProtectedRoute from './routes/protectedRoute';

const queryClient = new QueryClient();

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const { accessTokenInStorage, userDecode } = handleAccessToken();
        if (userDecode?.id) {
            handleGetInfoUser(userDecode?.id, accessTokenInStorage);
        }
    }, []);

    const handleAccessToken = () => {
        let accessTokenInStorage = localStorage.getItem('access_token');
        let userDecode = accessTokenInStorage ? jwtDecode(accessTokenInStorage) : {};
        return { accessTokenInStorage, userDecode };
    };

    UserServices.axiosJWT.interceptors.request.use(
        async (config) => {
            const currentTime = new Date();
            const { userDecode } = handleAccessToken();
            if (userDecode?.exp < currentTime.getTime / 1000) {
                const data = await UserServices.refreshToken();
                config.headers['token'] = `Bearer ${data?.access_token}`;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );

    const handleGetInfoUser = async (id, token) => {
        const res = await UserServices.getInfoUser(id, token);
        dispatch(setUser({ ...res?.data, isAdmin: res.data.isAdmin, isAuthenticated: true }));
    };

    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Routes>
                        {routes.map((route) => {
                            const Page = route.page;
                            var Layout;
                            if (route.layout === null) {
                                Layout = Fragment;
                            } else Layout = route.layout;
                            return (
                                <Route
                                    path={route.path}
                                    key={route.path}
                                    element={
                                        route.isProtected ? (
                                            <ProtectedRoute requireAdmin={route.requireAdmin}>
                                                <Layout>
                                                    <Page title={route.title} isShowFooter={route.isShowFooter} />
                                                </Layout>
                                            </ProtectedRoute>
                                        ) : (
                                            <Layout>
                                                <Page title={route.title} isShowFooter={route.isShowFooter} />
                                            </Layout>
                                        )
                                    }
                                />
                            );
                        })}
                    </Routes>
                </Router>
            </QueryClientProvider>
        </div>
    );
}

export default App;
