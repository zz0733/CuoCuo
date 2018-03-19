let handlers = {};

let funEvent = {
    add (tag, event, handler, logFlag = false) {
        if (handlers[tag]) {
            fun.log("funEvent", "error: this tag has added " + tag);
            return;
        }
        handlers[tag] = {
            event: event,
            handler: handler,
        };
        if (logFlag) {
            fun.log("funEvent", "add new event " + tag + event);
        }
    },

    getSum () {
        let count = 0;
        for(const key in handlers) {
            count++;
        }
        return count;
    },

    remove (tag, logFlag = false) {
        delete handlers[tag];
        if (logFlag) {
            fun.log("funEvent", "remove event success " + tag);
        }
    },

    dispatch (event, data, logFlag = false) {
        for (const k in handlers) {
            if (handlers[k].event === event) {
                if (logFlag) {
                    fun.log("funEvent", "dispatch event " + k + event, data);
                }
                handlers[k].handler(data);
            }
        }
    },

    clearUp () {
        handlers = {};
    },
};

module.exports = funEvent;