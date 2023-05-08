import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { BsChevronDown } from 'react-icons/bs';

interface MenuProps {
    showCategoryMenu?: boolean;
    setShowCategoryMenu?: React.Dispatch<React.SetStateAction<boolean>>;
    setMobileMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

const items = [
    { id: 1, name: 'Home', url: '/' },
    { id: 2, name: 'About', url: '/about' },
    { id: 3, name: 'Categories', subMenu: true },
    { id: 4, name: 'Contact', url: '/contact' },
];

const subMenuItems = [
    { id: 1, name: 'Accessories', doc_count: 11 },
    { id: 1, name: 'Clothings', doc_count: 8 },
    { id: 1, name: 'Food', doc_count: 64 },
    { id: 1, name: 'Diaper Covers', doc_count: 66 },
    { id: 1, name: 'Footies & Coveralls', doc_count: 40 },
    { id: 1, name: 'gear', doc_count: 9 },
];

const MenuMobile: React.FC<MenuProps> = ({
    showCategoryMenu,
    setShowCategoryMenu,
    setMobileMenu,
}) => {
    const router = useRouter();

    return (
        <ul
            className="flex flex-col md:hidden font-bold absolute top-[50px] left-0 w-full 
                    h-[calc(100vh-50px)] bg-white border-t text-black"
        >
            {items.map((item) => {
                return (
                    <React.Fragment key={item.id}>
                        {!!item?.subMenu ? (
                            <li
                                className="cursor-pointer py-4 px-5 border-b flex flex-col relative"
                                onClick={() =>
                                    setShowCategoryMenu!(!showCategoryMenu)
                                }
                            >
                                <div className="flex justify-between items-center">
                                    {item.name}
                                    <BsChevronDown size={14} />
                                </div>
                                {showCategoryMenu && (
                                    <ul className="bg-black/[0.05] -mx-5 mt-4 -mb-4">
                                        {subMenuItems.map((subMenuitem) => {
                                            return (
                                                <Link
                                                    key={subMenuitem.id}
                                                    href="/"
                                                    onClick={() => {
                                                        setShowCategoryMenu!(
                                                            false
                                                        );
                                                        setMobileMenu!(false);
                                                    }}
                                                >
                                                    <li className="py-4 px-8 border-t flex justify-between">
                                                        {subMenuitem.name}
                                                        <span className="opacity-50 text-sm">
                                                            78
                                                        </span>
                                                    </li>
                                                </Link>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        ) : (
                            <li className="py-4 px-5 border-b">
                                <Link
                                    href={item.url!}
                                    onClick={() => setMobileMenu!(false)}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        )}
                    </React.Fragment>
                );
            })}
        </ul>
    );
};

export default MenuMobile;
