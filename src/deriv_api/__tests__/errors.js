import { first }     from 'rxjs/operators';

import DerivAPIBasic from '../DerivAPIBasic';

let api;

beforeAll(() => {
    const connection = new WebSocket(
        'wss://blue.binaryws.com/websockets/v3?app_id=1&l=EN',
    );

    api = new DerivAPIBasic({ connection });
});

test('Request ticks for InvalidSymbol', async () => {
    await expect(api.ticks({ ticks: 'InvalidSymbol' })).rejects.toBeInstanceOf(
        Error,
    );
});

test('Subscribe to ticks with callback', async () => {
    await expect(
        api.subscribeWithCallback({ ticks: 'InvalidSymbolCallback' }, () => {}),
    ).rejects.toBeInstanceOf(Error);
});

test('Subscribe to ticks with Observables 1', async () => {
    const obj = { ticks: 'InvalidSymbolObservable1' };
    await expect(
        api
            .subscribe(obj)
            .pipe(first())
            .toPromise(),
    ).rejects.toBeInstanceOf(Error);
});
