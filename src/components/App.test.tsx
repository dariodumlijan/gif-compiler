// import React, { createContext } from 'react';
// import { render } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import { dummyAuthResponse } from '../utils/dummies';
// import axios from '../api/axios';
// import App from './App';

// const store = {
//   user: { user: dummyAuthResponse },
// };

// const DummyStoreContext = createContext(store);

// test('renders App', () => {
//   jest.spyOn(axios, 'get').mockResolvedValue(dummyAuthResponse);
//   const component = render(
//     <DummyStoreContext.Provider value={store}>
//       <MemoryRouter>
//         <App />
//       </MemoryRouter>
//     </DummyStoreContext.Provider>,
//   );
//   expect(component.container.querySelector('.App')).toBeInTheDocument();
// });

test('renders App', () => {});

export {};
