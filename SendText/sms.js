import dotenv from "dotenv";
import nodeCron from "node-cron";
import request from "request";
import Twilio from "twilio";
import { getStudents, resetJobs, sleep } from "./api.js";
import { fileURLToPath } from "url";

dotenv.config();

const debug = false; // Set to true for testing with debugContacts
const dryRun = true; // Set to true para não enviar SMS de fato
let errorContacts = [];
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
      "Week": ["Segunda"],
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
      "Week": ["Segunda"],
      "createdAt": "2024-04-09T21:19:59.927Z",
      "updatedAt": "2024-04-09T21:19:59.927Z",
      "publishedAt": "2024-04-09T21:19:59.926Z",
      "BornDate": "1989-10-11"
    }
  }
};

async function sendSMS(phoneNumber, parentName) {
  const text = `${debug ? "---ISTO É UM TESTE PARA DAVID E ANA--- " : ''}Caro Encarregado de educação ${parentName},
  StarDancers_dance_studio, vem por este meio lembrá-lo(a) que o vencimento da mensalidade das aulas de dança do seu educando termina hoje, dia 8. 
  No entanto, gostaríamos de salientar que a aplicação de qualquer coima só ocorrerá a partir do dia 10 em diante, caso o pagamento não seja efetuado até lá. 
  O contato serve para lembrar a regularização da situação para garantir a vaga do seu educando. 
  Estamos à disposição para esclarecer eventuais dúvidas. 
  
  Atenciosamente,
  StarDancers.
  
  (Em caso de pagamento por transferência multibanco é obrigatório o comprovativo para assim a situação ficar como regularizada)
  `;

  if (dryRun) {
    console.log(`[DRY RUN] Simulação de SMS para ${phoneNumber} - ${parentName}`);
    return;
  }

  const accountSid = process.env.SMS_ACCOUNT_ID;
  const authToken = process.env.SMS_AUTH_TOKEN;
  const client = new Twilio.Twilio(accountSid, authToken);

  client.messages.create({
    body: text,
    messagingServiceSid: 'MG23ac2229bf53017625d9c3d9e095b47c',
    to: phoneNumber
  }, function (error, message) {
    if (error) {
      errorContacts.push(`${phoneNumber}(${parentName})`);
      console.log(`There is an error with ${phoneNumber}(${parentName}).`);
      console.log(`${error}, ${message}`);
    }
  });

  console.log(`enviou mensagem para ${phoneNumber} - ${parentName}`);
}

function sendEmail(parents) {
  console.log("");
  console.log("⚡ SMS Sent - ", parents.length);
  console.log("⚡ Done for today - ", new Date());

  request({
    url: "http://api.davdsm.pt:8030/sendMail",
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "davdsmKey": 'd41d8cd98f00b204e9800998ecf8427e'
    },
    body: JSON.stringify({
      sender: "⭐ StarDancers",
      receiver: {
        email: debug ? "samuel_david_8@hotmail.com" : "stardancers2017@gmail.com",
        name: "Admnistradora Ana"
      },
      subject: `✈️ (${parents.length}) SMS Enviados`,
      message: `<h3>Olá Ana</h3><p>Este mês saíram ${parents.length} mensagens, segue a lista de pais que receberam o aviso de não pagamento:<br/> ${parents.map(parent => `${parent} <br/>`)}</p>Contactos com erro: ${errorContacts.map(contact => `${contact} <br/>`)}<br/><br/><br/>Obrigada.<br/><b>Star Dancers App</b>`
    })
  }, function (error, response, body) {
    console.log("✈️ Email Enviado? - ", response.body);
    console.log("---------------------------------------------------\n");
  });
}

const day1st = "00 01 00 1 * *";
nodeCron.schedule(day1st, async () => {
  // await resetJobs();
  console.log("👪 Everyone Reseted");
});

const sleepTest = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// melhoria de código teste
async function processStudent(student, i) {
  try {
    if (!student.attributes.Paid) {
      let phoneNumber = student.attributes.ParentContact;

      if (phoneNumber.indexOf("+") === -1) {
        phoneNumber = "+351" + phoneNumber;
      }

      if (!parents.includes(student.attributes.ParentName)) {
        parents.push(student.attributes.ParentName);
        console.log(`-- ${phoneNumber} ${student.attributes.ParentName} -- index: ${i} --`);
        await sleepTest(5000);

        // Apenas para teste - pode ser removido
        if (i === 1) {
          throw new Error("Erro de teste na iteração 1");
        }

        // Descomente para enviar SMS real
        // await sendSMS(phoneNumber, student.attributes.ParentName);
      }
    }
  } catch (err) {
    const studentPhone = student.attributes?.ParentContact || "unknown";
    const studentName = student.attributes?.ParentName || "unknown";
    errorContacts.push(`${studentPhone}(${studentName})`);
    console.error(`Erro ao processar ${studentPhone}(${studentName}):`, err.message);
  }
}

let pageCount = 1;

const goThroughUsers = async (page) => {
  console.log(`-- starting --`);
  const metaStudents = await getStudents(page);
  const students = debug ? debugContacts : metaStudents.data;

  // Substituído setInterval por loop assíncrono
  for (let i = 0; i < students.length; i++) {
    await processStudent(students[i], i);
    await sleepTest(5000);
  }

  // Quando terminar esta página, verifica se há próxima
  if (!debug && metaStudents.meta.pagination.pageCount !== metaStudents.meta.pagination.page) {
    pageCount += 1;
    await goThroughUsers(pageCount);
  } else {
    // sendEmail(parents);
    console.log(`-- finish --\n`);
  }
};

console.log("🐬 Everyone will be set as Not Paid at day 1st every month.");
console.log("🐬 Not Paid students will receive a sms text day 8 every month.\n");

nodeCron.schedule("01 00 18 8 * *", async () => {
  errorContacts = [];
  parents.length = 0;
  pageCount = 1;
  goThroughUsers(1);
});

// Se este arquivo for executado diretamente via `node sms.js`
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  errorContacts = [];
  parents.length = 0;
  pageCount = 1;
  goThroughUsers(1);
}
