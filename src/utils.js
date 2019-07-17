export function dateToServerEpoch(date) {
    if (!date) return date;

    if (date instanceof Date) return toSeconds(date.getTime());

    return toSeconds(date);
}

export function isInMiliSeconds(epoch) {
    return epoch.toString().length >= 13;
}

export function toSeconds(epoch) {
    return isInMiliSeconds(epoch) ? Math.floor(epoch / 1000) : epoch;
}

const defaultRange = {
    end  : 'latest',
    count: 1000,
};

export function parseHistoryArgs(options = {}) {
    let parsed = {};

    if (typeof options === 'string') {
        parsed.symbol = options;
        parsed.range  = defaultRange;
    } else {
        parsed        = { ...options };
        parsed.range  = { ...defaultRange, ...options.range };
        parsed.symbol = options.symbol;
    }

    return parsed;
}

export function parseRequestRange({ start, end, count } = {}) {
    const request = {};

    if (count) request.count = count;
    if (start) request.start = dateToServerEpoch(start);
    if (end) request.end = dateToServerEpoch(end);

    return request;
}

export function toPipSize(pip) {
    return pip.toString().length - 2;
}

export function mapApiFields(request, mapping) {
    const clone = { ...request };

    Object.keys(clone).forEach((field) => {
        if (field in mapping) {
            const value = delete clone[field];

            clone[mapping[field]] = value;
        }
    });

    return clone;
}
