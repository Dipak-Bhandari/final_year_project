import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { usePage } from "@inertiajs/react";
import AppLogoIcon from "./app-logo-icon";
import SemesterDropdown from "./semester-dropdown";
import YearlyQuestionDropdown from "./yearly-questions-dropdown";

function NavIndex() {
    const { auth } = usePage().props;

    return (
        <>
            <div className="z-50 top-0 sticky">
                <header className="justify-between">
                    <nav className="border h-16 w-full flex items-center justify-between gap-4 p-8 rounded-md">
                        <div className='h-6 w-6 ml-30'>
                            <Link href={route('home')}>
                                <AppLogoIcon className="cursor-pointer" />
                            </Link>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <SemesterDropdown />
                            <YearlyQuestionDropdown />
                            <h2>search</h2>
                        </div>
                        <div className="flex mr-30 items-center justify-end gap-4 ">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>
            </div >

        </>
    );
}

export default NavIndex;