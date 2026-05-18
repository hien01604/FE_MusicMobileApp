import React from "react";
import Layout from "../../components/common/Layout";
import Logo from "../../components/common/Logo";
import ResetPasswordForm from "../../components/Auth/ResetPasswordForm";

export default function ResetPasswordScreen() {
    return (
        <Layout>
            <Logo />
            <ResetPasswordForm />
        </Layout>
    );
}
