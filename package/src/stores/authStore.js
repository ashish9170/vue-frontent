// src/stores/authStore.js
import { defineStore } from 'pinia';
import axiosAuth from '@/utils/AxiosAuth';
import { ref } from 'vue';
import { notify } from 'notiwind';
import { getRuntimeConfig, loadRuntimeConfig } from "@/config/runtimeStore.js";

export const useAuth = defineStore('authStore', () => {
    const root = getRuntimeConfig().apiBaseUrl;

    // ---------- State ----------
    const isLoading = ref(false);
    const isAuthenticated = ref(false);
    const token = ref(localStorage.getItem('token') || null);
    const currentUser = ref(null);
    const emailFor2FA = ref(''); // holds email after login but before 2FA

    // ---------- Actions ----------

    const signup = async (data) => {
        try {
            isLoading.value = true;
            const res = await axiosAuth.post(`${root}/auth/signup`, data);

            notify({
                group: 'success',
                title: 'Signup',
                text: 'Signup successful, please check your email for 2FA code',
            }, 2000);

            isLoading.value = false;
            return res.data;
        } catch (error) {
            isLoading.value = false;
            console.error('Signup error:', error);
            notify({
                group: 'error',
                title: 'Signup',
                text: error?.response?.data?.detail || 'Signup failed',
            }, 2000);
        }
    };

    const login = async (data) => {
        try {
            isLoading.value = true;
            const res = await axiosAuth.post(`${root}/auth/login`, data);

            // backend will send email for 2FA
            emailFor2FA.value = data.email;

            notify({
                group: 'success',
                title: 'Login',
                text: 'Login successful, please enter 2FA code',
            }, 2000);

            isLoading.value = false;
            return res.data;
        } catch (error) {
            isLoading.value = false;
            console.error('Login error:', error);
            notify({
                group: 'error',
                title: 'Login',
                text: error?.response?.data?.detail || 'Login failed',
            }, 2000);
        }
    };

    const verify2FA = async (code) => {
        try {
            isLoading.value = true;
            const res = await axiosAuth.post(`${root}/auth/verify-2fa`, {
                email: emailFor2FA.value,
                code: code,
            });

            token.value = res.data.access_token;
            localStorage.setItem('token', res.data.access_token);
            isAuthenticated.value = true;

            notify({
                group: 'success',
                title: '2FA Verification',
                text: 'Verification successful',
            }, 2000);

            isLoading.value = false;
            return res.data;
        } catch (error) {
            isLoading.value = false;
            console.error('2FA verification error:', error);
            notify({
                group: 'error',
                title: '2FA',
                text: error?.response?.data?.detail || 'Invalid 2FA code',
            }, 2000);
        }
    };

    const logout = () => {
        token.value = null;
        isAuthenticated.value = false;
        currentUser.value = null;
        localStorage.removeItem('token');

        notify({
            group: 'success',
            title: 'Logout',
            text: 'You have been logged out',
        }, 2000);
    };

    // ---------- Exports ----------
    const value = {
        isLoading,
        isAuthenticated,
        token,
        currentUser,
        emailFor2FA,
    };

    const actions = {
        signup,
        login,
        verify2FA,
        logout,
    };

    return {
        ...value,
        ...actions,
    };
});
