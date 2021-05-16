const copyText = (str: string): void => {
  const textarea = document.createElement('textarea') as HTMLTextAreaElement;
  textarea.style.position = 'fixed';
  textarea.style.zIndex = '-1';
  document.body.appendChild(textarea);
  textarea.value = str;
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

export default copyText;
