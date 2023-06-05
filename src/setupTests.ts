// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

beforeEach(() => {
  Element.prototype.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
  document.execCommand = jest.fn();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      language: 'en',
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  withTranslation: () => (Component: any) => {
    Component.defaultProps = {
      ...Component.defaultProps,
      t: (str: string) => str,
    };

    return Component;
  },
}));

jest.mock('i18next', () => ({
  t: (str) => str,
}));
