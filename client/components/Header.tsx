import React, { useState } from 'react';
import Wrapper from './Wrapper';
import Link from 'next/link';
import Menu from './Menu';
import { BsCart } from 'react-icons/bs';
import { IoMdHeartEmpty } from 'react-icons/io';
import { BiMenuAltRight } from 'react-icons/bi';
import { VscChromeClose } from 'react-icons/vsc';
import MenuMobile from './MenuMobile';

const Header = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [show, setShow] = useState('translate-y-0');
    const [lastScrollY, setLastScollY] = useState(0);

    return (
        <header
            className={`w-full h-[50px] md:h-[80px] bg-white flex 
                        items-center justify-between z-20 sticky top-0 transition-transform duration-300 ${show}
                            `}
        >
            <Wrapper className="h-[60px] flex justify-between items-center">
                <Link href={'/'}>
                    <img src="/logo1.png" className="w-[40px] md:w-[60px]" />
                </Link>

                <Menu
                    showCategoryMenu={showCategoryMenu}
                    setShowCategoryMenu={setShowCategoryMenu}
                />

                {mobileMenu && (
                    <MenuMobile
                        showCategoryMenu={showCategoryMenu}
                        setShowCategoryMenu={setShowCategoryMenu}
                        setMobileMenu={setMobileMenu}
                    />
                )}

                <div className="flex items-center gap-2 text-black">
                    <button
                        className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full 
                                 hover:bg-black/[0.05] focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
                    >
                        <IoMdHeartEmpty className="text-[19px] md:text-[20px]" />
                        <span className="absolute inset-0 object-right-top -mr-7">
                            <div
                                className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full 
                                            text-xs font-semibold leading-4 bg-red-500 text-white"
                            >
                                6
                            </div>
                        </span>
                    </button>

                    {/* Checkout Icons */}
                    <button
                        className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full 
                                 hover:bg-black/[0.05] focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
                        aria-label="Cart"
                    >
                        <BsCart className="text-[15px] md:text-[20px]" />
                        <span className="absolute inset-0 object-right-top -mr-7">
                            <div
                                className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full 
                                            text-xs font-semibold leading-4 bg-red-500 text-white"
                            >
                                6
                            </div>
                        </span>
                    </button>

                    <button
                        className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full 
                                 hover:bg-black/[0.05] focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
                    >
                        {mobileMenu ? (
                            <VscChromeClose
                                className="text-[16px]"
                                onClick={() => setMobileMenu(false)}
                            />
                        ) : (
                            <BiMenuAltRight
                                className="text-[20px]"
                                onClick={() => setMobileMenu(true)}
                            />
                        )}
                    </button>
                </div>
            </Wrapper>
        </header>
    );
};

export default Header;
