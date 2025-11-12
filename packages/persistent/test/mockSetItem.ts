export function mockSetItem(key: string, newValue: string | null, storageArea = localStorage) {
  const oldValue = storageArea.getItem(key)

  if (newValue === null) {
    storageArea.removeItem(key)
  } else {
    storageArea.setItem(key, newValue)
  }

  window.dispatchEvent(new StorageEvent('storage', {
    storageArea,
    key,
    oldValue,
    newValue,
  }))
}
