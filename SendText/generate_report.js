import PDFDocument from "pdfkit";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const apiToken = process.env.API_TOKEN;
const apiAddress = process.env.API_ADDRESS;
const apiUser = process.env.API_USER;
const apiPassword = process.env.API_PASSWORD;

const headers = {
  headers: {
    Authorization: `Bearer ${apiToken}`,
  },
};

const getAllStudents = async () => {
  let allStudents = [];
  let page = 1;
  let pageCount = 1;

  do {
    try {
      console.log(`Fetching page ${page}...`);
      const response = await axios.get(
        `${apiAddress}/api/students?pagination[page]=${page}&pagination[pageSize]=100`,
        headers
      );

      const { data, meta } = response.data;
      allStudents = allStudents.concat(data);
      pageCount = meta.pagination.pageCount;
      page++;
    } catch (error) {
      console.error("Error fetching students:", error);
      break;
    }
  } while (page <= pageCount);

  return allStudents;
};

const generatePDF = (students) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const result = Buffer.concat(chunks);
      resolve({ buffer: result, filename: `Relatorio_Pagamentos_${Date.now()}.pdf` });
    });

    // Also write to disk for convenience
    const stream = fs.createWriteStream("Relatorio_Pagamentos.pdf");
    doc.pipe(stream);

  // Colors - Monochrome Theme
  const black = "#000000";
  const white = "#FFFFFF";
  const darkGray = "#333333";
  const lightGray = "#f1f1f1"; // For boxes
  const veryLightGray = "#f5f5f5"; // For table stripes
  const navyBlue = "#001f3f"; // Navy Blue

  // --- Data Processing ---
  const paidStudents = students.filter((s) => s.attributes.Paid === true);
  const lateStudents = students.filter((s) => s.attributes.Paid === false);

  const totalPaidValue = paidStudents.reduce(
    (sum, s) => sum + (Number(s.attributes.Price) || 0),
    0
  );

  const paymentMethods = {};
  paidStudents.forEach((s) => {
    const method = s.attributes.PaymentMethod || "Desconhecido";
    paymentMethods[method] = (paymentMethods[method] || 0) + 1;
  });

  // --- Header ---
  doc.rect(0, 0, doc.page.width, 100).fill(navyBlue);

  doc
    .fontSize(24)
    .fillColor(white)
    .text("StarDancers Management", 50, 35, { align: "left" });

  doc
    .fontSize(10)
    .fillColor(white)
    .text("RELATÓRIO DE PAGAMENTOS", 50, 65, { align: "left" });

  doc
    .fontSize(10)
    .fillColor(white)
    .text(new Date().toLocaleDateString("pt-PT"), 50, 65, { align: "right" });

  doc.moveDown(4);

  // --- Summary Section ---
  const startY = 150; // Increased from 120 for more space after header
  const boxRadius = 10;
  const boxHeight = 100;

  // Box 1: Paid
  doc.roundedRect(50, startY, 150, boxHeight, boxRadius).fill(lightGray);
  doc
    .fillColor(black)
    .fontSize(10)
    .text("PAGARAM A TEMPO", 60, startY + 20);
  doc
    .fillColor(black)
    .fontSize(28)
    .text(paidStudents.length, 60, startY + 45);

  // Box 2: Late
  doc.roundedRect(220, startY, 150, boxHeight, boxRadius).fill(lightGray);
  doc
    .fillColor(black)
    .fontSize(10)
    .text("ATRASARAM", 230, startY + 20);
  doc
    .fillColor(black)
    .fontSize(28)
    .text(lateStudents.length, 230, startY + 45);

  // Box 3: Total Value
  doc.roundedRect(390, startY, 150, boxHeight, boxRadius).fill(lightGray);
  doc
    .fillColor(black)
    .fontSize(10)
    .text("VALOR TOTAL (PAGO)", 400, startY + 20);
  doc
    .fillColor(black)
    .fontSize(20)
    .text(`${totalPaidValue.toFixed(2)} €`, 400, startY + 50);

  doc.moveDown(6);

  // --- Payment Methods ---
  const paymentMethodY = 300; // Increased from 230 for more space after boxes
  doc
    .fillColor(black)
    .fontSize(14)
    .text("Métodos de Pagamento (Pagos)", 50, paymentMethodY);
  doc.rect(50, paymentMethodY + 15, 500, 2).fill(black);

  let methodY = paymentMethodY + 30;
  doc.fontSize(12);
  Object.entries(paymentMethods).forEach(([method, count]) => {
    doc.fillColor(black).text(method, 50, methodY);
    doc.text(count.toString(), 400, methodY, { align: "right" });
    methodY += 20;
  });

  // --- Late List ---
  doc.addPage(); // Start list on new page if needed, or just continue.
  // Actually, let's check space. But safe to just add a section.

  doc
    .fillColor(black)
    .fontSize(14)
    .text(`Lista de Atrasos (${lateStudents.length})`, 50, 50);
  doc.rect(50, 65, 500, 2).fill(black);

  let listY = 80;
  doc.fontSize(10);

  // Table Header
  doc.font("Helvetica-Bold");
  doc.text("Nome do Aluno", 50, listY);
  doc.text("Responsável", 200, listY);
  doc.text("Contacto", 350, listY);
  doc.text("Valor", 480, listY);
  doc.font("Helvetica");

  listY += 20;

  lateStudents.forEach((student) => {
    if (listY > 750) {
      doc.addPage();
      listY = 50;
      // Re-print header
      doc.font("Helvetica-Bold");
      doc.text("Nome do Aluno", 50, listY);
      doc.text("Responsável", 200, listY);
      doc.text("Contacto", 350, listY);
      doc.text("Valor", 480, listY);
      doc.font("Helvetica");
      listY += 20;
    }

    const name = student.attributes.Name || "N/A";
    const parent = student.attributes.ParentName || "N/A";
    const contact = student.attributes.ParentContact || "N/A";
    const price = student.attributes.Price
      ? `${student.attributes.Price} €`
      : "N/A";

    // Strip long names
    const shortName = name.length > 25 ? name.substring(0, 22) + "..." : name;
    const shortParent =
      parent.length > 25 ? parent.substring(0, 22) + "..." : parent;

    // Zebra striping
    if (lateStudents.indexOf(student) % 2 === 0) {
      doc.rect(50, listY - 5, 500, 15).fill(veryLightGray);
      doc.fillColor(black);
    }

    doc.text(shortName, 50, listY);
    doc.text(shortParent, 200, listY);
    doc.text(contact, 350, listY);
    doc.text(price, 480, listY);

    listY += 15;
  });

    doc.end();
  });
};

const uploadFileToStrapi = async (buffer, filename, jwtToken) => {
  try {
    const form = new FormData();
    form.append("files", buffer, {
      filename,
      contentType: "application/pdf",
    });

    const uploadUrl = `${apiAddress}/api/upload`;
    const formHeaders = form.getHeaders();

    // Use jwtToken if available, otherwise fall back to apiToken
    const token = jwtToken || apiToken;
    console.log(`Using token type: ${jwtToken ? 'JWT from login' : 'API_TOKEN from env'}`);

    const response = await axios.post(uploadUrl, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...formHeaders,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Strapi returns an array of uploaded files
    if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
      const fileObj = response.data[0];
      return fileObj.id;
    }

    throw new Error("Unexpected upload response from Strapi");
  } catch (err) {
    const status = err.response ? err.response.status : 'unknown';
    const errorMsg = err.response ? JSON.stringify(err.response.data) : err.message;
    
    if (status === 403) {
      throw new Error(`UPLOAD_FORBIDDEN: Token lacks upload permissions (${errorMsg})`);
    }
    throw err;
  }
};

const createReportEntry = async (fileId, reportName, jwtToken) => {
  try {
    const createUrl = `${apiAddress}/api/reports`;
    const payload = {
      data: {
        Name: reportName,
        File: fileId,
      },
    };

    const authHeaders = {
      headers: { Authorization: `Bearer ${jwtToken || apiToken}` },
    };

    const response = await axios.post(createUrl, payload, authHeaders);
    return response.data;
  } catch (err) {
    console.error("Error creating report entry in Strapi:", err.response ? err.response.data : err.message);
    throw err;
  }
};

const loginToStrapi = async (user, password) => {
  if (!user || !password) {
    console.error("Missing API_USER or API_PASSWORD env vars");
    return null;
  }
  try {
    const url = `${apiAddress}/api/auth/local`;
    console.log(`Attempting login with user: "${user}"`);
    const { data } = await axios.post(url, { identifier: user, password });
    console.log("Login successful, JWT obtained");
    return data.jwt;
  } catch (err) {
    const errMsg = err.response ? JSON.stringify(err.response.data) : err.message;
    console.error(`Login failed: ${errMsg}`);
    return null;
  }
};

// Helper: diagnose token status before attempting upload
const diagnoseAuth = async (jwt, apiTokenValue, viteTokenValue) => {
  console.log("\n=== AUTH DIAGNOSIS ===");
  console.log(`API_ADDRESS: ${apiAddress}`);
  console.log(`API_USER: ${apiUser || '<not set>'}`);
  console.log(`API_PASSWORD: ${apiPassword ? '***' : '<not set>'}`);
  console.log(`API_TOKEN length: ${apiTokenValue ? apiTokenValue.length : 0}`);
  console.log(`VITE_TOKEN length: ${viteTokenValue ? viteTokenValue.length : 0}`);
  console.log(`Login JWT obtained: ${jwt ? 'yes' : 'no'}`);
  console.log("");

  // Test each token
  if (jwt) {
    console.log("Testing login JWT...");
    await testToken(jwt, "Login JWT");
  }
  if (apiTokenValue) {
    console.log("Testing API_TOKEN (with Bearer)...");
    await testToken(apiTokenValue, "API_TOKEN (Bearer)");
    
    // Also test without Bearer prefix in case it's an API token expecting direct use
    console.log("Testing API_TOKEN (direct, no Bearer)...");
    try {
      const resp = await axios.get(`${apiAddress}/api/users/me?populate=role`, {
        headers: { "X-API-Token": apiTokenValue },
      });
      console.log(`API_TOKEN (direct): OK (200) — user id: ${resp.data?.id || 'unknown'}`);
    } catch (err) {
      const status = err.response ? err.response.status : 'no-response';
      console.log(`API_TOKEN (direct): failed — status: ${status}`);
    }
  }
  if (viteTokenValue) {
    console.log("Testing VITE_TOKEN...");
    await testToken(viteTokenValue, "VITE_TOKEN");
  }
  console.log("=== END DIAGNOSIS ===\n");
};

// Helper: test which token works by calling a protected endpoint
const testToken = async (token, label) => {
  if (!token) {
    console.log(`${label}: <no token>`);
    return null;
  }
  try {
    const resp = await axios.get(`${apiAddress}/api/users/me?populate=role`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`${label}: OK (200) — user id: ${resp.data?.id || 'unknown'}`);
    return { ok: true, data: resp.data };
  } catch (err) {
    const status = err.response ? err.response.status : 'no-response';
    console.log(`${label}: failed — status: ${status} — message: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
    return { ok: false, status, error: err.response ? err.response.data : err.message };
  }
};

// Try to read frontend VITE token from StarDancers/.env for comparison
let viteToken = null;
try {
  const envPath = new URL('../StarDancers/.env', import.meta.url).pathname;
  const envRaw = fs.readFileSync(envPath, 'utf8');
  const m = envRaw.match(/VITE_TOKEN\s*=\s*"?([^"]+)"?/);
  if (m) viteToken = m[1].trim();
} catch (e) {
  try {
    // fallback relative path
    const envRaw = fs.readFileSync('../StarDancers/.env', 'utf8');
    const m = envRaw.match(/VITE_TOKEN\s*=\s*"?([^"]+)"?/);
    if (m) viteToken = m[1].trim();
  } catch (e2) {
    // ignore
  }
}

export const main = async () => {
  try {
    console.log("Starting report generation...");
    const students = await getAllStudents();
    console.log(`Total students fetched: ${students.length}`);

    const { buffer, filename } = await generatePDF(students);
    console.log(`PDF generated in-memory: ${filename} (size: ${buffer.length} bytes)`);

    console.log("Logging in to Strapi to obtain JWT (using API_USER/API_PASSWORD)...");
    const jwt = await loginToStrapi(apiUser, apiPassword);
    if (!jwt) {
      console.warn("Could not obtain JWT from Strapi login.");
    } else {
      console.log("JWT obtained successfully.");
    }

    // Diagnose auth before attempting upload
    await diagnoseAuth(jwt, apiToken, viteToken);

    console.log("Uploading PDF to Strapi...");
    let fileId;
    try {
      fileId = await uploadFileToStrapi(buffer, filename, jwt);
      console.log(`Uploaded file ID: ${fileId}`);
    } catch (uploadErr) {
      if (uploadErr.message.includes("UPLOAD_FORBIDDEN")) {
        console.error("\n❌ UPLOAD FAILED - Authentication Issue");
        console.error("");
        console.error("The token provided does not have permission to upload files.");
        console.error("");
        console.error("SOLUTION: Create a new Strapi API Token with upload permissions");
        console.error("");
        console.error("Steps:");
        console.error("  1. Log into your Strapi Admin Panel: https://api.davdsm.pt/admin");
        console.error("  2. Go to Settings > API Tokens");
        console.error("  3. Click 'Create new API Token'");
        console.error("  4. Name: 'Report Upload'");
        console.error("  5. Access Level: Select 'Full Access' (or enable upload, reports CRUD)");
        console.error("  6. Click Save and copy the generated token");
        console.error("  7. Update SendText/.env, replace the API_TOKEN value:");
        console.error("     API_TOKEN=\"<paste-new-token-here>\"");
        console.error("  8. Run this script again");
        console.error("");
        process.exit(1);
      }
      throw uploadErr;
    }

    const reportName = `Relatório de Pagamentos - ${new Date().toLocaleDateString("pt-PT")}`;
    console.log("Creating Report entry in Strapi...");
    const created = await createReportEntry(fileId, reportName, jwt);
    console.log("Report created:", created);
    console.log("\n✅ Report successfully generated and uploaded to Strapi!");
  } catch (err) {
    console.error("Error in report flow:", err.message || err);
    process.exit(1);
  }
};
