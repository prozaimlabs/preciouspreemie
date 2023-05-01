import { useRouter } from 'next/router';
import React from 'react';
import { BsChevronDown } from 'react-icons/bs';

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
    { id: 1, name: 'Clothings', doc_count: 8 },
    { id: 1, name: 'Food', doc_count: 64 },
    { id: 1, name: 'Diaper Covers', doc_count: 66 },
    { id: 1, name: 'Footies & Coveralls', doc_count: 40 },
    { id: 1, name: 'gear', doc_count: 9 },
];

const Menu: React.FC<MenuProps> = ({
    showCategoryMenu,
    setShowCategoryMenu,
}) => {
    const router = useRouter();

    return (
        <ul className="hidden md:flex items-center gap-8 font-medium text-black">
            {items.map((item) => {
                return (
                    <React.Fragment key={item.id}>
                        {!!item?.subMenu ? (
                            <li className="cursor-pointer flex items-center gap-2 relative">
                                {item.name}
                                <BsChevronDown size={14} />
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
