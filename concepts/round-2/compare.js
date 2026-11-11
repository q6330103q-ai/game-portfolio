(() => {
  'use strict';
  const names = { a: 'A · 에디토리얼', b: 'B · 플레이 스크린', c: 'C · 게임 포스터', d: 'D · 크리에이터 노트' };
  const dialog = document.querySelector('#previewDialog');
  const image = document.querySelector('#largePreview');
  let mode = 'desktop';
  let opener = null;
  function setMode(next) {
    mode = next;
    document.body.dataset.previewMode = mode;
    const label = mode === 'desktop' ? 'PC' : '모바일';
    for (const button of document.querySelectorAll('[data-mode]')) {
      button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
    }
    for (const button of document.querySelectorAll('[data-preview]')) {
      const id = button.dataset.preview;
      const preview = button.querySelector('img');
      preview.src = `previews/${id}-${mode}.webp`;
      preview.alt = `${names[id]} 시안의 실제 ${label} 화면`;
      preview.width = mode === 'desktop' ? 1440 : 390;
      preview.height = mode === 'desktop' ? 1000 : 844;
      button.setAttribute('aria-label', `${names[id]} ${label} 화면 크게 보기`);
    }
  }
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
  document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    const id = button.dataset.preview;
    document.querySelector('#previewTitle').textContent = `${names[id]} · ${mode === 'desktop' ? 'PC' : '모바일'}`;
    document.querySelector('#previewLink').href = `${id}/`;
    image.src = button.querySelector('img').src;
    image.alt = button.querySelector('img').alt;
    dialog.dataset.mode = mode;
    dialog.showModal();
  }));
  document.querySelector('#closePreview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  });
})();
