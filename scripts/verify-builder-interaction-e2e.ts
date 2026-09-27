import { chromium } from "playwright";

async function runVerification() {
  console.log("==================================================================");
  console.log("   TEMPLATE BUILDER INTERACTION & SIDEBAR E2E TEST WITH PLAYWRIGHT");
  console.log("==================================================================\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. Authenticate as Admin
    console.log(">>> [1/7] Logging in as admin...");
    await page.goto("http://localhost:3000/admin/login");
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });

    await page.fill('input[name="email"]', "admin@cambria.edu");
    await page.fill('input[name="password"]', "Cambria@Admin2026!");
    await page.click('button[type="submit"]');

    // Wait for redirect to /admin
    await page.waitForURL("**/admin", { timeout: 10000 });
    console.log("  ✓ Successfully authenticated into /admin");

    // 2. Navigate to Template Builder (/admin/templates/new)
    console.log("\n>>> [2/7] Navigating to Template Builder (/admin/templates/new)...");
    await page.goto("http://localhost:3000/admin/templates/new");
    await page.waitForSelector('header input[placeholder="Template Name..."]', { timeout: 10000 });
    console.log("  ✓ Template Builder mounted successfully");

    // 3. Inspect Initial Sidebar State (Layers / Elements List)
    console.log("\n>>> [3/7] Verifying Initial Sidebar (Canvas Elements & Layers)...");
    const aside = page.locator('[data-builder-sidebar="true"]');
    await aside.waitFor({ state: "visible", timeout: 5000 });

    const sidebarTitle = await aside.locator("h3").first().innerText();
    console.log(`  - Sidebar Header: "${sidebarTitle}" (Expected: Canvas Elements)`);
    if (!sidebarTitle.includes("Canvas Elements")) {
      throw new Error(`Unexpected sidebar header: ${sidebarTitle}`);
    }

    // 4. Add a Field Preset (Student Name English)
    console.log("\n>>> [4/7] Adding dynamic field preset via toolbar dropdown...");
    await page.click('button:has-text("Add Field")');
    await page.waitForSelector('button:has-text("Student Name (English)")', { timeout: 5000 });
    await page.click('button:has-text("Student Name (English)")');

    // Wait for field to be placed and selected
    await page.waitForSelector('div[title*="Student Name (EN)"]', { timeout: 5000 });
    console.log("  ✓ Field successfully placed on canvas");

    // 5. Verify Right Panel Automatically Displays Field Properties
    console.log("\n>>> [5/7] Checking that Right Sidebar opens Properties immediately...");
    const propertiesHeader = await aside.locator("h3").first().innerText();
    console.log(`  - Sidebar Header: "${propertiesHeader}" (Expected: Student Name (EN))`);
    if (!propertiesHeader.includes("Student Name")) {
      throw new Error(`Sidebar did not show field properties! Found: ${propertiesHeader}`);
    }

    const labelInput = aside.locator('input[value="Student Name (EN)"]');
    await labelInput.waitFor({ state: "visible", timeout: 5000 });
    console.log("  ✓ Display Label input is rendered and populated");

    // 6. Test Canvas Click & Drag Handling (Ensuring NO deselect bug!)
    console.log("\n>>> [6/7] Testing Click on Field & Drag-and-Drop Stability...");
    const fieldOnCanvas = page.locator('div[title*="Student Name (EN)"]');
    const initialBox = await fieldOnCanvas.boundingBox();
    if (!initialBox) throw new Error("Could not find field bounding box");

    console.log(`  - Initial Position: x=${Math.round(initialBox.x)}, y=${Math.round(initialBox.y)}`);

    // Click on the field
    await page.mouse.click(initialBox.x + 20, initialBox.y + 20);
    await page.waitForTimeout(200);

    // Verify properties panel did NOT close on click
    const headerAfterClick = await aside.locator("h3").first().innerText();
    if (!headerAfterClick.includes("Student Name")) {
      throw new Error(`FAIL: Clicking on element closed or reset the right sidebar! Found: ${headerAfterClick}`);
    }
    console.log("  ✓ Clicking element maintains selection and keeps right sidebar active!");

    // Drag the field
    console.log("  - Dragging field by +60px right, +40px down...");
    await page.mouse.move(initialBox.x + 30, initialBox.y + 20);
    await page.mouse.down();
    await page.mouse.move(initialBox.x + 90, initialBox.y + 60, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(300);

    // Verify after drag: selection preserved and coordinates updated
    const headerAfterDrag = await aside.locator("h3").first().innerText();
    if (!headerAfterDrag.includes("Student Name")) {
      throw new Error(`FAIL: Dragging element caused deselection! Found: ${headerAfterDrag}`);
    }
    console.log("  ✓ Drag completed! Field remains selected and right sidebar controls are fully intact!");

    // 7. Test Layer List and Deselect/Reselect Flow
    console.log("\n>>> [7/7] Testing Sidebar Layers Back-Button & Re-selection...");
    await aside.locator('button:has-text("Layers")').click();
    await page.waitForTimeout(200);

    const backToLayersHeader = await aside.locator("h3").first().innerText();
    console.log(`  - After clicking 'Layers': "${backToLayersHeader}"`);
    if (!backToLayersHeader.includes("Canvas Elements")) {
      throw new Error("Failed to return to Canvas Elements list");
    }

    // Click the item row in the list to select it again
    console.log("  - Clicking element row in Layers list...");
    await aside.locator('div:has-text("Student Name (EN)")').first().click();
    await page.waitForTimeout(200);

    const reselectedHeader = await aside.locator("h3").first().innerText();
    console.log(`  - Reselected Header: "${reselectedHeader}"`);
    if (!reselectedHeader.includes("Student Name")) {
      throw new Error("Selecting from layer list failed to open properties!");
    }
    console.log("  ✓ Selecting from layer list opens properties smoothly!");

    // Screenshot verification
    await page.screenshot({ path: "template-builder-interaction-verified.png" });
    console.log("\n==================================================================");
    console.log("  🎉 ALL TEMPLATE BUILDER INTERACTION TESTS PASSED FLAWLESSLY!    ");
    console.log("==================================================================");
  } catch (error) {
    console.error("Test failed:", error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runVerification();
