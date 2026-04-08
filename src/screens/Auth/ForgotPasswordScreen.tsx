import React from "react";
import Layout from "../../components/common/Layout";
import LoginForm from "../../components/Auth/LoginForm";
import Logo from "../../components/common/Logo";
import ForgotPasswordForm from "../../components/Auth/ForgotPasswordForm";

export default function ForgotPasswordScreen() {
    return (
        <Layout>
            <Logo />
            <ForgotPasswordForm />
        </Layout>
    );
}