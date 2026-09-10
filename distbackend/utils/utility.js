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
//# sourceMappingURL=utility.js.map