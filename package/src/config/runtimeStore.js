let CONFIG = null

export async function loadRuntimeConfig() {
    const res = await fetch(`/config.json?ts=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Failed to load config.json (${res.status})`)
    const json = await res.json()

    // Detect env from vite
    let env = __APP_ENV__
    if (env === 'development') env = 'local'
    if (env === 'production') env = 'prod'
    if (env === 'staging') env = 'staging'

    const envConfig = json[env]
    if (!envConfig || !envConfig.apiBaseUrl) {
        throw new Error(`config.json missing "apiBaseUrl" for env: ${env}`)
    }

    CONFIG = {
        apiBaseUrl: envConfig.apiBaseUrl,
        sentryDsn: envConfig.sentryDsn || '',
        featureFlags: envConfig.featureFlags || {}
    }
    return CONFIG
}

export function getRuntimeConfig() {
    if (!CONFIG) throw new Error('Runtime config not loaded yet')
    return CONFIG
}
