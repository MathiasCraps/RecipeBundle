export interface GetParamsObject {
    key: string;
    value: string | undefined;
}

export function parseGetParams(getParamsString: string): GetParamsObject[] {
    return getParamsString.replace('?', '').split('&').map((entry) => {
        const subIndex = entry.indexOf('=');
        const hasValue = subIndex > -1;
        const key = hasValue ? entry.substring(0, subIndex) : entry;
        const value = hasValue ? entry.substring(subIndex + 1, entry.length) : undefined;
        return { key, value };
    });
}

