const updateAvailable = document.getElementById('update-available')
const updateDownloaded = document.getElementById('update-downloaded')
const errorUpdate = document.getElementById('error-update')
const updateButton = document.getElementById('update-button')

if (updateAvailable) updateAvailable.innerText = '...'
if (updateDownloaded) updateDownloaded.innerText = '...'
if (errorUpdate) errorUpdate.innerText = "No"
