export const isAuthenticated = () => {
    return JSON.parse(sessionStorage.getItem('jwt'));
}

export const authenticate = jwt => {
    sessionStorage.setItem('jwt', JSON.stringify(jwt));
}