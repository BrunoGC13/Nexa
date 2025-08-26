    const cron = require('node-cron');

    const reminder = require('./mail/todo_reminder');

    function run() {
        const task = cron.schedule('0 14 * * *', () => {
            console.log('Sending todo remider now.');
            reminder.main().catch(err => console.error(err));

        }, {
            scheduled: true,
            timezone: "Europe/Berlin"
        });

        task.start();
    }

    module.exports = { run };