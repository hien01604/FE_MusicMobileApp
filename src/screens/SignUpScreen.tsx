import React from "react";
import Layout from "../components/Layout";
import Logo from "../components/Logo";
import SignupForm from "../components/Auth/SignUpForm";

export default function SignUpScreen() {
    return (
        <Layout>
            <Logo />
            <SignupForm />
        </Layout>
    );
}