if ('serviceWorker' in  navigator){
    window.addEventListener('load', async () => {
      navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('Registered', reg);
      }).catch(err => {
        console.log('Registration failed', err);
      })
    });
  }

let deferredPrompt;
const btnAdd = document.getElementById("btnAdd");  
//btnAdd.style.display = 'none';

window.addEventListener('beforeinstallprompt', event =>{
    console.log('Before Install Prompt');
    event.preventDefault();
    deferredPrompt = event;
    btnAdd.style.display = 'block';
});
btnAdd.addEventListener('click', event =>{
    btnAdd.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) =>{
        if (choiceResult.outcome === 'accepted'){
            console.log('User accepted a2hs prompt');
        } else {
            console.log('User dismissed a2hs prompt');
        }
        deferredPrompt = null;
    });
});