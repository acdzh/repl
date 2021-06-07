export type readFilePropsType = {
  accept?: string;
}

const readFile = ({
  accept = '.txt',
}: readFilePropsType): Promise<string | null> => new Promise((resolve, reject) => {
  const inputEle = document.createElement('input');
  inputEle.type = 'file';
  inputEle.accept = accept;

  const handleFileReader = (event: any) => {
    try {
      const file = event.target?.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        resolve(content);
      };
      reader.readAsText(file);
    } catch (err) {
      reject(err);
    }
  };

  inputEle.onchange = handleFileReader;
  inputEle.click();
});

export default readFile;
