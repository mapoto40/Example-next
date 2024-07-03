import { AppProps } from 'next/app';
import { Fragment } from 'react';

import '../styles/global.css';
import { GetServerSidePropsContext } from 'next';
import { AuthProvider } from '@/utils/context/AuthContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return <AuthProvider>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QTWV1S4VYV"></script>
        <Fragment>
            <Component {...pageProps} />
        </Fragment>
    </AuthProvider>
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    return {
        redirect: {
            destination: '/',
            permanent: false,
        }
    };
};

export default MyApp;