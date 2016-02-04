var faye = require('faye'),
    ps_actions = require('../lib/pubsub-actions');

// Note: the 'server' arg is called 'app' elsewhere in loopback
module.exports = function(server) {
    console.log('instantiating pubsub module');

    var ps_conf = server.get('pubsub'),
        ps_url = ps_conf.protocol + '://' + ps_conf.host + ':' + ps_conf.port + ps_conf.path;

    // Once the loopback app has started, start up the faye server
    server.on('started', function() {
        // add a pubsub client for the API server
        server.pubsub = new faye.Client(ps_url);

        // handlers for pubsub connection events
        server.pubsub.on('transport:down', function() {
            // the pubsub client is offline
            console.log('pubsub client offline');
        });

        server.pubsub.on('transport:up', function() {
            // the pubsub client is online
            console.log('pubsub client online');
        });

        // server.pubsub.subscribe('/openframe-gpio/17', function(data) {
        //     // the pubsub client is online
        //     console.log('GPIO', data);
        // });

        // wire up default pubsub actions
        ps_actions.wireActions(server.pubsub);
    });
};
