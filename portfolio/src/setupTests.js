const { TextEncoder, TextDecoder } = require('util');


Object.assign(global, { TextDecoder, TextEncoder });

require('@testing-library/jest-dom');