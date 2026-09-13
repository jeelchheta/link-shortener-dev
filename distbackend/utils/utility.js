export function BaseResponse(statuscode, message, response) {
    return {
        statuscode: statuscode,
        message: message,
        response: response
    };
}
export function generateCode(length = 8, onlyNumber = false) {
    const chars_Set1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", chars_Set2 = "0123456789";
    let result = "";
    if (onlyNumber) {
        for (let i = 0; i < length; i++) {
            result += chars_Set2.charAt(Math.floor(Math.random() * chars_Set2.length));
        }
        return result;
    }
    const chars = chars_Set1 + chars_Set2;
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
export function getEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}
;
export function isValidHttpUrlRegex(string) {
    try {
        if (!string) {
            return false;
        }
        const pattern = new RegExp('^' +
            // 1. Protocol (http or https required)
            'https?:\\/\\/' +
            // 2. Domain name (e.g., google.com) OR IP address (v4)
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))' +
            // 3. Optional port number
            '(\\:\\d+)?' +
            // 4. Optional path
            '(\\/[-a-z\\d%_.~+]*)*' +
            // 5. Optional query string
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            // 6. Optional fragment/anchor locator
            '(\\#[-a-z\\d_]*)?$', 'i' // Case-insensitive flag
        );
        return pattern.test(string);
    }
    catch (err) {
        return false;
    }
}
export function isValidCustomCode(string) {
    try {
        if (!string) {
            return false;
        }
        const pattern = new RegExp(/^[a-zA-Z0-9_-]{1,20}$/);
        return pattern.test(string);
    }
    catch (err) {
        return false;
    }
}
export function durationToMs(value) {
    try {
        const match = String(value).trim().match(/^(\d+(?:\.\d+)?)(s|m|h|d|w|M|y)$/);
        if (!match) {
            throw new Error(`Invalid duration: ${value}`);
        }
        const amount = Number(match[1]);
        const unit = match[2];
        const units = {
            "s": 1000,
            "m": 60 * 1000,
            "h": 60 * 60 * 1000,
            "d": 24 * 60 * 60 * 1000,
            "w": 7 * 24 * 60 * 60 * 1000,
            "M": 30 * 24 * 60 * 60 * 1000,
            "y": 365 * 24 * 60 * 60 * 1000,
        };
        return units[unit] ? amount * units[unit] : 7 * 24 * 60 * 60 * 1000;
    }
    catch (error) {
        throw (error);
    }
}
//# sourceMappingURL=utility.js.map