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

