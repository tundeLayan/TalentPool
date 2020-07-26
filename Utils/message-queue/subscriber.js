const amqplib = require('amqplib/callback_api');
const chalk = require('chalk');
const debug = require('debug')('talentpool:MessageQueue');
const sendMail = require('../send-email');

const subscribeToMessage = () => {
  // Create connection to AMQP server
  amqplib.connect(process.env.TALENT_POOL_RABBITMQ_AMPQ, (err, connection) => {
    if (err) {
      debug(err.stack);
      return process.exit(1);
    }

    // Create channel
    connection.createChannel((connectionErr, channel) => {
      if (connectionErr) {
        debug(err.stack);
        return process.exit(1);
      }

      // Ensure queue for messages
      channel.assertQueue(process.env.TALENT_POOL_RABBITMQ_QUEUE, {
        // Ensure that the queue is not deleted when server restarts
        durable: true,
      }, queueAssertErr => {
        if (queueAssertErr) {
          debug(err.stack);
          return process.exit(1);
        }
        debug(chalk.green(`[✔] Message Queue Initialized`))

        // Only request 1 un-acked message from queue
        // This value indicates how many messages we want to process in parallel
        channel.prefetch(1);

        // Set up callback to handle messages received from the queue
        channel.consume(process.env.TALENT_POOL_RABBITMQ_QUEUE, async (data) => {
          if (data === null) {
            return;
          }

          // Decode message contents
          const message = JSON.parse(data.content.toString());

          // Send the message using the previously set up Nodemailer transport
          await sendMail(message);
          // remove message item from the queue
          channel.ack(data);
        });
        return true;
      });
      return true;
    });
    return true;
  });
};

module.exports.subscribeToMessage = subscribeToMessage;
