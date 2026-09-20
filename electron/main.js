const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let backendProcess;

function startBackend() {
    const backendPath = path.join(process.resourcesPath, "backend");

    const isWin = process.platform === "win32";
    const backendExeName = isWin ? "backend.exe" : "backend";
    
    const backendExe = path.join(backendPath, backendExeName);

    console.log(`Intentando iniciar backend en: ${backendExe}`);

    backendProcess = spawn(backendExe, [], {
        cwd: backendPath,
        env: {
            ...process.env,
            ASPNETCORE_URLS: "http://localhost:7016"
        }
    });

    backendProcess.stdout.on("data", (data) => {
        console.log(`[backend] ${data}`);
    });

    backendProcess.stderr.on("data", (data) => {
        console.log(`[backend error] ${data}`);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800
    });

    win.loadURL("http://localhost:7016/logingAsk");
}

app.whenReady().then(() => {
    startBackend();

    // pequeño delay para backend
    setTimeout(() => {
        createWindow();
    }, 5000);
});

app.on("window-all-closed", () => {
    if (backendProcess) backendProcess.kill();
    app.quit();
});