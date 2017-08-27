module.exports = {
    home: {
        title: 'PoC',
        locale: 'en-US',
        elements: [
            { tag: 'my-core', version: 'v1' },
            { tag: 'my-debug-console', version: 'v1' },
            { tag: 'my-header', version: 'v1' },
            { tag: 'my-layout', version: 'v1' },
            { tag: 'my-main', version: 'v1' },
            { tag: 'my-welcome', version: 'v1' },
        ],
        body: [
            ['my-layout', null, [
                ['my-header', { slot: 'header' }],
                ['my-debug-console', { slot: 'teaser' }],
                ['my-main', { slot: 'main' }],
                ['my-welcome', { slot: 'sidebar-left' }],
                ['my-welcome', { slot: 'sidebar-right' }],
            ]],
        ],
    },
};