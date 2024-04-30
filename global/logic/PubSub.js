const listeners = {};

export const PubSub = {

    subscribe: ( { event, listener } ) => {

        if( !event) return logger( 'PubSub: Error ( Event is undefined )');
        if( typeof listener != 'function') return logger( 'PubSub: Error ( Listener is not a function )');

        if( !listeners[event]) {
            listeners[event] = [ listener ];
            return
        }

        listeners[event].push( listener);
    },
        
    publish: ( { event, detail } ) => {

        if( !listeners[event]) {
            logger( `EVENT: ${event} has no listeners...`);
            return
        }

        listeners[event].forEach( listener => {
            listener( detail )
        });
        
        logger( `EVENT: Published ${event}`);
    },
}

const logger = ( message ) => console.log( message );