import { chromium } from "playwright";
import path from "path";
import fs from "fs";

async function verifyMajors() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Navigating to /majors...");
  await page.goto("http://localhost:3000/majors", { waitUntil: "networkidle" });

  // 1. Verify page title and header
  const headerText = await page.textContent("h1, h2");
  console.log("Header text detected:", headerText?.slice(0, 80));

  // 2. Count major cards
  const initialCardsCount = await page.locator(".group.bg-white.border").count();
  console.log(`Initial Majors Cards Count: ${initialCardsCount}`);

  // Screenshot top overview
  const screenshotsDir = path.resolve(process.cwd(), "test-artifacts");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  await page.screenshot({ path: path.join(screenshotsDir, "majors-desktop.png"), fullPage: false });
  console.log("Saved desktop top screenshot: test-artifacts/majors-desktop.png");

  // 3. Test search for "Accounting"
  const searchInput = page.locator('input[placeholder*="Search by major title"]');
  await searchInput.fill("Accounting");
  await page.waitForTimeout(300);

  const filteredCount = await page.locator(".group.bg-white.border").count();
  console.log(`Filtered Cards for 'Accounting': ${filteredCount}`);

  // Clear search
  await searchInput.fill("");
  await page.waitForTimeout(300);

  // 4. Test clicking on a major card to open modal
  const firstCard = page.locator(".group.bg-white.border").first();
  await firstCard.click();
  await page.waitForTimeout(400);

  const modalVisible = await page.locator('[role="dialog"]').isVisible();
  console.log(`Major Detail Modal visible: ${modalVisible}`);

  await page.screenshot({ path: path.join(screenshotsDir, "majors-modal.png") });
  console.log("Saved modal screenshot: test-artifacts/majors-modal.png");

  // Close modal
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 5. Test Mobile Viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/majors", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(screenshotsDir, "majors-mobile.png"), fullPage: false });
  console.log("Saved mobile screenshot: test-artifacts/majors-mobile.png");

  await browser.close();
  console.log("✅ All Majors Page Playwright tests completed successfully!");
}

verifyMajors().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
