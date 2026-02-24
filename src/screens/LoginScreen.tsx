import React from "react";
import Layout from "../components/Layout";
import LoginForm from "../components/Auth/LoginForm";
import Logo from "../components/Logo";

export default function LoginScreen() {
    return (
        <Layout>
            <Logo />
            <LoginForm />
        </Layout>
    );
}