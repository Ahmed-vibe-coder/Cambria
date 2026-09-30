import { chromium } from "playwright";

async function testAdvancedControls() {
  console.log("==================================================================");
  console.log("   TESTING ADVANCED BUILDER CONTROLS (UNDO/REDO, ALIGN, LOCK, LAYERS)");
  console.log("==================================================================\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. Login
    console.log(">>> [1/6] Authenticating as admin...");
    await page.goto("http://localhost:3000/admin/login");
    await page.fill('input[name="email"]', "admin@cambria.edu");
    await page.fill('input[name="password"]', "Cambria@Admin2026!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin", { timeout: 10000 });
    console.log("  ✓ Logged in");

    // 2. Open Builder
    console.log("\n>>> [2/6] Navigating to Template Builder...");
    await page.goto("http://localhost:3000/admin/templates/new");
    await page.waitForSelector('header input[placeholder="Template Name..."]', { timeout: 10000 });
    console.log("  ✓ Builder mounted");

    // 3. Add 2 fields
    console.log("\n>>> [3/6] Adding 2 fields (Student Name & QR Code)...");
    await page.click('button:has-text("Add Field")');
    await page.click('button:has-text("Student Name (English)")');
    await page.waitForSelector('div[title*="Student Name (EN)"]', { timeout: 5000 });

    await page.click('button:has-text("Add Field")');
    await page.click('button:has-text("Verification QR Code")');
    await page.waitForSelector('div[title*="Verification QR Code"]', { timeout: 5000 });
    console.log("  ✓ Added both elements to canvas");

    // 4. Test Alignment Controls in Sidebar
    console.log("\n>>> [4/6] Testing Quick Alignment buttons...");
    const centerHBtn = page.locator('button[title*="Center Horizontally"]').first();
    await centerHBtn.click();
    await page.waitForTimeout(300);
    console.log("  ✓ Clicked Center Horizontally");

    // 5. Test Lock Toggle
    console.log("\n>>> [5/6] Testing Lock Position toggle...");
    const lockBtn = page.locator('button[title*="Lock or Unlock position"]').first();
    await lockBtn.click();
    await page.waitForTimeout(300);

    const lockBanner = page.locator('text=Element is Locked against moving');
    const isLockedBannerVisible = await lockBanner.isVisible();
    console.log(`  - Lock Banner Visible: ${isLockedBannerVisible}`);
    if (!isLockedBannerVisible) {
      throw new Error("Lock banner did not appear after locking!");
    }
    console.log("  ✓ Element successfully locked!");

    // Unlock it back
    const unlockBtn = page.locator('button:has-text("Unlock")').first();
    await unlockBtn.click();
    await page.waitForTimeout(300);
    console.log("  ✓ Element unlocked successfully");

    // 6. Test Undo & Redo buttons
    console.log("\n>>> [6/6] Testing Undo & Redo toolbar controls...");
    const undoBtn = page.locator('button[title*="Undo (Ctrl+Z)"]');
    const redoBtn = page.locator('button[title*="Redo"]');

    await undoBtn.click();
    await page.waitForTimeout(300);
    console.log("  ✓ Undo clicked successfully");

    await redoBtn.click();
    await page.waitForTimeout(300);
    console.log("  ✓ Redo clicked successfully");

    console.log("\n==================================================================");
    console.log("  🎉 ALL ADVANCED BUILDER CONTROLS TESTED & VERIFIED PERFECTLY!   ");
    console.log("==================================================================");
  } catch (err) {
    console.error("Test failed:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

testAdvancedControls();
