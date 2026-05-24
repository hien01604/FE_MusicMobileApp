import React from "react";
import Layout from "../../components/Auth/AuthLayout";
import LoginForm from "../../components/Auth/LoginForm";
import Logo from "../../components/common/Logo";

export default function LoginScreen() {
    return (
        <Layout>
            <Logo />
            <LoginForm />
        </Layout>
    );
}