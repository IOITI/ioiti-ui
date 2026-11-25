export const format = {
    milliseconds: 'ms',
    seconds: 's',
    minutes: 'min',
    hours: 'h',
    days: 'j',
    future: (duration) => `dans ${duration}`,
    past: (duration) => `il y a ${duration}`,
    bytes: 'o',
    kilobytes: 'ko',
    megabytes: 'Mo',
    gigabytes: 'Go',
};
