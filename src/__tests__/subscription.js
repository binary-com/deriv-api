import { Observable } from 'rxjs';
import {
    take,
    toArray,
}                     from 'rxjs/operators';
import WS             from 'ws';
import DerivAPI       from '../DerivAPI';

let api;

beforeAll(() => {
    const connection = new WS(
        'wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN',
    );

    api = new DerivAPI({ connection });
});

afterAll(() => {
    api.disconnect();
});

test('Subscribe calling api.subscribeWithCallback without callback', async () => {
    expect(
        api.subscribeWithCallback({ website_status: 1 }),
    ).rejects.toBeInstanceOf(Error);
});

test('Subscribe by calling api.subscribeWithCallback and callback', async () => {
    const mockFn = jest.fn();

    const response = await api.subscribeWithCallback(
        { website_status: 1 },
        mockFn,
    );

    expect(response.msg_type).toBe('website_status');

    expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Subscribe with api.subscribe should return an Observable', async () => {
    const source = api.subscribe({ ticks: 'R_100' });

    expect(source).toBeInstanceOf(Observable);

    const mockFn = jest.fn();
    source.subscribe(mockFn);

    expect(mockFn).toHaveBeenCalledTimes(0);

    const twoResponses = await source
        .pipe(
            take(2),
            toArray(),
        )
        .toPromise();

    expect(mockFn).toHaveBeenCalledTimes(2);

    expect(twoResponses).toBeInstanceOf(Array);
});
