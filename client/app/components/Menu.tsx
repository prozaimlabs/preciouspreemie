'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BsChevronDown } from 'react-icons/bs';
import CategoryBox from './CategoryBox';

interface MenuProps {
    showCategoryMenu?: boolean;
    setShowCategoryMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

const items = [
    { id: 1, name: 'Home', url: '/' },
    { id: 2, name: 'About', url: '/about' },
    { id: 3, name: 'Categories', subMenu: true },
    { id: 4, name: 'Contact', url: '/contact' },
];

const subMenuItems = [
    { id: 1, name: 'Accessories', doc_count: 11 },
    { id: 2, name: 'Clothings', doc_count: 8 },
    { id: 3, name: 'Food', doc_count: 64 },
    { id: 4, name: 'Diaper Covers', doc_count: 66 },
    { id: 5, name: 'Footies & Coveralls', doc_count: 40 },
    { id: 6, name: 'gear', doc_count: 9 },
];

const Menu: React.FC<MenuProps> = ({
    showCategoryMenu,
    setShowCategoryMenu,
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/';
    if (!isMainPage) {
        return null;
    }

    return (
        <ul className="hidden md:flex items-center gap-8 font-medium text-black">
            {items.map((item) => {
                return (
                    <React.Fragment key={item.id}>
                        {!!item?.subMenu ? (
                            <li
                                className="cursor-pointer flex items-center gap-2 relative"
                                onMouseEnter={() => setShowCategoryMenu!(true)}
                                onMouseLeave={() => setShowCategoryMenu!(false)}
                            >
                                {item.name}
                                <BsChevronDown size={14} />

                                {showCategoryMenu && (
                                    <ul className="bg-white absolute top-6 left-0 min-w-[250px] px-1 text-black shadow-lg">
                                        {subMenuItems.map((subMenuitem) => {
                                            return (
                                                <CategoryBox
                                                    key={subMenuitem.name}
                                                    label={subMenuitem.name}
                                                    selected={
                                                        category ===
                                                        subMenuitem.name
                                                    }
                                                />
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        ) : (
                            <li className="cursor-pointer">
                                <div onClick={() => router.push(item.url!)}>
                                    {item.name}
                                </div>
                            </li>
                        )}
                    </React.Fragment>
                );
            })}
        </ul>
    );
};

export default Menu;
