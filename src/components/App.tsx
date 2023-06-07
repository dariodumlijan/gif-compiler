import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { secondsToMilliseconds } from 'date-fns';
import { isEmpty, omit, some } from 'lodash';

type Form = {
  filename?: string,
  interval?: string,
  inputPath?: string,
  outputPath?: string,
};

function App() {
  const [form, setForm] = useState<Form>({});
  const [message, setMessage] = useState<string | null>(null);
  const isDisabled = some([
    form.inputPath,
    form.outputPath,
    form.filename,
    form.interval,
  ], isEmpty);

  useEffect(() => {
    if (!message) return;

    const intervalId = setTimeout(() => {
      setMessage(null);
    }, secondsToMilliseconds(10));

    return () => clearInterval(intervalId);
  }, [message]);

  const handleChange = (key: string, value: any) => {
    if (isEmpty(value) && !(value instanceof File)) {
      setForm(omit(form, key));

      return;
    }

    setForm({ ...form, [key]: value });
  };

  const handleDirectoryChange = (key: string) => {
    window.appAPI.selectFolder().then((res: string) => {
      handleChange(key, res);
    });
  };

  const handleSubmit = () => {
    const trueInterval = Math.abs(Number(form.interval));
    setForm({ ...form, interval: String(trueInterval) });

    window.appAPI.runScript(
      form.inputPath,
      form.outputPath,
      form.filename,
      secondsToMilliseconds(trueInterval),
      150,
    ).then((res: string) => {
      setMessage(res);
    });
  };

  return (
    <div className="App">
      <div className={classNames('message', {
        show: message,
      })}
      >
        <span>{message}</span>
      </div>
      <div className="form-wrapper">
        <div className="input finder" onClick={() => handleDirectoryChange('inputPath')}>
          <label htmlFor="inputPath">Input folder</label>
          <input
            id="inputPath"
            defaultValue={form.inputPath || ''}
            type="text"
            readOnly
            required
          />
        </div>

        <div className="input finder" onClick={() => handleDirectoryChange('outputPath')}>
          <label htmlFor="outputPath">Output folder</label>
          <input
            id="outputPath"
            defaultValue={form.outputPath || ''}
            type="text"
            readOnly
            required
          />
        </div>

        <div className="input">
          <label htmlFor="filename">Filename (&quot;{String('{{ dim }}')}&quot; will be replaced)</label>
          <input
            id="filename"
            value={form.filename || ''}
            onChange={(e) => handleChange('filename', e.target.value)}
            type="text"
            required
          />
        </div>

        <div className="input">
          <label htmlFor="interval">Frame interval (seconds)</label>
          <input
            id="interval"
            value={form.interval || ''}
            onChange={(e) => handleChange('interval', e.target.value)}
            min={0}
            step={0.1}
            type="number"
            required
          />
        </div>

        <hr />

        <button
          className="start-button"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          START
        </button>
      </div>
    </div>
  );
}

export default App;
