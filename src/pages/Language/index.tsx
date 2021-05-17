import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  createStyles,
  makeStyles,
  styled,
  useTheme,
} from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Fab,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  PlayArrow as PlayArrowIcon,
} from '@material-ui/icons';
import Editor from '@monaco-editor/react';

// import LuaVM from 'lua.vm.js';

import Event from '@libs/Event';
import useEffectState from '@hooks/useEffectState';

import langDic from '@libs/REPL/languages';

import REPL from '@libs/REPL';
import Terminal, { TerminalEcho } from '../../components/Terminal';

import './index.css';

console.log(REPL);

// const lua = new LuaVM.Lua.State();
// const oldLog = console.log;
// window.console.log = (s) => {
//   oldLog(123, s);
// };
// lua.execute('print("Hello, world")');

const useStyles = makeStyles(() => createStyles({
  container: {
    padding: 20,
    height: '100%',
  },
  editorPaper: {
    padding: '20px',
    position: 'relative',
    height: '100%',
  },
  runButton: {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    zIndex: 2000,
  },
}));

type ParamsType = {
  lang: string;
};

type LocationStateType = {
  example?: {
    type: 'console' | 'editor';
    content: string;
  };
}

const Home: React.FC = () => {
  const classes = useStyles();
  const { lang } = useParams<ParamsType>();
  const { state: locationState } = useLocation<LocationStateType>();
  const theme = useTheme();
  const [editorValue, setEditorValue] = useState(locationState?.example && locationState?.example.type === 'editor' ? locationState?.example.content : '');
  const [editorTheme] = useEffectState(() => (theme.palette.type === 'dark' ? 'vs-dark' : 'light'), [theme]);
  const langDetail = useMemo(() => langDic[lang], [lang]);
  const [updateEvent] = useState(new Event());
  const repl = useMemo(() => new REPL({
    result: (data) => {
      if (!data || data === '' || data === []) {
        return;
      }
      updateEvent.dispatch(
        <>
          {
          data.split('\n').map((d) => <TerminalEcho promptLabel="=>" rawInput={d} />)
        }
        </>,
      );
    },
    output: (data) => {
      if (!data || data === '' || data === []) {
        return;
      }
      updateEvent.dispatch(data);
    },
    error: (data) => {
      updateEvent.dispatch(<TerminalEcho promptLabel="" rawInput={<span className="terminal-token-error">{data}</span>} />);
    },
  }), []);
  useEffect(() => {
    repl.loadLanguage(lang, true, (...args) => {
      console.log(arg);
    });
  }, [lang]);

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid className="h-full" container spacing={4}>
        <Grid item xs={6}>
          <Paper className={classes.editorPaper}>
            <Fab
              color="primary"
              aria-label="run"
              className={classes.runButton}
              onClick={() => {
                repl.eval(editorValue);
              }}
            >
              <PlayArrowIcon />
            </Fab>
            <Editor
              value={editorValue}
              language={lang}
              theme={editorTheme}
              options={{
                scrollBeyondLastLine: false,
              }}
              onChange={(v) => { setEditorValue(v || ''); }}
            />
          </Paper>
        </Grid>
        <Grid className="h-full" item xs={6}>
          <Paper className="h-full">
            <Terminal
              theme={theme.palette.type}
              welcomeMessage={langDetail.header}
              promptLabel="me@React:~$"
              style={{
                height: '100%',
                overflow: 'auto',
              }}
              defaultPromptValue={
                locationState?.example && locationState?.example.type === 'console' ? locationState?.example.content : ''
              }
              updateEvent={updateEvent}
              outerCommander={async (command) => {
                repl.eval(command);
              }}
              matchings={{
                couples: langDetail.matchings,
                singles: ['\'', '"'],
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
