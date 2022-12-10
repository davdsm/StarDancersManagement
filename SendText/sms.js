import dotenv from "dotenv";
import TeleSignSDK from "telesignsdk";
import nodeCron from "node-cron";
import { getStudents, resetJobs, sleep } from "./api.js";

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
  console.log(responseBody)
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

// 01 30 12 10 * * -> Dia 10 de cada mês às 12h30
nodeCron.schedule("50 40 00 10 * *", async () => {
  const students = await getStudents();
  let i = 0;
  const Timer = setInterval(() => {
    if(students[i]) {
      const student = students[i]
      if (!student.attributes.Paid) {
        let phoneNumber = student.attributes.ParentContact
        if(phoneNumber.indexOf("+") === -1) {
          phoneNumber = "+351" + student.attributes.ParentContact;
        }
        client.sms.message(
          (error, responseBody) =>
            messageCallback(
              error,
              responseBody,
              student.attributes.Name,
              student.attributes.ParentContact
            ),
          phoneNumber,
          `Caro Enc. Educação,
  Atingiu o limite de pagamento da mensalidade da dança. A partir do dia de hoje terá um acréscimo de 0,50€ por dia.
  Podem fazer o pagamento no local, por transferência bancária ou mbway.
  Ficam aqui as referências:
  Mbway: 912642786
  NIB: 0036 0169 99100030447 49.
  (Caso o façam desta forma peço que confirmem).
  Preciso da vossa compreensão nesse sentido.
  Cumprimentos,
  StarDancers.`,
          "ARN"
        );
      }
      i++;
    } else {
      clearInterval(Timer)
      i = 0;
    }
  }, 1000);
});
console.log(
  "🐬 Not Paid students will receive a sms text day 10th every month."
);
console.log("");
