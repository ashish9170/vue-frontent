export async function loadConfig() {
    const response = await fetch('/config.json');
    const allConfigs = await response.json();

    // Detect env
    let env = __APP_ENV__; // from vite.config.js
    if (env === 'development') env = 'local';
    if (env === 'production') env = 'prod';
    if (env === 'staging') env = 'staging';

    return allConfigs[env] || allConfigs.local;
}
