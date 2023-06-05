import React, { useState } from 'react';
import { isEmpty, omit } from 'lodash';

type Form = {
  filename?: string,
  inputPath?: string,
  outputPath?: string,
};

function App() {
  const [form, setForm] = useState<Form>({});

  const handleChange = (key: string, value: any) => {
    if (isEmpty(value) && !(value instanceof File)) {
      setForm(omit(form, key));

      return;
    }

    setForm({ ...form, [key]: value });
  };

  const handleDirectoryChange = (key: string) => {
    window.appAPI.selectFolder().then((res) => {
      handleChange(key, res);
    });
  };

  const handleSubmit = () => {
    window.appAPI.runScript(form.inputPath, form.outputPath, 'test', 200, 150);
  };

  return (
    <div className="App">
      <div className="input">
        <button onClick={() => handleDirectoryChange('inputPath')}>
          Odaberi početni folder
        </button>
        <span>{form.inputPath}</span>
      </div>
      <div className="input">
        <button onClick={() => handleDirectoryChange('outputPath')}>
          Odaberi lokaciju za spremanje
        </button>
        <span>{form.outputPath}</span>
      </div>
      <label className="input">
        Ime gif-a
        <input value={form.filename || ''} onChange={(e) => handleChange('filename', e.target.value)} />
      </label>
      <button onClick={handleSubmit}>
        Pokreni
      </button>
    </div>
  );
}

export default App;
