// split-stimulus.js
import { DOMParser, XMLSerializer } from 'xmldom';

export function splitStimulus(xmlContent) {
  // Parse the XML content
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'text/xml');

  // Find the <choiceInteraction> containing "~~~"
  const choiceInteractions = doc.getElementsByTagName('choiceInteraction');
  let targetChoiceInteraction = null;
  for (let i = 0; i < choiceInteractions.length; i++) {
    const ci = choiceInteractions[i];
    if (ci.textContent.includes('~~~')) {
      targetChoiceInteraction = ci;
      break;
    }
  }

  if (!targetChoiceInteraction) {
    // No <choiceInteraction> with "~~~" found, return original content
    return xmlContent;
  }

  // Get the parent <div class="col-12">
  const divCol12 = targetChoiceInteraction.parentNode;
  // Get the grandparent <div class="grid-row">
  const divGridRow = divCol12.parentNode;

  // Get the child nodes of divCol12 BEFORE modifying the DOM
  const divCol12Children = Array.from(divCol12.childNodes);

  // Get the index of the targetChoiceInteraction within divCol12Children
  const index = divCol12Children.indexOf(targetChoiceInteraction);

  // Remove the targetChoiceInteraction from divCol12
  divCol12.removeChild(targetChoiceInteraction);

  // Split the content before and after the targetChoiceInteraction
  const beforeContent = divCol12Children.slice(0, index);
  const afterContent = divCol12Children.slice(index + 1);

  // Create two new <div class="col-12"> elements
  const beforeDivCol12 = doc.createElement('div');
  beforeDivCol12.setAttribute('class', 'col-12');
  beforeContent.forEach((node) => {
    beforeDivCol12.appendChild(node.cloneNode(true));
  });

  const afterDivCol12 = doc.createElement('div');
  afterDivCol12.setAttribute('class', 'col-12');
  afterContent.forEach((node) => {
    afterDivCol12.appendChild(node.cloneNode(true));
  });

  // Wrap them in <div class="grid-row">
  const beforeDivGridRow = doc.createElement('div');
  beforeDivGridRow.setAttribute('class', 'grid-row');
  beforeDivGridRow.appendChild(beforeDivCol12);

  const afterDivGridRow = doc.createElement('div');
  afterDivGridRow.setAttribute('class', 'grid-row');
  afterDivGridRow.appendChild(afterDivCol12);

  // Replace the original <div class="grid-row"> with the two new ones in <itemBody>
  const itemBody = divGridRow.parentNode;
  itemBody.replaceChild(afterDivGridRow, divGridRow);
  itemBody.insertBefore(beforeDivGridRow, afterDivGridRow);

  // Serialize the modified XML back to a string
  const serializer = new XMLSerializer();
  const modifiedXml = serializer.serializeToString(doc);

  return modifiedXml;
}
