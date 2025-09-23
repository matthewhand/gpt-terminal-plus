import React from 'react';
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { createTheme } from '@mui/material/styles';

// Dark theme matching the original design
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5cd6ff',
    },
    secondary: {
      main: '#ff71ce',
    },
    background: {
      default: '#070b1c',
      paper: 'rgba(16, 21, 43, 0.9)',
    },
  },
});

const Dashboard = () => (
  <div style={{ padding: '40px 32px' }}>
    <h1>GPT Terminal Plus Admin</h1>
    <p>Welcome to the admin interface. Use the menu to manage servers, sessions, and settings.</p>
  </div>
);

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      theme={darkTheme}
      dashboard={Dashboard}
    >
      <Resource name="server" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
      <Resource name="shell/session" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
      <Resource name="activity" list={ListGuesser} show={ShowGuesser} />
      <Resource name="command" list={ListGuesser} create={ListGuesser} />
      <Resource name="file" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} create={ListGuesser} />
      <Resource name="model" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
      <Resource name="chat" list={ListGuesser} create={ListGuesser} />
    </Admin>
  );
}

export default App;