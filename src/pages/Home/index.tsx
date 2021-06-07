import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createStyles,
  makeStyles,
  styled,
} from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  Search as SearchIcon,
} from '@material-ui/icons';

import clsx from 'clsx';
import langDic from '../../libs/REPL/languages';

// eslint-disable-next-line import/no-cycle
import { AppContext } from '../../App';

const useStyles = makeStyles(() => createStyles({
  container: {
    padding: 20,
  },
  header: {
    width: '100%',
    marginBottom: 20,
  },
  languageCardList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  languageCard: {
    width: 275,
    marginBottom: 30,
    flexDirection: 'column',
  },
  languageCardContent: {
    flex: 1,
  },
  languageCardTitle: {
    fontSize: 14,
  },
}));

const StyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
});

const Home: React.FC = () => {
  const classes = useStyles();
  const { setTitle } = useContext(AppContext);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setTitle('Overview');
  });
  return (
    <Container maxWidth="md" className={classes.container}>
      <header className={classes.header}>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              label="Search"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </header>
      <div className={classes.languageCardList}>
        {
          Object.values(langDic).map(
            (detail) => (
              <Card className={clsx(classes.languageCard,
                searchValue === '' || (detail.name + detail.name + detail.extension).toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ? 'flex' : 'hidden')}
              >
                <CardContent className={classes.languageCardContent}>
                  <Typography className={classes.languageCardTitle} color="textSecondary" gutterBottom>
                    {detail.systemName}
                    {detail.extension && `.${detail.extension}`}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {detail.name}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {detail.tagline}
                  </Typography>
                </CardContent>
                <CardActions>
                  {
                    detail.aboutLink
                  && <Button href={detail.aboutLink} size="small">About</Button>
                  }
                  <Button size="small">
                    <StyledLink to={`/example/${detail.systemName}`}>
                      Examples
                    </StyledLink>
                  </Button>
                  <Button size="small">
                    <StyledLink to={`/run/${detail.systemName}`}>
                      Run
                    </StyledLink>
                  </Button>
                </CardActions>
              </Card>
            ),
          )
        }
      </div>
    </Container>
  );
};

export default Home;
