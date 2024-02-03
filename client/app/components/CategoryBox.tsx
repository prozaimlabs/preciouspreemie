'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { useCallback } from 'react';

interface CategoryBoxProps {
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ label, selected }) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {};

        if (params) {
            currentQuery = queryString.parse(params.toString());
        }

        const updatedQuery: any = { ...currentQuery, category: label };

        if (params?.get('category') === label) {
            delete updatedQuery.category;
        }

        const url = queryString.stringifyUrl(
            { url: '/category/', query: updatedQuery },
            { skipNull: true }
        );

        router.push(url);
    }, [label, params, router]);

    // return (
    //     <div
    //         onClick={handleClick}
    //         className={`
    //             flex
    //             flex-col
    //             items-center
    //             justify-center
    //             gap-2
    //             p-3
    //             border-b-2
    //             hover:text-neutral-800
    //             transition
    //             cursor-pointer
    //             ${selected ? 'border-b-neutral-800' : 'border-transparent'}
    //             ${selected ? 'text-neutral-800' : 'text-neutral-500'}
    //          `}
    //     >

    //         <div className="font-medium text-sm">{label}</div>
    //     </div>
    // );
    return (
        <div onClick={handleClick}>
            <li className="h-12 flex justify-between items-center px-3 py-1 hover:bg-black/[0.03] rounded-md">
                {label}
            </li>
        </div>
    );
};

export default CategoryBox;
