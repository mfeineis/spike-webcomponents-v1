(function (window, CORE_TOKEN, MODULE_TOKEN) {
    console.log('core init 4...');

    const actions = {
        init: payload => ({
            meta: { token: MODULE_TOKEN },
            payload,
            type: 'CORE_INIT',
        }),
    };

    window.postMessage(actions.init({ blubb: 'bla' }), '*');

    window.addEventListener('message', e => {
        if (e.data && e.data.meta && e.data.meta.token === MODULE_TOKEN) {
            console.log('> core.onmessage from module', e.data.type, e);
        }
    });

}(window, '%%CORE_TOKEN%%', '%%MODULE_TOKEN%%'));
