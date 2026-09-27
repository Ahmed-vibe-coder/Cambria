async function testEphemeralPersistence() {
  const LIVE_URL = "https://cambria-five.vercel.app";
  console.log("Testing ephemeral persistence on:", LIVE_URL);

  const testId = `audit-test-${Date.now()}`;
  console.log(`\nStep 1: Creating template with code ${testId}...`);

  const createRes = await fetch(`${LIVE_URL}/api/templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: testId,
      name: "Ephemeral Test Template",
      template_kind: "certificate",
      width: 1000,
      height: 800,
    }),
  });

  const createJson = await createRes.json();
  console.log(`Create Status: ${createRes.status}`);
  console.log(`Created Template ID: ${createJson.template?.id}`);

  console.log(`\nStep 2: Immediately fetching GET /api/templates...`);
  const getRes1 = await fetch(`${LIVE_URL}/api/templates`, { cache: "no-store" });
  const templates1 = await getRes1.json();
  const found1 = Array.isArray(templates1) && templates1.some((t: any) => t.code === testId);
  console.log(`Found in immediate GET? ${found1} (Total templates in response: ${templates1?.length})`);

  console.log(`\nStep 3: Waiting 5 seconds and fetching GET /api/templates with cache-busting headers from a different simulated client...`);
  await new Promise((r) => setTimeout(r, 5000));

  const getRes2 = await fetch(`${LIVE_URL}/api/templates?cb=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "User-Agent": "Cambria-Verifier-2/1.0",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache",
    },
  });
  const templates2 = await getRes2.json();
  const found2 = Array.isArray(templates2) && templates2.some((t: any) => t.code === testId);
  console.log(`Found in second GET? ${found2} (Total templates in response: ${templates2?.length})`);
  
  console.log(`\nListing all codes returned in second GET:`);
  if (Array.isArray(templates2)) {
    console.log(templates2.map((t: any) => `${t.code} (${t.name})`));
  } else {
    console.log(templates2);
  }
}

testEphemeralPersistence().catch(console.error);
