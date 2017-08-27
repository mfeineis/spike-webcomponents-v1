(function (window, setupMain, setupWorker) {
    "use strict";

    const isWorker = typeof window["document"] === "undefined";
    const supportsWorker = false;// isWorker || typeof window["Worker"] !== "undefined";

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
            //const worker = new Worker('assets/my-core/v1/my-core.js');
            const worker = new Worker(window["document"].currentScript.src);
            setupMain(window, window["document"], console, worker);
        }
    } else {
        setupMain(window, window["document"], console, window);
    }

}(this, function setupMain(window, document, console, worker) {
    console.log(`<my-core>.${setupMain.name} init...`, window, document, console, worker);

    if (typeof window.CustomEvent !== "function") {
        window.CustomEvent = function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };
        window.CustomEvent.prototype = window.Event.prototype;
    }

    document.addEventListener('my-core-custom-event', function (e) {
        if (e.detail.type === 'MY_CORE_CONNECT_ELEMENT') {

            window.postMessage({
                type: 'SOME_DATA',
                payload: {
                    someData: true,
                },
            }, '*');
        }
    })

    window.addEventListener('message', function handleMessage(e) {
        const trustworthy = e.target === worker || e.target === window;
        console.log('    window.onmessage from', e.origin, e.data);
    });

    if (worker !== window) {
        worker.addEventListener('message', function handleMessage(e) {
            const trustworthy = e.target === worker || e.target === window;

            if (e.data.type === 'MY_CORE_LOG') {
                console.log(...e.data.payload.args)
                return;
            }

            console.log('    worker.onmessage from', 'worker', e.data);

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
    console.log(`<my-core>.${setupMain.name} done.`, body);

}, function setupWorker(window, document, console) {
    console.log(`<my-core>.${setupWorker.name} init...`);

    window.postMessage({
        type: 'MY_CORE_WORKER_HANDSHAKE',
        payload: {
            message: `Hello from ${setupWorker.name}!`,
        },
    });

    window.addEventListener('message', function (e) {
        console.log(`<my-core> [LOG] Worker thanks you for your message`, 'from', e.origin, e.data);
    });

    console.log(`<my-core>.${setupWorker.name} done.`);
}));