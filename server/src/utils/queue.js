const Queue = require("bull");
const Gmail = require("../controllers/gmail");
const Socket = require("./socketmanager");
const Cache = require("./cache");

const EmailQueue = new Queue(
  "sendEmail",
  "redis://h:pfe10bf81fa1cfcbe45ea53c68a13122187f0449dc37dfd9c1067143fdbe99fc3@ec2-54-205-142-146.compute-1.amazonaws.com:6409"
);

module.exports = EmailQueue;
