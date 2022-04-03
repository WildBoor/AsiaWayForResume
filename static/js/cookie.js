export function getCookieByName(cookieElementName) {
    let allCookie = getAllCookie();

    return allCookie[cookieElementName];
}

export function getAllCookie() {
    let documentCookie = document.cookie;
    let allCookie = {};

    if (documentCookie && (documentCookie !== '')) {
        let cookieElements = documentCookie.split(';');

        allCookie = cookieElements
            .map((cookieElement) => { return cookieElement.split('=') })
            .reduce((cookie, cookieElementSplitted) => {
                let cookieName = cookieElementSplitted[0].trim();
                let cookieValue = cookieElementSplitted[1];

                cookie[cookieName] = {};
                cookie[cookieName] = cookieValue;

                return cookie;
            }, allCookie);
    }

    return allCookie;
}