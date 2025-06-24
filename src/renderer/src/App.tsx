import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { secondsToMilliseconds } from 'date-fns'
import { isEmpty, some } from 'lodash'
import Help from './components/Help'
import text from './locales/default.json'

type Form = {
  inputPath?: string
  outputPath?: string
  filename?: string
  interval?: `${number}`
  optimize?: boolean
  quantize?: `${number}`
}

function App(): React.JSX.Element {
  const [form, setForm] = useState<Form>({
    optimize: false,
    quantize: '128'
  })
  const [message, setMessage] = useState<string | null>(null)
  const isDisabled = some([form.inputPath, form.outputPath, form.filename, form.interval], isEmpty)

  useEffect(() => {
    if (!message) return

    const intervalId = setTimeout(() => {
      setMessage(null)
    }, secondsToMilliseconds(10))

    return () => clearInterval(intervalId)
  }, [message])

  const handleChange = (key: string, value: unknown): void => {
    setForm({ ...form, [key]: value })
  }

  const handleDirectoryChange = (key: string): void => {
    window.api.selectFolder().then((res) => {
      if (!res) return

      handleChange(key, res)
    })
  }

  const handleSubmit = (): void => {
    const trueInterval = Math.abs(Number(form.interval))
    const trueQuantize = Math.abs(Number(form.quantize))
    const finalQuantize = trueQuantize > 256 ? 256 : trueQuantize
    setForm({
      ...form,
      interval: `${trueInterval}`,
      quantize: `${finalQuantize}`
    })

    window.api
      .runScript(
        form.inputPath as string,
        form.outputPath as string,
        form.filename as string,
        trueInterval * 100,
        form.optimize || false,
        finalQuantize
      )
      .then((res: string) => {
        setMessage(res)
      })
  }

  return (
    <div className="App">
      <div
        className={classNames('message', {
          show: message
        })}
      >
        <p>{message}</p>
      </div>
      <div className="form-container">
        <Help />
        <div className="form-wrapper">
          <div className="input finder" onClick={() => handleDirectoryChange('inputPath')}>
            <label htmlFor="inputPath">{text.input_path}</label>
            <input
              id="inputPath"
              defaultValue={form.inputPath || ''}
              type="text"
              readOnly
              required
            />
          </div>

          <div className="input finder" onClick={() => handleDirectoryChange('outputPath')}>
            <label htmlFor="outputPath">{text.output_path}</label>
            <input
              id="outputPath"
              defaultValue={form.outputPath || ''}
              type="text"
              readOnly
              required
            />
          </div>

          <div className="input">
            <label htmlFor="filename">{text.filename}</label>
            <input
              id="filename"
              value={form.filename || ''}
              onChange={(e) => handleChange('filename', e.target.value)}
              type="text"
              required
            />
          </div>

          <div className="input">
            <label htmlFor="interval">{text.interval}</label>
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
              {text.optimize}
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
              <label htmlFor="quantize">{text.quantize}</label>
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

          <button className="start-button" onClick={handleSubmit} disabled={isDisabled}>
            {text.start}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
