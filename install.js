(function () {
  const installBox = document.querySelector('#install-box');
  const installButton = document.querySelector('#install-app-button');
  const installDialog = document.querySelector('#install-dialog');
  const installInstructions = document.querySelector('#install-instructions');
  const installClose = document.querySelector('#install-close');
  let installPrompt = null;

  const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isInstalled) installBox.hidden = true;

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    installPrompt = event;
  });

  window.addEventListener('appinstalled', function () {
    installPrompt = null;
    installBox.hidden = true;
  });

  installButton.addEventListener('click', async function () {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      installPrompt = null;
      if (choice.outcome === 'accepted') installBox.hidden = true;
      return;
    }

    const isiPhoneOrIPad = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    installInstructions.innerHTML = isiPhoneOrIPad
      ? '<p>In Safari:</p><ol><li>Tap the <strong>Share</strong> button.</li><li>Tap <strong>Add to Home Screen</strong>.</li><li>Turn on <strong>Open as Web App</strong>.</li><li>Tap <strong>Add</strong>.</li></ol>'
      : '<p>Open your browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>';
    installDialog.showModal();
  });

  installClose.addEventListener('click', function () {
    installDialog.close();
  });

  installDialog.addEventListener('cancel', function (event) {
    event.preventDefault();
    installDialog.close();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js');
    });
  }
})();
