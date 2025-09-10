import dotenv from "dotenv";
import nodeCron from "node-cron";
import request from "request";
import Twilio from "twilio";
import { getStudents, getTodayBirthdays, resetJobs, sleep } from "./api.js";

dotenv.config();

const debug = false;
let errorContacts = [];


/*
* Credentials and on system vars for security reasons
*/
const accountSid = process.env.SMS_ACCOUNT_ID;
const authToken = process.env.SMS_AUTH_TOKEN;

const client = new Twilio.Twilio(accountSid, authToken);

/*
 * Save the list of parents that received an SMS in order to not duplicate sms receivers
 * and to send Sara the list of parents that received SMS.
 */
let parents = [];

const debugContacts = {
  0: {
    id: 1,
    attributes: {
      Name: "David Magalhães",
      ParentName: "David Magalhães",
      ParentContact: "912074406",
      ParentEmail: "geral@davdsm.pt",
      ParentNIF: "0",
      Class: "Adultos",
      Price: 1,
      Observations: "Nada",
      ImageRights: true,
      Paid: false,
      Week: ["Segunda"],
      createdAt: "2024-04-09T21:19:59.927Z",
      updatedAt: "2024-04-09T21:19:59.927Z",
      publishedAt: "2024-04-09T21:19:59.926Z",
      BornDate: "1989-10-11",
    },
  },
  1: {
    id: 2,
    attributes: {
      Name: "Ana Cláudia Oliveira Gonçalves ",
      ParentName: "Ana Gonçalves ",
      ParentContact: "912642786",
      ParentEmail: "goncalvesana2@hotmail.com",
      ParentNIF: "0",
      Class: "Adultos",
      Price: 1,
      Observations: "Nada",
      ImageRights: true,
      Paid: false,
      Week: ["Segunda"],
      createdAt: "2024-04-09T21:19:59.927Z",
      updatedAt: "2024-04-09T21:19:59.927Z",
      publishedAt: "2024-04-09T21:19:59.926Z",
      BornDate: "1989-10-11",
    },
  },
};

async function sendSMS(phoneNumber, parentName) {
  const text = `${
    debug ? "teste-" : ""
  }STARDANCERS informa que sua mensalidade vence hoje. Solicitamos a regularização até o final do dia. Atenciosamente, Academia StarDancers.`;

  client.messages.create(
    {
      body: text,
      messagingServiceSid: "MG23ac2229bf53017625d9c3d9e095b47c",
      to: phoneNumber,
    },
    function (error, message) {
      if (error) {
        errorContacts.push(`${phoneNumber}(${parentName})`);
        console.log(`There is an error with ${phoneNumber}(${parentName}).`);
        console.log(`${error}, ${message}`);
      }
    }
  );

  console.log(`enviou mensagem para ${phoneNumber} - ${parentName}`);
}

function sendEmail(parents) {
  console.log("");
  console.log("⚡ SMS Sent - ", parents.length);
  console.log("⚡ Done for today - ", new Date());

  // send email noticing admin
  request(
    {
      url: "http://api.davdsm.pt/sendMail",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        davdsmKey: "d41d8cd98f00b204e9800998ecf8427e", // <--Very important!!!
      },
      body: JSON.stringify({
        sender: "⭐ StarDancers",
        receiver: {
          email: debug
            ? "samuel_david_8@hotmail.com"
            : "stardancers2017@gmail.com",
          name: "Admnistradora Ana",
        },
        subject: `✈️ (${parents.length}) SMS Enviados`,
        message: `<h3>Olá Ana</h3><p>Este mês sairam ${
          parents.length
        } mensagens, segue a lista de pais que receberam o aviso de não pagamento:<br/> ${parents.map(
          (parent) => `${parent} <br/>`
        )}</p>Contactos com erro: ${errorContacts.map(
          (contact) => `${contact} <br/>`
        )}<br/><br/><br/>Obrigada.<br/><b>Star Dancers App</b>`,
      }),
    },
    function (error, response, body) {
      console.log("✈️ Email Enviado? - ", response.body);
      console.log("---------------------------------------------------");
      console.log("");
    }
  );
}

/*
 * In the first day of every month we need to
 * set every user as paid = false;
 */
const day1st = "00 01 00 1 * *"; // Dia 1 à 00h01
const day8th = "01 17 8 * *"; // Dia 8 às 18h
const everyDay10am = "0 0 10 * * *"; // Todos os dias às 10h00
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
        if (
          !parents.find(
            (parentName) => parentName === student.attributes.ParentName
          )
        ) {
          parents.push(student.attributes.ParentName);
          sendSMS(phoneNumber, student.attributes.ParentName);
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
      if (
        metaStudents.meta.pagination.pageCount !==
          metaStudents.meta.pagination.page &&
        !debug
      ) {
        pageCount += 1;
        goThroughUsers(pageCount);
      } else {
        sendEmail(parents);
        console.log(`-- finish --`);
        console.log(``);
        console.log(``);
      }
    }
  }, 5000);
};

console.log("🐬 Everyone will be set as Not Paid at day 1st every month.");
console.log("🐬 Not Paid students will receive a sms text day 8 every month.");
console.log("🎂 Birthday messages will be sent.");

console.log("");

const birthdayMessages = async () => {

  const debugContacts = [
    {
    id: 1,
    attributes: {
      Name: "David Magalhães",
      ParentName: "David Magalhães",
      ParentContact: "912074406",
      ParentEmail: "geral@davdsm.pt",
      ParentNIF: "0",
      Class: "Adultos",
      Price: 1,
      Observations: "Nada",
      ImageRights: true,
      Paid: false,
      Week: ["Segunda"],
      createdAt: "2024-04-09T21:19:59.927Z",
      updatedAt: "2024-04-09T21:19:59.927Z",
      publishedAt: "2024-04-09T21:19:59.926Z",
      BornDate: "1989-10-11",
    }},{
    id: 2,
    attributes: {
      Name: "Ana Cláudia Oliveira Gonçalves ",
      ParentName: "Ana Gonçalves ",
      ParentContact: "912642786",
      ParentEmail: "goncalvesana2@hotmail.com",
      ParentNIF: "0",
      Class: "Adultos",
      Price: 1,
      Observations: "Nada",
      ImageRights: true,
      Paid: false,
      Week: ["Segunda"],
      createdAt: "2024-04-09T21:19:59.927Z",
      updatedAt: "2024-04-09T21:19:59.927Z",
      publishedAt: "2024-04-09T21:19:59.926Z",
      BornDate: "1989-10-11",
    },
  }
  ]

  const todaysBirthdays = debug ? debugContacts : await getTodayBirthdays();
  const results = [];

   const text = `${
        debug ? "teste-" : ""
      }Feliz aniversário! Que a energia da dança te contagie e faça brilhar!⭐ Com carinho StarDancers`;      
 
  for (const birthday of todaysBirthdays) {

    let phoneNumber = birthday.attributes.ParentContact;

     if (birthday.attributes.ParentContact.indexOf("+") === -1) {
        phoneNumber = "+351" + birthday.attributes.ParentContact;
      }

      const message = client.messages.create(
        {
          body: text,
          messagingServiceSid: "MG23ac2229bf53017625d9c3d9e095b47c",
          to: phoneNumber,
        },
        function (error, message) {
          if (error) {
            errorContacts.push(`${phoneNumber}(${birthday.attributes.Name})`);
            console.log(`There is an error with ${phoneNumber}(${birthday.attributes.Name}).`);
            console.log(`${error}, ${message}`);
          }
        }
      );

      console.log(`✅ Sent Happy Birthday to to ${phoneNumber} | ${birthday.attributes.Name}}`);
      results.push({ number: phoneNumber, sid: message.sid, status: "sent" });
  }
}

// Correr o script - 01 00 18 8 * * -> Dia 8 de cada mês às 18h00
nodeCron.schedule(day8th, async () => {
  errorContacts = [];
  parents = [];
  goThroughUsers();
});

// Dar reset - 01 17 8 * * * * -> Dia 1 de cada mês às 00h01
nodeCron.schedule(
  day1st, // 1st Every Month at 9am
  async () => {
    await resetJobs();
    console.log("👪 Everyone Reseted");
  }
);

nodeCron.schedule(
  everyDay10am, // 1st Every Month at 10am
  async () => {
    await birthdayMessages();
  }
);

if (debug) {
  errorContacts = [];
  parents = [];
  goThroughUsers();
}
