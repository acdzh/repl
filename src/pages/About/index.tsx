import React, { useContext, useEffect, useState } from 'react';
import { Container, Divider, Typography } from '@material-ui/core';

// eslint-disable-next-line import/no-cycle
import { AppContext } from '../../App';

const Home: React.FC = () => {
  const { setTitle } = useContext(AppContext);
  useEffect(() => {
    setTitle('About');
  });
  return (
    <Container maxWidth="md" style={{ margin: 20 }}>
      <Typography variant="h4" component="h2">
        About
      </Typography>
      <Divider />
      <div style={{ marginTop: 10, fontSize: 20 }}>
        This is a simple REPL environment for starter.
        <br />
        For more information, please visit
        {' '}
        <a href="https://github.com/acdzh/repl">https://github.com/acdzh/repl</a>
        .
      </div>
    </Container>
  );
};

export default Home;
