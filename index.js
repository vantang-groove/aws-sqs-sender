const AWS = require('aws-sdk');
const auth = require('./auth.json');
const data = require('./data.json');

AWS.config.update(auth);

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const createQueueParams = {
  QueueName: data.queueName
}

sqs.createQueue(createQueueParams, function (err, res) {
  if (err) {
    console.log("Error when creating queue", err);
  } else {
    console.log("Queue created, ueue url: ", res.QueueUrl);

    data.keywords.map((keyword) => {
      const messageParams = {
        QueueUrl: res.QueueUrl,
        MessageBody: JSON.stringify({ keyword: keyword }),
      }

      sqs.sendMessage(messageParams, function (sendMessageErr, sendMessageRes) {
        if (err) {
          console.log("Error when sending message", sendMessageErr);
        } else {
          console.log("Sent message with payload", messageParams.MessageBody, ", message ID:", sendMessageRes.MessageId);
        }
      });
    });
  }
});
