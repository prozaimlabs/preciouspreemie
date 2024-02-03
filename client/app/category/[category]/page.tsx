import React from 'react';

const page = ({
    params,
    searchParams,
}: {
    params: { category: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    console.log('Category: ', params.category);
    return <div>{params.category}</div>;
};

export default page;
