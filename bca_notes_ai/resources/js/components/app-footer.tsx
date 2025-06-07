import { Link, usePage } from "@inertiajs/react";
import AppLogoIcon from "./app-logo-icon";

export default function AppFooter() {
    const { auth } = usePage().props;

    return (
        <footer className="sticky bottom-0 bg-[#2f1e64] text-white border-t dark:bg-neutral-800 dark:border-neutral-700 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Logo and Branding */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <Link
                            href={route("home")}
                            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
                            aria-label="Bcai Notes Home"
                        >
                            <AppLogoIcon className="h-8 w-8 fill-current text-white" />
                            <span className="text-lg font-semibold tracking-tight">Bcai Notes</span>
                        </Link>
                        <p className="text-sm text-indigo-200 dark:text-neutral-300 text-center md:text-left">
                            A simple note-taking application powered by AI.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col items-center md:items-start space-y-2">
                        <h3 className="text-base font-semibold text-white dark:text-neutral-100">Navigation</h3>
                        <ul className="space-y-1 text-sm text-indigo-200 dark:text-neutral-300">
                            <li>
                                <Link
                                    href={route("home")}
                                    className="hover:text-white dark:hover:text-neutral-100 transition-colors duration-200"
                                >
                                    Home
                                </Link>
                            </li>
                            {/* {auth.user ? (
                                <>
                                    <li>
                                        <Link
                                            href={route("dashboard")}
                                            className="hover:text-white dark:hover:text-neutral-100 transition-colors duration-200"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="hover:text-white dark:hover:text-neutral-100 transition-colors duration-200"
                                        >
                                            Log Out
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            href={route("login")}
                                            className="hover:text-white dark:hover:text-neutral-100 transition-colors duration-200"
                                        >
                                            Log In
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("register")}
                                            className="hover:text-white dark:hover:text-neutral-100 transition-colors duration-200"
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )} */}
                        </ul>
                    </div>

                    {/* Additional Links or Info */}
                    <div className="flex flex-col items-center md:items-start space-y-2">
                        <h3 className="text-base font-semibold text-white dark:text-neutral-100">Resources</h3>
                        <ul className="space-y-1 text-sm text-indigo-200 dark:text-neutral-300">
                            <li>
                                <a
                                    href="https://x.ai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white dark:hover:text-neutral-100 transition-colors duration-200"
                                >
                                    About xAI
                                </a>
                            </li>
                            {/* <li>
                                <Link
                                    href={route("terms.show")} // Adjust route as needed
                                    className="hover:text-white dark:hover:text-neutral-100 transition-colors duration-200"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("privacy.show")} // Adjust route as needed
                                    className="hover:text-white dark:hover:text-neutral-100 transition-colors duration-200"
                                >
                                    Privacy Policy
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t dark:border-neutral-700 text-center text-sm text-indigo-200 dark:text-neutral-300">
                    © {new Date().getFullYear()} Bcai Notes. All rights reserved.
                </div>
            </div>
        </footer>
    );
}