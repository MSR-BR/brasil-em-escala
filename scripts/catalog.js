const controls = document.querySelector('.catalog-controls');
if (controls) {
  const input = document.querySelector('#story-search');
  const category = document.querySelector('#story-category');
  const cards = [...document.querySelectorAll('#catalog-list .story-card')];
  const status = document.querySelector('#search-status');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

  const filter = () => {
    const query = normalize(input.value.trim());
    let visible = 0;
    for (const card of cards) {
      const matchesCategory = !category.value || card.dataset.category === category.value;
      const matchesText = !query || normalize(card.textContent).includes(query);
      card.hidden = !(matchesCategory && matchesText);
      if (!card.hidden) visible++;
    }
    status.textContent = `${visible} ${visible === 1 ? 'história' : 'histórias'} ${query ? `para “${input.value.trim()}”` : 'no catálogo'}`;
  };

  input.addEventListener('input', filter);
  category.addEventListener('change', filter);
  filter();
}
