let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn};

export async function loginApi(path, options = {}) {
    const res = await fetch(path, {credentials: 'same-origin', ...options});
    console.log("response:", res);
    if (res.status === 401) {
        onUnauthorized();
        throw new Error('Unauthorized');
    }
    return res;
}