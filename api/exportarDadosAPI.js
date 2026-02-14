const fs = require("fs");
const path = require("path");

// --- CONFIGURAÇÃO ---
const API_URL = "http://localhost:8080";
const USER_EMAIL = "f@g.co"; // SUBSTITUA pelo seu email de login
const USER_SENHA = "123"; // SUBSTITUA pela sua senha

// Lista de endpoints baseada nas pastas do seu projeto
const RECURSOS = [
  "companhias", // src/companhias
  "passagem", // src/passagem
  "promocoes", // src/promocoes
  "users", // src/users
  "depoimentos", // src/depoimentos
  "estados", // src/estados
];

async function exportarDados() {
  console.log("🔄 A iniciar processo de exportação...");

  try {
    // 1. AUTENTICAÇÃO
    console.log(`🔑 A autenticar como ${USER_EMAIL}...`);
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: USER_EMAIL,
        senha: USER_SENHA,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Falha no login: ${loginResponse.statusText}`);
    }

    const authData = await loginResponse.json();
    const token = authData.access_token; // O token JWT retornado
    console.log("✅ Login efetuado com sucesso!");

    // 2. EXPORTAÇÃO DOS DADOS
    if (!fs.existsSync("exportacao")) {
      fs.mkdirSync("exportacao"); // Cria pasta para os arquivos
    }

    for (const recurso of RECURSOS) {
      console.log(`📦 A exportar: ${recurso}...`);

      const response = await fetch(`${API_URL}/${recurso}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const dados = await response.json();
        const caminhoFicheiro = path.join("exportacao", `${recurso}.json`);

        fs.writeFileSync(caminhoFicheiro, JSON.stringify(dados, null, 2));
        console.log(`   -> Guardado em: ${caminhoFicheiro}`);
      } else {
        console.warn(
          `   ⚠️ Erro ao exportar ${recurso}: ${response.status} - ${response.statusText}`,
        );
      }
    }

    console.log('✨ Processo concluído! Verifique a pasta "exportacao".');
  } catch (erro) {
    console.error("❌ Erro fatal:", erro.message);
  }
}

exportarDados();
