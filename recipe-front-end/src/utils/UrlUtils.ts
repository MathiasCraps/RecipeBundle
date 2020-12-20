export interface GetParamsObject {
    key: string;
    value: string | undefined;
}

export function parseGetParams(getParamsString: string): GetParamsObject[] {
    return getParamsString.replace('?', '').split('&').map((entry) => {
        var subIndex = entry.indexOf('=');
        var hasValue = subIndex > -1;
        var key = hasValue ? entry.substring(0, subIndex) : entry;
        var value = hasValue ? entry.substring(subIndex, entry.length) : undefined;
        return { key, value };
    });
}

