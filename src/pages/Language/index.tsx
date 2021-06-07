import React, {
  useMemo, useEffect, useState, useContext, useRef,
} from 'react';
import { useLocation, useParams, Link, useHistory } from 'react-router-dom';
import {
  createStyles,
  makeStyles,
  styled,
  useTheme,
  withStyles,
} from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Fab,
  Grid,
  Input,
  Menu,
  MenuItem,
  MenuProps,
  OutlinedInput,
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
import useLocalStorage from '@hooks/useLocalStorage';
import readFile from '@utils/readFile';
import downloadText from '@utils/downloadText';
import Terminal, { TerminalEcho } from '../../components/Terminal';

// eslint-disable-next-line import/no-cycle
import { AppContext } from '../../App';
import './index.css';

const useStyles = makeStyles(() => createStyles({
  container: {
    padding: 20,
    height: '100%',
  },
  menuContainer: {

  },
  menuButton: {
    textTransform: 'unset',
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

const StyledMenu = withStyles({
  paper: {
    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
));

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
  const { setTitle } = useContext(AppContext);
  const history = useHistory();
  const { lang } = useParams<ParamsType>();
  const { state: locationState } = useLocation<LocationStateType>();
  const theme = useTheme();


  const editorRef = useRef<any>(null);
  const [editorValue, setEditorValue] = useLocalStorage(
    `${lang}-editor-content`,
    locationState?.example && locationState?.example.type === 'editor' ? locationState?.example.content : '',
    locationState?.example && locationState?.example.type === 'editor',
  );
  const [editorTheme] = useEffectState(() => (theme.palette.type === 'dark' ? 'vs-dark' : 'light'), [theme]);
  
  const langDetail = useMemo(() => langDic[lang], [lang]);
  const [updateEvent] = useState(new Event());
  const [terminalLoading, setTerminalLoading] = useState(true);
  const repl = useMemo(() => new REPL({
    result: (data) => {
      updateEvent.dispatch(
        <>
          { data.split('\n').map((d) => <TerminalEcho promptLabel="=>" rawInput={d} />) }
        </>,
      );
    },
    output: (data) => {
      updateEvent.dispatch(
        <>
          { data.split('\n').map((d) => <TerminalEcho promptLabel="" rawInput={<span className="">{d}</span>} />) }
        </>,
      );
    },
    error: (data) => {
      updateEvent.dispatch(
        <>
          { data.split('\n').map((d) => <TerminalEcho promptLabel="" rawInput={<span className="terminal-token-error">{d}</span>} />) }
        </>,
      );
    },
    ready: () => {
      setTerminalLoading(false);
    },
  }), []);
  useEffect(() => {
    repl.loadLanguage(lang, true, (...args) => {
      console.log(arg);
    });
  }, [lang]);

  // File
  const [fileName, setFileName] = useLocalStorage(`${lang}-title`, 'untitle');
  useEffect(() => {
    setTitle(`${langDetail.name} - ${fileName}.${langDetail.extension}`);
  }, [fileName]);

  // Menu
  const [anchorEls, setAnchorEl] = React.useState<{ [prop: string]: null | HTMLElement }>({});

  const handleMenuClose = () => {
    setAnchorEl({});
  };

  const changeFileName = () => {
    handleMenuClose();
    // eslint-disable-next-line no-alert
    const newFileName = prompt('Please input the new file name:', fileName);
    if (newFileName && newFileName !== '') {
      setFileName(newFileName);
    }
  };

  const importFromLocalFile = async () => {
    handleMenuClose();
    const c = await readFile({
      accept: `.txt,.${langDetail.extension}`,
    });
    if (c && c !== '') {
      setEditorValue(c);
    }
  };

  const exportToLocalFile = async () => {
    handleMenuClose();
    downloadText(`${fileName}.${langDetail.extension}`, editorValue);
  };

  return (
    <Container maxWidth="xl" className={classes.container}>
      <div className={classes.menuContainer}>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          className={classes.menuButton}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl({
              file: event.currentTarget,
            });
          }}
        >
          File(F)
        </Button>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          className={classes.menuButton}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl({
              edit: event.currentTarget,
            });
          }}
        >
          Edit(E)
        </Button>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          className={classes.menuButton}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl({
              run: event.currentTarget,
            });
          }}
        >
          Run(R)
        </Button>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          className={classes.menuButton}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl({
              help: event.currentTarget,
            });
          }}
        >
          Help(H)
        </Button>
        <StyledMenu
          anchorEl={anchorEls.file}
          keepMounted
          open={Boolean(anchorEls.file)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={changeFileName}>Change File Name</MenuItem>
          <MenuItem onClick={importFromLocalFile}>Import from Local</MenuItem>
          <MenuItem onClick={exportToLocalFile}>Export to Local</MenuItem>
          <MenuItem onClick={handleMenuClose}>Save</MenuItem>
        </StyledMenu>
        <StyledMenu
          anchorEl={anchorEls.edit}
          keepMounted
          open={Boolean(anchorEls.edit)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Undo</MenuItem>
          <MenuItem onClick={importFromLocalFile}>Redo</MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            editorRef.current?.trigger('', 'cursorUndo');
          }}
          >
            Previous Cursor Position
          </MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            editorRef.current?.trigger('', 'cursorRedo');
          }}
          >
            Next Cursor Position
          </MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            editorRef.current?.trigger('', 'editor.action.clipboardCopyWithSyntaxHighlightingAction');
            editorRef.current?.trigger('', 'deleteInsideWord');
          }}
          >
            Cut
          </MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            editorRef.current?.trigger('', 'editor.action.clipboardCopyWithSyntaxHighlightingAction');
          }}
          >
            Copy
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Paste</MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            editorRef.current?.trigger('', 'actions.findWithSelection');
          }}
          >
            Find
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Replace</MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            editorRef.current?.trigger('', 'editor.action.commentLine');
          }}
          >
            Toggle Line Comment
          </MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            editorRef.current?.trigger('', 'editor.action.blockComment');
          }}
          >
            Toggle Block Comment
          </MenuItem>
        </StyledMenu>
        <StyledMenu
          anchorEl={anchorEls.run}
          keepMounted
          open={Boolean(anchorEls.run)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleMenuClose();
            repl.eval(editorValue);
          }}
          >
            Run
          </MenuItem>
        </StyledMenu>
        <StyledMenu
          anchorEl={anchorEls.help}
          keepMounted
          open={Boolean(anchorEls.help)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleMenuClose();
            history.push('/about');
          }}
          >
            About
          </MenuItem>
        </StyledMenu>
      </div>
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
              language={langDetail?.highlightName || lang}
              theme={editorTheme}
              options={{
                scrollBeyondLastLine: false,
              }}
              onChange={(v) => { setEditorValue(v || ''); }}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
              }}
            />
          </Paper>
        </Grid>
        <Grid className="h-full" item xs={6}>
          <Paper className="h-full">
            <Terminal
              loading={terminalLoading}
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
