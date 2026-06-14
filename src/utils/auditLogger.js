const AUDIT_LOG_KEY = 'asha_audit_logs'

export function getAuditLogs() {
  try {
    const storedLogs = localStorage.getItem(AUDIT_LOG_KEY)
    if (!storedLogs) return []

    const logs = JSON.parse(storedLogs)
    return Array.isArray(logs) ? logs : []
  } catch (error) {
    console.error('Audit logs could not be read:', error)
    return []
  }
}

export function saveAuditLog(data) {
  try {
    const logs = getAuditLogs()
    logs.unshift({
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs))
  } catch (error) {
    console.error('Audit log could not be saved:', error)
  }
}

export function clearAuditLogs() {
  localStorage.removeItem(AUDIT_LOG_KEY)
}
