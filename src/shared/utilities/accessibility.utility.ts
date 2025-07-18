// ***************************************************************************************
// trapFocusElements permet de tabuler sur les éléments qu'on veut focused

// ***************************************************************************************
export function trapFocusElements(
  parentElement: any,
  focusedElement: any,
  selector: string,
  shiftKey: any
) {
  // Obtenir tous les éléments focusables dans le component
  const elements = parentElement.querySelectorAll(selector);

  if (!elements.length) {
    return;
  }

  // Trouver l'index de l'élément focusé dans la liste des boutons
  const currentIndex = Array.prototype.indexOf.call(elements, focusedElement);

  let nextIndex;

  if (shiftKey) {
    nextIndex = (currentIndex - 1) % elements.length;

    if (nextIndex === -1) {
      nextIndex = elements.length - 1;
    }
  } else {
    nextIndex = (currentIndex + 1) % elements.length;
  }

  var nextButton: any = elements[nextIndex];
  if (nextButton) {
    nextButton.focus();
  }
}
