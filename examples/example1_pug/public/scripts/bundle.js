function triggerAlert() {
  alert('Hi there!');
}

window.addEventListener('load', () => {
  const alertButton = document.querySelector('.alert-button');

  alertButton.addEventListener('click', () => triggerAlert());
});
