import dotenv from "dotenv";
import nodeCron from "node-cron";
import request from "request";
import Twilio from "twilio";
import { getStudents, resetJobs, sleep } from "./api.js";

dotenv.config();

const debug = false;
let errorContacts = [];

/*
* Save the list of parents that received an SMS in order to not duplicate sms receivers
* and to send Sara the list of parents that received SMS.
*/
const parents = [];

const debugContacts = {
  "0": {
    "id": 1,
    "attributes": {
      "Name": "David Magalhães",
      "ParentName": "David Magalhães",
      "ParentContact": "912074406",
      "ParentEmail": "geral@davdsm.pt",
      "ParentNIF": "0",
      "Class": "Adultos",
      "Price": 1,
      "Observations": "Nada",
      "ImageRights": true,
      "Paid": false,
      "Week": [
        "Segunda"
      ],
      "createdAt": "2024-04-09T21:19:59.927Z",
      "updatedAt": "2024-04-09T21:19:59.927Z",
      "publishedAt": "2024-04-09T21:19:59.926Z",
      "BornDate": "1989-10-11"
    }
  },
  "1": {
    "id": 2,
    "attributes": {
      "Name": "Ana Cláudia Oliveira Gonçalves ",
      "ParentName": "Ana Gonçalves ",
      "ParentContact": "912642786",
      "ParentEmail": "goncalvesana2@hotmail.com",
      "ParentNIF": "0",
      "Class": "Adultos",
      "Price": 1,
      "Observations": "Nada",
      "ImageRights": true,
      "Paid": false,
      "Week": [
        "Segunda"
      ],
      "createdAt": "2024-04-09T21:19:59.927Z",
      "updatedAt": "2024-04-09T21:19:59.927Z",
      "publishedAt": "2024-04-09T21:19:59.926Z",
      "BornDate": "1989-10-11"
    }
  },
}

async function sendSMS(phoneNumber, parentName) {
  const text = `${debug ? "---ISTO É UM TESTE PARA DAVID E ANA--- " : ''}Caro Encarregado de educação ${parentName},
  StarDancers_dance_studio, vem por este meio lembrá-lo(a) que o vencimento da mensalidade das aulas de dança do seu educando termina hoje, dia 8. 
  No entanto, gostaríamos de salientar que a aplicação de qualquer coima só ocorrerá a partir do dia 10 em diante, caso o pagamento não seja efetuado até lá. 
  O contato serve para lembrar a regularização da situação para garantir a vaga do seu educando. 
  Estamos à disposição para esclarecer eventuais dúvidas. 
  
  Atenciosamente,
  StarDancers.
  
  (Em caso de pagamento por transferência multibanco é obrigatório o comprovativo para assim a situação ficar como regularizada)
  `

  /*
  * Credentials and on system vars for security reasons
  */
  const accountSid = process.env.SMS_ACCOUNT_ID;
  const authToken = process.env.SMS_AUTH_TOKEN;

  const client = new Twilio.Twilio(accountSid, authToken);

  client.messages
    .create({
      body: text,
      messagingServiceSid: 'MG23ac2229bf53017625d9c3d9e095b47c',
      to: phoneNumber
    }, function (error, message) {
      if (error) {
        errorContacts.push(`${phoneNumber}(${parentName})`)
        console.log(`There is an error with ${phoneNumber}(${parentName}).`);
        console.log(`${error}, ${message}`);
      }
    })

  console.log(`enviou mensagem para ${phoneNumber} - ${parentName}`)
}

function sendEmail(parents) {
  console.log("");
  console.log("⚡ SMS Sent - ", parents.length);
  console.log("⚡ Done for today - ", new Date());

  // send email noticing admin
  request({
    url: "http://api.davdsm.pt:8030/sendMail",
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "davdsmKey": 'd41d8cd98f00b204e9800998ecf8427e'  // <--Very important!!!
    },
    body: JSON.stringify({
      sender: "⭐ StarDancers",
      receiver: {
        email: debug ? "samuel_david_8@hotmail.com" : "stardancers2017@gmail.com",
        name: "Admnistradora Ana"
      },
      subject: `✈️ (${parents.length}) SMS Enviados`,
      message: `<h3>Olá Ana</h3><p>Este mês sairam ${parents.length} mensagens, segue a lista de pais que receberam o aviso de não pagamento:<br/> ${parents.map(parent => `${parent} <br/>`)}</p>Contactos com erro: ${errorContacts.map(contact => `${contact} <br/>`)}<br/><br/><br/>Obrigada.<br/><b>Star Dancers App</b>`
    })
  }, function (error, response, body) {
    console.log("✈️ Email Enviado? - ", response.body);
    console.log("---------------------------------------------------");
    console.log("");
  });
}

/*
* In the first day of every month we need to
* set every user as paid = false;
*/
const day1st = "00 01 00 1 * *";
nodeCron.schedule(
  day1st, // 1st Every Month at 9am
  async () => {
    await resetJobs();
    console.log("👪 Everyone Reseted");
  }
);
/*
* Because stripe has pagination on get all
* we need to go through all pages
*/
let pageCount = 1;

/*
* @param page
* we need to go through all pages of users, is faster if we receive with pagination.
* Go through all users on one page and then go to another. 
*/
const goThroughUsers = async (page) => {

  console.log(`-- starting --`);

  /*
  * Get Students from Database
  */
  const metaStudents = await getStudents(page);
  const students = debug ? debugContacts : metaStudents.data;

  /*
  * Create an index for getting track of wich user we are using
  */
  let i = 0;


  /*
  * Send a text every 5 seconds so
  * we dont overload the SMS system server
  */
  const Timer = setInterval(() => {
    if (students[i]) {
      const student = students[i];

      /*
      * If user has not paid yet, check if their parent already
      * have received an SMS, and if not, send one.
      */
      if (!student.attributes.Paid) {
        let phoneNumber = student.attributes.ParentContact;

        /*
        * In case of contact don't have +351, set it all
        */
        if (phoneNumber.indexOf("+") === -1) {
          phoneNumber = "+351" + student.attributes.ParentContact;
        }

        /*
        * This parent, already have received one sms?
        * if so, dont sent another one
        */
        if (!parents.find(parentName => parentName === student.attributes.ParentName)) {
          parents.push(student.attributes.ParentName);
          sendSMS(phoneNumber, student.attributes.ParentName)
        }
      }

      i++;
    } else {
      /*
      * If there are not more users,
      * stop this timer, increase the pagination counter and run this function again
      */
      clearInterval(Timer);
      i = 0;

      /*
      * if page count is diferent than the current page,
      * run this function again but with pageCount increased
      */
      if (metaStudents.meta.pagination.pageCount !== metaStudents.meta.pagination.page && !debug) {
        pageCount += 1;
        goThroughUsers(pageCount)
      } else {
        sendEmail(parents)
        console.log(`-- finish --`);
        console.log(``);
        console.log(``);
      }
    }
  }, 5000);

}

console.log("🐬 Everyone will be set as Not Paid at day 1st every month.");
console.log(
  "🐬 Not Paid students will receive a sms text day 8 every month."
);
// 01 00 18 8 * * -> Dia 8 de cada mês às 18h00

nodeCron.schedule("01 00 18 8 * *", async () => {
  errorContacts = [];
  goThroughUsers();
});

console.log("");

if (debug) {
  errorContacts = [];
  goThroughUsers();
}
