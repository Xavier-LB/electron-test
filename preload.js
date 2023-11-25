const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  ipcRenderer.on('app-version', (event, arg) => {
    replaceText('app-version', arg);
  });

  ipcRenderer.on('update-available', (event, arg) => {
    replaceText('update-available', 'Yes (' + arg.version + ')');
    console.log("update-available", arg);
  });

  ipcRenderer.on('update-not-available', (event, arg) => {
    replaceText('update-available', 'No');
    console.log("update-not-available", arg);
  });

  ipcRenderer.on('update-downloaded', (event, arg) => {
    let percent = (arg.percent == 100 || arg.tag) ? 'Done' : Math.trunc(arg.percent) + ' %';

    replaceText('update-downloaded', percent);
    console.log("update-downloaded", arg);
  });

  ipcRenderer.on('error-update', (event, arg) => {
    replaceText('error-update', arg);
    console.log("error-update:", arg);
  });


  const updateButton = document.getElementById('update-button');

  // Add a click event listener to the update button\
  if (updateButton)
    updateButton.addEventListener('click', () => {
      // Send a message to the main process to check for updates
      ipcRenderer.send('run-update');
      console.log('Run update');
    });
})
