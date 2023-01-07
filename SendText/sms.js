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
  console.log(responseBody);
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

let [pageCount, outSMS] = [1, 0];

const sendText = async (page) => {
  const metaStudents = await getStudents(page);
  let i = 0;
  const students = metaStudents.data;
  const Timer = setInterval(() => {
    if (students[i]) {
      const student = students[i];
      if (!student.attributes.Paid) {
        let phoneNumber = student.attributes.ParentContact;
        if (phoneNumber.indexOf("+") === -1) {
          phoneNumber = "+351" + student.attributes.ParentContact;
        }
        console.log(student.attributes.ParentName)
        client.sms.message(
          (error, responseBody) =>
            messageCallback(
              error,
              responseBody,
              student.attributes.Name,
              student.attributes.ParentContact
            ),
          phoneNumber,
          `Caro Enc. Educação ${student.attributes.ParentName},

          Hoje é o limite de pagamento da mensalidade da dança. Terá de ser efetuada até ao final do dia de hoje com pena de um acréscimo de 0,50€ por dia a partir de amanhã.
          Passando a data limite peço que se dirija ao balcão da academia para regularizar a situação.
          Agradeço a vossa compreensão nesse sentido.
          Cumprimentos,

          StarDancers*`,
          "ARN"
        );
        outSMS += 1;
      }

      i++;
    } else {
      clearInterval(Timer);
      i = 0;
      if(metaStudents.meta.pagination.pageCount !== metaStudents.meta.pagination.page) {
        pageCount += 1;
        sendText(pageCount)
      } else {
        console.log("");
        console.log("📳 SMS Out - ", outSMS);
        console.log("⚡ Done for today - ", new Date());
        console.log("---------------------------------------------------");
        console.log("");
      }

    }
  }, 3000);
}

console.log("🐬 Everyone will be set as Not Paid at day 1st every month.");

// 01 30 12 10 * * -> Dia 10 de cada mês às 12h30

nodeCron.schedule("01 30 12 10 * *", async () => {
  sendText();
});

console.log(
  "🐬 Not Paid students will receive a sms text day 10th every month."
);
console.log("");