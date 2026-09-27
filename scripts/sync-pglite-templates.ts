import { PGlite } from "@electric-sql/pglite";
import path from "path";
import { FALLBACK_TEMPLATES } from "../src/lib/fallback-data";

async function syncTemplates() {
  console.log("🔄 Syncing all 5 real Cloudinary templates into local PGlite...");
  const dbDir = path.resolve(process.cwd(), "data/postgres");
  const db = new PGlite(dbDir);

  for (const t of FALLBACK_TEMPLATES) {
    console.log(`  -> Upserting template [${t.id}] ${t.name}...`);
    await db.query(
      `
      INSERT INTO templates (id, code, name, template_kind, width, height, background_image_url, layout_schema, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        code = EXCLUDED.code,
        name = EXCLUDED.name,
        template_kind = EXCLUDED.template_kind,
        width = EXCLUDED.width,
        height = EXCLUDED.height,
        background_image_url = EXCLUDED.background_image_url,
        layout_schema = EXCLUDED.layout_schema,
        is_active = EXCLUDED.is_active,
        updated_at = EXCLUDED.updated_at;
    `,
      [
        t.id,
        t.code,
        t.name,
        t.template_kind,
        t.width,
        t.height,
        t.background_image_url || null,
        JSON.stringify(t.layout_schema),
        t.is_active,
        t.created_at,
        new Date().toISOString(),
      ]
    );
  }

  const res = await db.query("SELECT id, name, template_kind, width, height, is_active FROM templates ORDER BY created_at ASC;");
  console.log(`✅ Successfully synced ${res.rows.length} templates in PGlite:`);
  res.rows.forEach((r: any) => console.log(`   * [${r.id}] ${r.name} (${r.template_kind}) - ${r.width}x${r.height}`));
}

syncTemplates().catch(console.error);
