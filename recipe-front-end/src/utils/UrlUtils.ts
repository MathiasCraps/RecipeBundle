export interface GetParams {
    [key: string]: string | undefined;
}

export function parseGetParams(getParamsString: string): GetParams {
    const queryMap: GetParams = {};
    getParamsString.replace('?', '').split('&').forEach((entry) => {
        const subIndex = entry.indexOf('=');
        const hasValue = subIndex > -1;
        const key = hasValue ? entry.substring(0, subIndex) : entry;
        const value = hasValue ? entry.substring(subIndex + 1, entry.length) : undefined;

        queryMap[key] = value
    });

    return queryMap;
}

export function makeQueryString(paramsObject: GetParams): string {
    const keys = Object.keys(paramsObject);
    return keys.map((key) => {
        const value: string | undefined = paramsObject[key];
        const seperator = (typeof value === 'string') ? '=' : '';
        const normalizedValue = value || '';

        return encodeURI(key) + seperator + encodeURI(normalizedValue);
    }).join('&');
}