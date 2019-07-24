import {
    take,
    toArray,
}                     from 'rxjs/operators';
import { Observable } from 'rxjs';
import WS             from 'ws';

import DerivAPIBasic  from '../DerivAPIBasic';

let api;

beforeAll(() => {
    const connection = new WS(
        'wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN',
    );

    api = new DerivAPIBasic({ connection });
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
    const mock_fn = jest.fn();

    const response = await api.subscribeWithCallback(
        { website_status: 1 },
        mock_fn,
    );

    expect(response.msg_type).toBe('website_status');

    expect(mock_fn).toHaveBeenCalledTimes(1);
});

test('Subscribe with api.subscribe should return an Observable', async () => {
    const source = api.subscribe({ ticks: 'R_100' });

    expect(source).toBeInstanceOf(Observable);

    const mock_fn = jest.fn();
    source.subscribe(mock_fn);

    expect(mock_fn).toHaveBeenCalledTimes(0);

    const two_responses = await source
        .pipe(
            take(2),
            toArray(),
        )
        .toPromise();

    expect(mock_fn).toHaveBeenCalledTimes(2);

    expect(two_responses).toBeInstanceOf(Array);
});
