// ref: https://github.com/mdn/pwa-examples
import {writeLog} from '../Debug';

const initPWA = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('serviceWorker.js')
      .then(() => {
        writeLog('Service Worker Registered');
      });
  }

  const addBtn = document.querySelector('.add-pwa-button').style.display = 'none';
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    addBtn.style.display = 'block';

    addBtn.addEventListener('click', (e) => {
      // hide our user interface that shows our A2HS button
      addBtn.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        writeLog(`User ${choiceResult.outcome === 'accepted' ? 'accepted' : 'dismissed'} the A2HS prompt`);

        deferredPrompt = null;
      });
    });
  });
};

export default initPWA;