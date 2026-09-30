async function runTests() {
  console.log("=== Iniciando Testes da Fase 2 ===");

  console.log("\n1. Testando POST /api/leads");
  try {
    const res = await fetch("http://localhost:3000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: "Lead Teste",
        email: "teste@example.com",
        telefone: "11999999999",
        interesse: "Sistemas Prontos",
        origem: "Teste Script",
        honeypot: ""
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (e) {
    console.error("Erro no teste /api/leads:", e);
  }

  console.log("\n2. Testando POST /api/track");
  try {
    const res = await fetch("http://localhost:3000/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alvo: "botao_whatsapp",
        tipo: "whatsapp",
        pagina: "/",
        utm_source: "instagram"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (e) {
    console.error("Erro no teste /api/track:", e);
  }

  console.log("\n3. Testando POST /api/waitlist");
  try {
    const res = await fetch("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectSlug: "sitegenclone",
        email: "teste@example.com",
        nome: "Lead Teste"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (e) {
    console.error("Erro no teste /api/waitlist:", e);
  }
}

runTests();
