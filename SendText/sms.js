import dotenv from "dotenv";
import TeleSignSDK from "telesignsdk";
import nodeCron from "node-cron";
import { getStudents, resetJobs } from "./api.js";

dotenv.config();
const customerId = process.env.SMS_CUSTOMER_ID;
const apiKey = process.env.SMS_API_KEY;

const rest_endpoint = "https://rest-api.telesign.com";
const timeout = 10 * 1000; // 10 secs

const client = new TeleSignSDK(
  customerId,
  apiKey,
  rest_endpoint,
  timeout // optional
  // userAgent
);

function messageCallback(error, responseBody, personName, personNumber) {
  if (error === null) {
    console.log(`🟩 SMS SUCCESS SENDED TO ${personName} - ${personNumber}`);
  } else {
    console.error("🟥 Unable to send message. " + error);
  }
}

const day1st = "00 01 00 1 * *";
nodeCron.schedule(
  //  RESET JOBS
  day1st, // 1st Every Month at 9am
  async () => {
    await resetJobs();
    console.log("👪 Everyone Reseted");
  }
);
console.log("🐬 Everyone will be set as Not Paid at day 1st every month.");

// 01 30 12 9 * * -> Dia 9 de cada mês às 12h30
nodeCron.schedule("01 30 12 9 * *", async () => {
  const students = await getStudents();
  students.forEach((student) => {
    if (!student.attributes.Paid) {
      client.sms.message(
        (error, responseBody) =>
          messageCallback(
            error,
            responseBody,
            student.attributes.Name,
            student.attributes.ParentContact
          ),
        student.attributes.ParentContact,
        `Bom dia ${student.ParentName}, informamos que o pagamento da
        mensalidade ainda não se contra realizado e a data limite de pagamento é amanhã. - Academia StarDancers`,
        "ARN"
      );
    }
  });
});
console.log(
  "🐬 Not Paid students will receive a sms text day 9th every month."
);
console.log("");
