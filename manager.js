const MM = require('ms-manager');
let config = require(`./config.json`) || {};

const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

const Tracing = require("@sentry/tracing");
// or use es6 import statements
// import * as Tracing from '@sentry/tracing';

Sentry.init({
    dsn: "https://de89da8c42fd4c849e399bcc41936db2@o776203.ingest.sentry.io/5797322",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
    op: "test",
    name: "My First Test Transaction",
});

setTimeout(() => {
    try {
        foo();
    } catch (e) {
        Sentry.captureException(e);
    } finally {
        transaction.finish();
    }
}, 99);

MM.init(config, (err, serviceInfo) => {
    if (err) {
        return console.error(err);
    }

    /**
     * Our micro-service is now up.
     * */
    console.log('#Micro-service UP#');

    /**
     * You can now subscribe to specific message
     */
    MM.subscribe('add', (bdy, msg) => {

         const computer = require('./computer');
         try {
             const result = computer.add(parseInt(bdy.a), parseInt(bdy.b));
             msg.reply({ result });
         } catch (err) {
             console.error(err);
             return msg.replyErr(err);
         }
    });
});