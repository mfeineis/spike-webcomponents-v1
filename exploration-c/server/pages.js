module.exports = {
    home: {
        title: 'PoC',
        locale: 'en-US',
        body: [
            ['my-layout', null, [
                ['my-header', { slot: 'header' }],
                ['my-debug-console', { slot: 'sidebar-right' }],
                ['my-main', { slot: 'main' }],
                ['my-welcome', { slot: 'sidebar-left' }],
            ]],
        ],
    },
};
