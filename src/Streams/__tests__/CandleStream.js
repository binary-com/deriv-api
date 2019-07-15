import { first }    from 'rxjs/operators';

import DerivAPI     from '../../DerivAPI';
import Candle       from '../../Immutables/Candle';
import CandleStream from '../CandleStream';

let api;
let candle_stream;
const count = 1000;

beforeAll(async () => {
    api = new DerivAPI();

    candle_stream = await api.candleStream('R_100');
});

afterAll(() => {
    api.disconnect();
});

test('Request for a candles history', async () => {
    expect(candle_stream).toBeInstanceOf(CandleStream);

    expect(() => { candle_stream.list = []; }).toThrow(Error);

    const candles = candle_stream.list; // last 1000 1-minute candles

    expect(candles).toBeInstanceOf(Array);
    expect(candles).toHaveLength(count);
    expect(candles.slice(-1)[0]).toBeInstanceOf(Candle);

    const old_candles = await candle_stream.history({ count: 100, end: new Date() });

    expect(old_candles).toBeInstanceOf(Array);
    expect(old_candles).toHaveLength(100);
    expect(old_candles.slice(-1)[0]).toBeInstanceOf(Candle);
});

test('list stays up to date with the last candle', async () => {
    const last_candle = candle_stream.list.slice(-1)[0];

    const recent_candle = await candle_stream.onUpdate().pipe(first()).toPromise();

    // Candle was pushed to the end of the list
    expect(candle_stream.list.slice(-2)[0]).toEqual(last_candle);
    expect(candle_stream.list.slice(-1)[0]).toEqual(recent_candle);

    expect(candle_stream.list).toHaveLength(count);
});

test('Check individual candles', async () => {
    const [first_candle] = candle_stream.list;

    expect(first_candle.open.pip_size).toEqual(2);
    expect(first_candle.close.pip_sized).toEqual(first_candle.close.value.toFixed(2));
    expect(first_candle.time.isSameOrBefore(new Date())).toBeTruthy();
    expect(first_candle.open_time.isSameOrBefore(new Date())).toBeTruthy();
});
