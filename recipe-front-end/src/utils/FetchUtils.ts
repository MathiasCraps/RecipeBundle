import { findRenderedDOMComponentWithClass } from "react-dom/test-utils";

export async function waitForDataAsJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const awaitedRequest = await fetch(input, init);
    return awaitedRequest.json();
}