export function getUserRoleId() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role_id;
}

export function getCurrentUserId() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
}

export function getToken() {
    return localStorage.getItem('token');
}

export function getPayload() {
    const token = getToken();
    if (!token) return null;

    try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        return payload;
    } catch {
        return null;
    }
}

export function isTokenExpired() {
    const payload = getPayload();
    if (!payload || !payload.exp) return true;

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    return payload.exp < now;
}