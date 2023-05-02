import Link from 'next/link';
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
                                                <Link
                                                    key={subMenuitem.id}
                                                    href="/"
                                                    onClick={() =>
                                                        setShowCategoryMenu!(
                                                            false
                                                        )
                                                    }
                                                >
                                                    <li className="h-12 flex justify-between items-center px-3 py-1 hover:bg-black/[0.03] rounded-md">
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
