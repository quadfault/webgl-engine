/* error.js - Error types.
 * Written by quadfault
 * 2/28/23
 */

/* A generic error thrown by the engine when a more specific error is not warranted. */
export class EngineError extends Error {
    /* Works just like the Error constructor. */
    constructor(message) {
        super(message)
    }

    /* Always define this for Error subclasses. It should just be the name of the type. */
    get name() {
        return 'EngineError'
    }
}
