import React from "react";
import Layout from "../../components/common/Layout";
import Logo from "../../components/common/Logo";
import SignupForm from "../../components/Auth/SignUpForm";

export default function SignUpScreen() {
    return (
        <Layout>
            <Logo />
            <SignupForm />
        </Layout>
    );
}