import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createStyles, Theme, makeStyles, styled,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import grey from '@material-ui/core/colors/grey';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import {
  Home as HomeIcon,
  Help as HelpIcon,
  Public as PublicIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  InvertColors as InvertColorsIcon,
  GitHub as GitHubIcon,
  BrightnessHigh as BrightnessHighIcon,
  Brightness4 as Brightness4Icon,
} from '@material-ui/icons';

import useEditableState from '@hooks/useEditableState';
import useReversibleState from '@hooks/useReversibleState';
import useLocalStorage from '@hooks/useLocalStorage';
import Home from './pages/Home';
import About from './pages/About';
import Example from './pages/Example';
import Language from './pages/Language';

const drawerWidth = 240;
const appBarHeight = 56;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: appBarHeight,
  },
  drawer: {
    width: drawerWidth,
  },
  mainContainer: {
    width: '100%',
    height: '100vh',
    paddingLeft: drawerWidth,
    paddingTop: appBarHeight,
    overflow: 'auto',
  },
}));

const StyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
});

export const AppContext = React.createContext<{
  setTitle:React.Dispatch<React.SetStateAction<string>>
}>({
  setTitle: () => {
    //
  },
});

const App: React.FC = () => {
  const classes = useStyles();
  const [isDarkMode, , reverseIsDarkMode] = useReversibleState(true);
  const theme = React.useMemo(
    () => createMuiTheme({
      palette: {
        type: isDarkMode ? 'dark' : 'light',
        primary: isDarkMode ? {
          ...grey,
          main: '#333',
        } : teal,
      },
    }),
    [isDarkMode],
  );
  const [title, setTitle] = useState('Overview');
  const [isLogin, setIsLogin] = useLocalStorage('is-login', false);
  return (
    <AppContext.Provider value={{ setTitle }}>
      <ThemeProvider theme={theme}>
        <Router>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography
                variant="h6"
                style={{ flexGrow: 1 }}
              >
                {title}
              </Typography>
              <IconButton color="inherit"><NotificationsIcon /></IconButton>
              <IconButton color="inherit" onClick={() => { window.open('https://www.github.com/acdzh/repl'); }}><GitHubIcon /></IconButton>
              <IconButton color="inherit"><InvertColorsIcon /></IconButton>
              <IconButton
                color="inherit"
                onClick={reverseIsDarkMode}
              >
                {
                  isDarkMode ? <BrightnessHighIcon /> : <Brightness4Icon />
                }
              </IconButton>
              <IconButton color="inherit"><PersonIcon /></IconButton>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawer }}>
            <Toolbar />
            <div>
              <List>
                <StyledLink to="/">
                  <ListItem button>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItem>
                </StyledLink>
                <StyledLink to="/about">
                  <ListItem button>
                    <ListItemIcon><HelpIcon /></ListItemIcon>
                    <ListItemText primary="About" />
                  </ListItem>
                </StyledLink>
                <StyledLink to="/discovery">
                  <ListItem button>
                    <ListItemIcon><PublicIcon /></ListItemIcon>
                    <ListItemText primary="Discovery" />
                  </ListItem>
                </StyledLink>
                <StyledLink to="/me">
                  <ListItem button>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Me" />
                  </ListItem>
                </StyledLink>
              </List>
            </div>
          </Drawer>

          <div className={classes.mainContainer}>
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/example/:lang">
                <Example />
              </Route>
              <Route path="/run/:lang">
                <Language />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
