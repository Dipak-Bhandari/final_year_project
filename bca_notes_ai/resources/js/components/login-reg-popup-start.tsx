import { Link, usePage } from "@inertiajs/react";
import AppLogoIcon from "./app-logo-icon";
import { type SharedData } from "@/types";
import { useEffect, useState } from "react";

export default function LoginRegPopupStart() {
    const { auth } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);

    // Show popup on page load if user is not logged in and popup hasn't been shown
    useEffect(() => {
        const hasShownPopup = sessionStorage.getItem("hasShownLoginPopup");
        if (!auth.user && !hasShownPopup) {
            setIsOpen(true);
            sessionStorage.setItem("hasShownLoginPopup", "true");
        }
    }, [auth.user]);

    // If user is logged in, render nothing
    if (auth.user) {
        return null;
    }

    // Function to close the popup
    const closePopup = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
                    <div className="relative flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-lg bg-cream border border-card shadow-xl p-8 bg-accent sm:px-6 lg:px-8 transform transition-transform duration-300 scale-100 hover:scale-[1.02]">
                        {/* Close Button */}
                        <button
                            onClick={closePopup}
                            className="absolute right-4 top-4 text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors duration-200"
                            aria-label="Close popup"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* Popup Content */}
                        <div className="flex items-center justify-center gap-3">
                            <AppLogoIcon className="size-12 fill-current text-black dark:text-white" />
                            <span className="text-xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
                                Bcai Notes
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                            Welcome to Bcai Notes
                        </h1>
                        <p className="text-center text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            A simple note-taking application powered by AI.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <Link
                                href="/login"
                                onClick={closePopup}
                                className="inline-block rounded-md bg-gray-200 px-5 py-3 text-base font-medium text-black hover:bg-gray-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 transition-colors duration-200"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                onClick={closePopup}
                                className="inline-block rounded-md bg-green-500 px-5 py-3 text-base font-medium text-white hover:bg-green-600 transition-colors duration-200"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}