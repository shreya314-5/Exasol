import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function runWalkthrough() {
  console.log('=== VoiceShield AI Video Walkthrough Recorder ===');
  
  const videoDir = path.resolve('./recordings');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  // Clear previous test recordings
  const existingFiles = fs.readdirSync(videoDir);
  for (const f of existingFiles) {
    if (f.endsWith('.webm') || f.endsWith('.mp4')) {
      try { fs.unlinkSync(path.join(videoDir, f)); } catch {}
    }
  }

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  console.log('1. Navigating to VoiceShield AI (http://localhost:5173)...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // -------------------------------------------------------------
  // SCENE 1: LIVE CALL MONITOR (HERO PAGE)
  // -------------------------------------------------------------
  console.log('Scene 1: Live Call Monitor Hero Page & Production Hooks...');
  
  // Expand production TODO hooks banner
  const todoButton = page.locator('button:has-text("View Production TODO Hooks")');
  if (await todoButton.isVisible()) {
    await todoButton.click();
    await page.waitForTimeout(3000); // show AASIST ONNX hook & ECAPA-TDNN hook
    await page.locator('button:has-text("Hide Model Architecture & Hooks")').click();
    await page.waitForTimeout(1000);
  }

  // View Switcher (Waveform vs Spectrogram vs Split)
  console.log('Inspecting Waveform & Spectrogram canvas...');
  await page.waitForTimeout(2000);
  await page.locator('button:has-text("Waveform")').click();
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Spectrogram")').click();
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Split View")').click();
  await page.waitForTimeout(2000);

  // Demo Scenarios Driving Live Data
  console.log('Triggering Demo Scenarios...');
  // (a) Genuine customer call
  await page.locator('button:has-text("(a) Genuine Customer Call")').click();
  await page.waitForTimeout(3500);

  // (c) Cloned govt official in Tamil
  await page.locator('button:has-text("(c) Cloned Govt Official")').click();
  await page.waitForTimeout(3500);

  // (d) Voice conversion drift attack
  await page.locator('button:has-text("(d) Voice-Conversion Drift")').click();
  await page.waitForTimeout(4000);

  // (b) CEO-Fraud Wire Transfer
  await page.locator('button:has-text("(b) CEO-Fraud Wire Transfer")').click();
  await page.waitForTimeout(2500);

  // Action Bar actions
  console.log('Executing Incident Response Actions...');
  await page.locator('button:has-text("Pre-Tx Warning")').click();
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Request Callback")').click();
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Trigger MFA")').click();
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Hold Transaction")').click();
  await page.waitForTimeout(2500);

  // -------------------------------------------------------------
  // SCENE 2: AGENT DESKTOP VIEW
  // -------------------------------------------------------------
  console.log('Scene 2: Agent Desktop View & Multi-Channel Alert Previews...');
  await page.locator('nav button:has-text("Agent Desktop")').click();
  await page.waitForTimeout(2500);

  // Switch simulated alert tabs
  await page.locator('button:has-text("Officer Email")').click();
  await page.waitForTimeout(3000);
  await page.locator('button:has-text("App Push")').click();
  await page.waitForTimeout(3000);
  await page.locator('button:has-text("Customer SMS")').click();
  await page.waitForTimeout(2500);

  // Click agent action button
  await page.locator('button:has-text("Verify by Call-Back")').click();
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Trigger MFA")').first().click();
  await page.waitForTimeout(2000);

  // -------------------------------------------------------------
  // SCENE 3: POLICY & WORKFLOW BUILDER
  // -------------------------------------------------------------
  console.log('Scene 3: Policy & Workflow Builder...');
  await page.locator('nav button:has-text("Policy & Workflows")').click();
  await page.waitForTimeout(2500);

  // Toggle rule enable/disable
  const firstRuleToggle = page.locator('button:has-text("ENABLED")').first();
  if (await firstRuleToggle.isVisible()) {
    await firstRuleToggle.click();
    await page.waitForTimeout(1500);
    await page.locator('button:has-text("DISABLED")').first().click();
    await page.waitForTimeout(1500);
  }

  // Open rule creation modal
  await page.locator('button:has-text("Create New Rule")').click();
  await page.waitForTimeout(2500);
  await page.locator('button:has-text("Cancel Creation")').click();
  await page.waitForTimeout(1000);

  // Run test simulation
  console.log('Running Policy Test Simulator...');
  await page.locator('button:has-text("Evaluate Rules")').click();
  await page.waitForTimeout(3500);

  // -------------------------------------------------------------
  // SCENE 4: FILE / BATCH ANALYZER
  // -------------------------------------------------------------
  console.log('Scene 4: File / Batch Audio Forensic Analyzer...');
  await page.locator('nav button:has-text("File / Batch Analyzer")').click();
  await page.waitForTimeout(2500);

  // Codec stress testing
  console.log('Switching simulated codecs...');
  await page.locator('button:has-text("12.65 kbps Mobile")').click();
  await page.waitForTimeout(2000);
  await page.locator('button:has-text("16 kbps Wideband")').click();
  await page.waitForTimeout(2000);
  await page.locator('button:has-text("64 kbps Narrowband")').click();
  await page.waitForTimeout(2000);

  // Inspect preloaded samples
  await page.locator('button:has-text("Genuine Customer")').first().click();
  await page.waitForTimeout(3000);
  await page.locator('button:has-text("Tamil Statutory Notice")').first().click();
  await page.waitForTimeout(3000);
  await page.locator('button:has-text("CFO Wire Request")').first().click();
  await page.waitForTimeout(2500);

  // -------------------------------------------------------------
  // SCENE 5: ENROLMENT & CONSENT PORTAL
  // -------------------------------------------------------------
  console.log('Scene 5: Biometric Enrolment & Consent Portal...');
  await page.locator('nav button:has-text("Enrolment & Consent")').click();
  await page.waitForTimeout(2500);

  // Check consent checkbox
  const consentCheckbox = page.locator('input[type="checkbox"]').first();
  await consentCheckbox.check();
  await page.waitForTimeout(1000);

  // Click record and extract voiceprint
  console.log('Recording and extracting 512-d biometric embedding...');
  await page.locator('button:has-text("Record & Extract Voiceprint")').click();
  await page.waitForTimeout(5000); // wait for 0 -> 100% extraction progress

  // Click Purge Vector to show DPDP Certified Deletion Receipt
  console.log('Demonstrating DPDP Right to Erasure...');
  const purgeBtn = page.locator('button:has-text("Purge Vector")').first();
  if (await purgeBtn.isVisible()) {
    await purgeBtn.click();
    await page.waitForTimeout(3500); // inspect receipt modal
    await page.locator('button:has-text("Acknowledge & Close")').click();
    await page.waitForTimeout(1500);
  }

  // -------------------------------------------------------------
  // SCENE 6: PRIVACY & DPDP COMPLIANCE CENTER
  // -------------------------------------------------------------
  console.log('Scene 6: Privacy & DPDP Act 2023 Compliance Center...');
  await page.locator('nav button:has-text("Privacy & DPDP Act")').click();
  await page.waitForTimeout(2500);

  // Toggle privacy switch & adjust retention slider
  const edgeToggle = page.locator('input[type="checkbox"]').first();
  if (await edgeToggle.isVisible()) {
    await edgeToggle.click();
    await page.waitForTimeout(1000);
    await edgeToggle.click();
    await page.waitForTimeout(1000);
  }

  // Filter audit trail
  const searchInput = page.locator('input[placeholder*="Search audit trail"]');
  if (await searchInput.isVisible()) {
    await searchInput.fill('CRITICAL');
    await page.waitForTimeout(2000);
    await searchInput.fill('');
    await page.waitForTimeout(1000);
  }

  // Export CSV
  await page.locator('button:has-text("Export Audit Log (CSV)")').click();
  await page.waitForTimeout(2000);

  // -------------------------------------------------------------
  // SCENE 7: INTEGRATIONS & API CONSOLE
  // -------------------------------------------------------------
  console.log('Scene 7: Integrations, API & Webhooks...');
  await page.locator('nav button:has-text("Integrations & API")').click();
  await page.waitForTimeout(2500);

  // Switch code snippet tabs
  await page.getByRole('button', { name: 'python', exact: true }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'node', exact: true }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'curl', exact: true }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'ws', exact: true }).click();
  await page.waitForTimeout(1500);

  // Copy JSON Event
  await page.locator('button:has-text("Copy JSON")').click();
  await page.waitForTimeout(1500);

  // Dispatch test webhook
  console.log('Dispatching test webhook...');
  await page.locator('button:has-text("Dispatch")').click();
  await page.waitForTimeout(3000);

  // -------------------------------------------------------------
  // SCENE 8: ANALYTICS DASHBOARD
  // -------------------------------------------------------------
  console.log('Scene 8: Enterprise Analytics Dashboard...');
  await page.locator('nav button:has-text("Analytics Dashboard")').click();
  await page.waitForTimeout(2500);

  // Switch time range filters
  await page.locator('button:has-text("Last 7 Days")').click();
  await page.waitForTimeout(2000);
  await page.locator('button:has-text("Year-to-Date")').click();
  await page.waitForTimeout(2000);
  await page.locator('button:has-text("Last 30 Days")').click();
  await page.waitForTimeout(2500);

  // Scroll down smoothly to show hourly distribution & attack patterns
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollBy({ top: -400, behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  // -------------------------------------------------------------
  // FINALE: RETURN TO LIVE CALL MONITOR FOR HERO CLOSE
  // -------------------------------------------------------------
  console.log('Finale: Return to Live Call Monitor Hero Page...');
  await page.locator('nav button:has-text("Live Call Monitor")').click();
  await page.waitForTimeout(3500);

  console.log('Closing recording session...');
  await page.close();
  await context.close();
  await browser.close();
  console.log('Browser closed. Saving video file...');

  // Find the generated webm file
  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const rawWebm = path.join(videoDir, files[0]);
    const finalWebm = path.join(videoDir, 'VoiceShield_AI_Walkthrough.webm');
    fs.copyFileSync(rawWebm, finalWebm);
    console.log(`Saved WebM video: ${finalWebm}`);

    // Convert to MP4 using installed FFmpeg
    const ffmpegPath = "C:\\Users\\shrey\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe";
    const finalMp4 = path.join(videoDir, 'VoiceShield_AI_Walkthrough.mp4');

    if (fs.existsSync(ffmpegPath)) {
      console.log(`Converting to MP4: ${finalMp4}...`);
      const { execSync } = await import('child_process');
      try {
        execSync(`"${ffmpegPath}" -y -i "${rawWebm}" -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p "${finalMp4}"`, { stdio: 'inherit' });
        console.log(`Successfully generated MP4 video: ${finalMp4}`);
      } catch (convErr) {
        console.warn('FFmpeg conversion warning:', convErr);
      }
    }
  }

  console.log('=== Walkthrough Recording Complete! ===');
}

runWalkthrough().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
