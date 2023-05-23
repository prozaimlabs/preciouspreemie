import React from 'react';

const MenuBar = () => {
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

    return <div>MenuBar</div>;
};

export default MenuBar;
