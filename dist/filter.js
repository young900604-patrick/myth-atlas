const filters = document.querySelector('#filters');
filters.hidden = false;
filters.addEventListener('click', event => {
  const chosen = event.target.closest('button');
  if (!chosen) return;
  for (const button of filters.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button === chosen));
  }
  for (const card of document.querySelectorAll('.card')) {
    card.hidden = chosen.textContent !== '全部' && card.dataset.group !== chosen.textContent;
  }
});
