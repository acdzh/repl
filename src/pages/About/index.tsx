import React, { useEffect, useState } from 'react';
import Event from '@libs/Event';
import useLinster from '@hooks/useEvent';

const Child: React.FC<{ e: Event }> = ({ e }) => {
  const [c, setc] = useState(1);

  // useLinster(e, () => {
  //   console.log(`child was called${Math.random()}`);
  //   setS(`${s}\ngfdfgd`);
  // }, [s]);

  useEffect(() => {
    const listener = () => {
      console.log(`child was called${Math.random()}`);
      setc(c + 1);
    };
    e.register(listener);
    return () => {
      e.unRegister(listener);
    };
  }, [e, c]);

  return (
    <div style={{ background: 'green' }}>
      I am Child.
      <br />
      {c}
    </div>
  );
};

const Father = () => {
  const [e] = useState(new Event());
  useLinster(e, () => {
    console.log('father was called');
  }, []);

  return (
    <div style={{ background: 'yellow' }}>
      I am Father.
      <button onClick={() => {
        console.log('father dispatch;');
        e.dispatch();
      }}
      >
        adadadad

      </button>
      <Child e={e} />
    </div>
  );
};

const B = () => {
  const [a, setA] = useState('');

  return (
    <input
      value={a}
      onChange={(e) => {
        setA(e.target.value);
      }}
    />
  );
};

const Home: React.FC = () => (
  <>
    <Father />
    <B />
  </>
);

export default Home;
