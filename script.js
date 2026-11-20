document.getElementById('year').textContent = new Date().getFullYear();

const copyButton = document.getElementById('copy-email');
const copyLabel = document.getElementById('copy-email-label');
const copyFeedback = document.getElementById('copy-feedback');
let resetTimer;

function fallbackCopy(text) {
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
  document.body.appendChild(input);
  input.focus();
  input.select();
  input.setSelectionRange(0, input.value.length);
  let success = false;
  try { success = document.execCommand('copy'); }
  finally { input.remove(); }
  return success;
}

copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  clearTimeout(resetTimer);
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
      copied = true;
    } else {
      copied = fallbackCopy(email);
    }
  } catch (error) {
    try { copied = fallbackCopy(email); } catch (_) { copied = false; }
  }
  if (copied) {
    copyLabel.textContent = 'Copied!';
    copyFeedback.textContent = '';
    copyButton.setAttribute('aria-label', 'Email address copied');
  } else {
    copyLabel.textContent = 'Copy Email';
    copyFeedback.textContent = 'Copy unavailable. Email: ' + email;
    copyButton.setAttribute('aria-label', 'Copy manually: ' + email);
  }
  resetTimer = setTimeout(() => {
    copyLabel.textContent = 'Copy Email';
    copyFeedback.textContent = '';
    copyButton.setAttribute('aria-label', 'Copy email address');
  }, 4000);
});
