(function (window, setupMain, setupWorker) {
    "use strict";

    const isWorker = typeof window["document"] === "undefined";
    const supportsWorker = isWorker || typeof window["Worker"] !== "undefined";

    if (supportsWorker) {
        if (isWorker) {
            setupWorker(window, null, {
                log(...args) {
                    window.postMessage({
                        type: "MY_CORE_LOG",
                        payload: {
                            args,
                        },
                    });
                }
            });
        } else {
            const worker = new Worker('assets/my-core/v1/my-core.js');
            setupMain(window, window["document"], console, worker);
        }
    } else {
        setupMain(window, window["document"], console, window);
    }

}(this, function setupMain(window, document, console, worker) {
    console.log(`<my-core> [LOG] ${setupMain.name}`, window, document, console, worker);

    function handleMessage(e, ...rest) {
        console.log('<my-core>.onmessage', 'from', e.origin, 'with data', e.data, 'trustworthy?', e.target === worker || e.target === window, e);
    }

    window.addEventListener('message', handleMessage);

    if (worker !== window) {
        worker.addEventListener('message', function handleMessage(e, ...rest) {
            console.log('<my-core>.onmessage', 'from worker', 'with data', e.data, 'trustworthy?', e.target === worker || e.target === window, e);

            if (e.data.type === 'MY_CORE_WORKER_HANDSHAKE') {
                worker.postMessage({
                    type: 'MY_CORE_WORKER_HANDSHAKE_RESPONSE',
                    payload: {
                        message: 'Hello worker, nice to meet you!',
                    },
                });
            }
        });
    }

    const body = document.body;
    body.classList.add('my-core--initialized');
    console.log("<my-core> [LOG] <body>", body);

}, function setupWorker(window, document, console) {
    console.log(`<my-core> [LOG] ${setupWorker.name}`);

    window.postMessage({
        type: 'MY_CORE_WORKER_HANDSHAKE',
        payload: {
            message: `Hello from ${setupWorker.name}!`,
        },
    });

    window.addEventListener('message', function (e) {
        console.log(`<my-core> [LOG] Worker thanks you for your message`, 'from', e.origin, e.data);
    });
}));