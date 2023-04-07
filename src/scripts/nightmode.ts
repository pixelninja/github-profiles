export function nightmode(element: HTMLButtonElement) {
  element.addEventListener('click', () => document.body.classList.toggle('-dark'));
}
