async function copyLink(url) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }
  const field = document.createElement('textarea');
  field.value = url;
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  if (!copied) throw new Error('cópia indisponível');
}

document.querySelectorAll('[data-share], [data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const status = button.closest('.story-aside')?.querySelector('.share-status');
    const url = button.dataset.url;
    try {
      if (button.hasAttribute('data-share') && navigator.share) {
        await navigator.share({ title: button.dataset.title, url });
        if (status) status.textContent = 'Compartilhamento aberto.';
      } else {
        await copyLink(url);
        if (status) status.textContent = 'Link copiado.';
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
      if (status) status.textContent = 'Não foi possível copiar. Selecione o endereço na barra do navegador.';
    }
  });
});
