const downloadText = (fileName: string, content: string): void => {
  const a = document.createElement('a');
  const blob = new window.Blob([content]);
  a.href = window.URL.createObjectURL(blob);
  a.setAttribute('download', `${fileName}`);
  console.log(a);
  if (window['chrome']) a.click();
  else {
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);S
  }
};

export default downloadText;