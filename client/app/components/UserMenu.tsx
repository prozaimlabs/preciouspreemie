'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiUser } from 'react-icons/bi';
import UserMenuItem from './navbar/UserMenuItem';
import useSignupModal from '../hooks/useSignupModal';
import useSigninModal from '../hooks/useSigninModal';
import axios from 'axios';
import { CurrentUser } from '../interfaces/currentUser';

interface UserMenuProps {
    currentUser?: CurrentUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const router = useRouter();

    const signupModal = useSignupModal();
    const signinModal = useSigninModal();

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    const onSignOut = async () => {
        axios
            .post('/api/users/signout')
            .then(() => {
                router.refresh();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    console.log('CurrentUser User menu: ', currentUser);

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={toggleOpen}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 
                rounded-full cursor-pointer hover:shadow-md transition"
                >
                    <div className="hidden md:block">
                        <BiUser />
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="absolute min-w-[200px] px-1 rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-6 text-sm">
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                            <>
                                <UserMenuItem
                                    onClick={() => router.push('/account')}
                                    label="Account"
                                />
                                <UserMenuItem
                                    onClick={onSignOut}
                                    label="Sign out"
                                />
                            </>
                        ) : (
                            <>
                                <UserMenuItem
                                    onClick={signinModal.onOpen}
                                    label="Sign in"
                                />
                                <UserMenuItem
                                    onClick={signupModal.onOpen}
                                    label="Sign up"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
