import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { secondsToMilliseconds } from 'date-fns';
import { isEmpty, some } from 'lodash';
import Loading from './Loading';

type Form = {
  inputPath?: string,
  outputPath?: string,
  filename?: string,
  interval?: `${number}`,
  optimize?: boolean,
  quantize?: `${number}`,
};

function App() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState<Form>({
    optimize: false,
    quantize: '128',
  });
  const [message, setMessage] = useState<string | null>(null);
  const isDisabled = some([
    form.inputPath,
    form.outputPath,
    form.filename,
    form.interval,
  ], isEmpty);

  useEffect(() => {
    window.electron.installDeps().then((res) => {
      if (res.status === 200) {
        setLoading(false);
      } else {
        setMessage(res.message);
      }
    });
  }, []);

  useEffect(() => {
    if (!message) return;

    const intervalId = setTimeout(() => {
      setMessage(null);
    }, secondsToMilliseconds(10));

    return () => clearInterval(intervalId);
  }, [message]);

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleDirectoryChange = (key: string) => {
    window.electron.selectFolder().then((res: string) => {
      handleChange(key, res);
    });
  };

  const handleSubmit = () => {
    const trueInterval = Math.abs(Number(form.interval));
    const trueQuantize = Math.abs(Number(form.quantize));
    const finalQuantize = trueQuantize > 256 ? 256 : trueQuantize;
    setForm({
      ...form,
      interval: `${trueInterval}`,
      quantize: `${finalQuantize}`,
    });

    window.electron.runScript(
      form.inputPath as string,
      form.outputPath as string,
      form.filename as string,
      trueInterval * 100,
      form.optimize || false,
      finalQuantize,
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
      {loading ? (
        <Loading />
      ) : (
        <div className="form-wrapper">
          <div className="input finder" onClick={() => handleDirectoryChange('inputPath')}>
            <label htmlFor="inputPath">{t('input_path')}</label>
            <input
              id="inputPath"
              defaultValue={form.inputPath || ''}
              type="text"
              readOnly
              required
            />
          </div>

          <div className="input finder" onClick={() => handleDirectoryChange('outputPath')}>
            <label htmlFor="outputPath">{t('output_path')}</label>
            <input
              id="outputPath"
              defaultValue={form.outputPath || ''}
              type="text"
              readOnly
              required
            />
          </div>

          <div className="input">
            <label htmlFor="filename">{t('filename')}</label>
            <input
              id="filename"
              value={form.filename || ''}
              onChange={(e) => handleChange('filename', e.target.value)}
              type="text"
              required
            />
          </div>

          <div className="input">
            <label htmlFor="interval">{t('interval')}</label>
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

          <div className="split-wrapper">
            <label className="input-checkbox" htmlFor="optimize">
              {t('optimize')}
              <div className="switch">
                <input
                  id="optimize"
                  checked={form.optimize || false}
                  onChange={() => handleChange('optimize', !form.optimize)}
                  type="checkbox"
                />
                <span className="slider" />
              </div>
            </label>
            <div className="input">
              <label htmlFor="quantize">{t('quantize')}</label>
              <input
                id="quantize"
                value={form.quantize || ''}
                onChange={(e) => handleChange('quantize', e.target.value)}
                max={256}
                min={0}
                step={1}
                type="number"
              />
            </div>
          </div>

          <hr />

          <button
            className="start-button"
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            {t('start')}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
