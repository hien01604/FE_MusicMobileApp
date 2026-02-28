import React from "react";
import Layout from "../components/Layout";
import LoginForm from "../components/Auth/LoginForm";
import Logo from "../components/Logo";
import SignupForm from "../components/Auth/SignUpForm";

export default function LoginScreen() {
    return (
        <Layout>
            <Logo />
            <SignupForm />
        </Layout>
    );
}