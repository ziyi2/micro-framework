/* eslint-disable no-param-reassign */
/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { noop } from 'lodash';
const rawWindowInterval = window.setInterval;
const rawWindowClearInterval = window.clearInterval;
export default function patch(global) {
    let intervals = [];
    global.clearInterval = (intervalId) => {
        intervals = intervals.filter((id) => id !== intervalId);
        return rawWindowClearInterval.call(window, intervalId);
    };
    global.setInterval = (handler, timeout, ...args) => {
        const intervalId = rawWindowInterval(handler, timeout, ...args);
        intervals = [...intervals, intervalId];
        return intervalId;
    };
    return function free() {
        intervals.forEach((id) => global.clearInterval(id));
        global.setInterval = rawWindowInterval;
        global.clearInterval = rawWindowClearInterval;
        return noop;
    };
}
