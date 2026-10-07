import fs from 'fs';
import path from 'path';
import puppeteer, { Browser } from 'puppeteer';

/**
 * Locate system-installed Chromium browsers (Edge, Chrome, Brave) on Windows, macOS, or Linux.
 */
export function findSystemBrowser(): string | undefined {
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        try {
            if (fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
                return process.env.PUPPETEER_EXECUTABLE_PATH;
            }
        } catch { }
    }

    const localAppData = process.env.LOCALAPPDATA || '';
    const programFiles = process.env.PROGRAMFILES || 'C:\\Program Files';
    const programFilesX86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)';

    const candidates = [
        // Google Chrome
        path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
        path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
        localAppData ? path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe') : '',

        // Microsoft Edge (Standard on modern Windows installations)
        path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
        path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
        localAppData ? path.join(localAppData, 'Microsoft', 'Edge', 'Application', 'msedge.exe') : '',

        // Brave
        path.join(programFiles, 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe'),
        localAppData ? path.join(localAppData, 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe') : '',

        // Linux / macOS fallbacks
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/usr/bin/google-chrome-stable',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    ].filter(Boolean);

    for (const candidate of candidates) {
        try {
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        } catch { }
    }

    return undefined;
}

export async function launchPuppeteerBrowser(): Promise<Browser> {
    const baseArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none',
        '--no-first-run',
        '--no-zygote'
    ];

    // Simplified launch: always use bundled Chromium provided by puppeteer.
    console.log('[PUPPETEER] 🚀 Launching bundled Chromium');
    return await puppeteer.launch({
        headless: true,
        args: baseArgs
    });
}
