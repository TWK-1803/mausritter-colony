export function copyToClipboard (text) {
  // The Clipboard API requires a secure context (HTTPS)
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'absolute'
  textArea.style.opacity = 0
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  return new Promise((resolve, reject) => {
    document.execCommand('copy') ? resolve() : reject(new Error('Copy failed'))
    textArea.remove()
  })
}
