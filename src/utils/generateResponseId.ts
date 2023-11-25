let responseCounter = 0;

export function generateResponseId() {
  return (responseCounter++).toString();
}
