import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import AppLogoIcon from "./app-logo-icon";
import SemesterDropdown from "./semester-dropdown";
import YearlyQuestionDropdown from "./yearly-questions-dropdown";
import UserAvatar from "./user-avatar";
import { type SharedData, type User } from "@/types";

function NavIndex() {
    const { auth } = usePage<SharedData>().props;
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const user = auth.user;
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }

        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuOpen]);

    return (
        <>
            <div className="z-50 top-0 sticky">
                <header className="justify-between">
                    <nav className="border h-16 w-full flex items-center justify-between gap-4 p-4 md:p-8 rounded-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <div className='h-6 w-6'>
                            <Link href={route('home')}>
                                <AppLogoIcon className="cursor-pointer" />
                            </Link>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <SemesterDropdown />
                            <YearlyQuestionDropdown />
                            <div className="hidden md:block">
                                <span className="text-sm text-gray-500 dark:text-gray-400">search</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            {user ? (
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center space-x-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700"
                                    >
                                        <UserAvatar user={user} size="sm" />
                                        <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">
                                            {user.name}
                                        </span>
                                        <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700 z-50">
                                            <div className="py-1">
                                                {user.isAdmin && (
                                                    <Link
                                                        href={route('dashboard')}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <Settings className="mr-3 h-4 w-4" />
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <LogOut className="mr-3 h-4 w-4" />
                                                    Logout
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-transparent px-3 md:px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm border border-[#19140035] px-3 md:px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>
            </div>
        </>
    );
}

export default NavIndex;