import React, { createContext, useContext, useMemo, useState } from 'react'

const SessionContext = createContext(null)

const currentMonth = new Intl.DateTimeFormat('en-IN', {
  month: 'long',
  year: 'numeric',
}).format(new Date())

export const CHW_KIT_ITEMS = [
  'ORS packets',
  'Paracetamol 500mg',
  'Iron-Folic Acid tablets',
  'Zinc tablets',
  'Oral contraceptives',
  'Condoms',
  'Rapid Diagnostic Test (malaria)',
  'Pregnancy test kit',
  'Basic thermometer',
  'Blood pressure cuff',
]

const initialInventory = Object.fromEntries(
  CHW_KIT_ITEMS.map((item) => [item, false])
)

export function SessionProvider({ children }) {
  const [district, setDistrict] = useState('')
  const [month, setMonth] = useState(currentMonth)
  const [inventory, setInventory] = useState(initialInventory)
  const [sessionStarted, setSessionStarted] = useState(false)

  const toggleInventoryItem = (item) => {
    setInventory((current) => ({
      ...current,
      [item]: !current[item],
    }))
  }

  const startSession = () => {
    if (district && month) {
      setSessionStarted(true)
    }
  }

  const value = useMemo(() => ({
    district,
    setDistrict,
    month,
    setMonth,
    inventory,
    toggleInventoryItem,
    sessionStarted,
    startSession,
  }), [district, month, inventory, sessionStarted])

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }

  return context
}
