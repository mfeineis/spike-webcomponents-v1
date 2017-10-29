(function (window, ACCESS_TOKEN) {
    console.log('login-page init 4...');

    const actions = {
        register: payload => ({
            meta: { token: ACCESS_TOKEN },
            payload,
            type: 'CORE_REGISTER',
        }),
    };

    window.postMessage(actions.register({ page: 'login-page' }), '*');

    window.addEventListener('message', e => {
        if (e.data && e.data.meta && e.data.meta && e.data.meta.token === ACCESS_TOKEN) {
            console.log('> login-page', e.data.type, e);
        }
    });

}(window, '%%ACCESS_TOKEN%%'));
