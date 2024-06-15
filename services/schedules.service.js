const schedule = require('node-cron');

class ScheduleService {
    #jobs;
    registerSchedule(scene, handler) {
        const cronString = this.buildCronString(scene.schedules);
        const job = schedule.schedule(cronString, function(){
            handler(scene);
        }, {timezone: 'UTC'});
        this.#jobs[scene._id] = job;
    }

    buildCronString(schedules) {
        let minutes = '?';
        let hours = '?';
        let daysOfWeek = '?';
        let daysOfMonth = '?';
        let month = '?';

        let cron = {month, daysOfWeek, daysOfMonth, hours, minutes};

        const result = schedules.reduce((c, schedule) => {
            c.minutes = this.#updateCronElement(c.minutes, schedule.minute, []);
            c.hours = this.#updateCronElement(c.hours, schedule.hour, [c.minutes]);
            c.daysOfWeek = this.#updateCronElement(c.daysOfWeek, schedule.dayOfWeek, []);
            c.daysOfMonth = this.#updateCronElement(c.daysOfMonth, schedule.dayOfMonth, [c.minutes, c.hours], c.daysOfWeek !== '?' && c.daysOfWeek !== '*');
            c.month = this.#updateCronElement(c.month, schedule.month, [c.minutes, c.hours, c.daysOfMonth, c.daysOfWeek]);

            c.minutes = this.#updateFractionCronElement(c.minutes, schedule.minutesOfHour, []);
            c.hours = this.#updateFractionCronElement(c.hours, schedule.hoursOfDay, [c.minutes]);
            c.daysOfMonth = this.#updateFractionCronElement(c.daysOfMonth, schedule.daysOfMonth, [c.minutes, c.hours], c.daysOfWeek !== '?' && c.daysOfWeek !== '*');
            c.month = this.#updateFractionCronElement(c.month, schedule.monthsOfYear, [c.minutes, c.hours, c.daysOfMonth, c.daysOfWeek]);

            return c;
        }, cron);

        return `${result.minutes} ${result.hours} ${result.daysOfMonth} ${result.month} ${result.daysOfWeek}`;
    }

    #updateFractionCronElement(currentValue, newValue, previous, invalidate = false) {
        if (invalidate) return '?';
        if (newValue !== undefined) {
            const v = `0/${newValue}`;
            if (currentValue === '?' || currentValue === '*') return v;
            else if (this.#hasValueInArray(currentValue, v)) {
                return currentValue;
            } else {
                return `${currentValue},${v}`;
            }
        }
        if (previous.some((val) => val !== '?') && currentValue === '?') return '*';
        return currentValue;
    }

    #updateCronElement(currentValue, newValue, previous, invalidate = false) {
        if (invalidate) return '?';
        if (newValue !== undefined) {
            if (currentValue === '?' || currentValue === '*') return newValue;
            else if (this.#hasValueInArray(currentValue, newValue)) {
                return currentValue;
            } else {
                return `${currentValue},${newValue}`;
            }
        }
        if (previous.some((val) => val !== '?') && currentValue === '?') return '*';
        return currentValue;
    }

    #hasValueInArray(current, newValue) {
        if (typeof current === "number") return current == newValue;
        return current.split(',').some((v) => v == newValue);
    }
}

const service = new ScheduleService();

function test(input, expected, testName) {
    let output = service.buildCronString(input);
    console.log(`${testName} --> expected: ${expected} === current: ${output}`);
    return (expected == output) ? 0 : 1;
}

let errors = 0;
errors+= test([{month: 12, dayOfMonth: 25, hour: 0, minute: 0}], '0 0 25 12 ?', 'Navidad');
errors+= test([{dayOfMonth: 6, hour: 12, minute: 0}], '0 12 6 * ?', 'Todos los 6 de cada mes');
errors+= test([{dayOfMonth: 11, hour: 12, minute: 0}, {dayOfMonth: 14, hour: 12, minute: 0}], '0 12 11,14 * ?', '11 y 14 de cada mes');
errors+= test([{dayOfWeek: 'SAT', hour: 11, minute: 0}], '0 11 ? * SAT', 'Todos los sabados');
errors+= test([{dayOfWeek: 'TUE', hour: 12, minute: 45}, {dayOfWeek: 'WED', hour: 12, minute: 45}], '45 12 ? * TUE,WED', 'Todos los Martes y Miercoles');
errors+= test([{hour: 16, minute: 0}], '0 16 * * ?', 'Todos los Dias a las 16:00');
errors+= test([{minutesOfHour: 5}], '0/5 * * * ?', 'Todos los Dias cada 5 minutos');
errors+= test([{daysOfMonth: 2, hour: 18, minute: 0}], '0 18 0/2 * ?', 'Cada dos Dias a las 18:00');

console.log(`${errors} errors`);

module.exports = service;
