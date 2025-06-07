import AppLogoIcon from '@/components/app-logo-icon';
import NavIndex from '@/components/nav-index';
import AppFooter from '@/components/app-footer';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import LoginRegPopupStart from '@/components/login-reg-popup-start';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="bg-cream text-[#1b1b18] w-full  dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full text-sm not-has-[nav]:hidden">
                    <NavIndex />
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <LoginRegPopupStart />
                </div>
                <footer>
                    <AppFooter />
                </footer>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
