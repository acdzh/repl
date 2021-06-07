import React, { useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useReversibleState from '@hooks/useReversibleState';
import {
  createStyles, makeStyles, styled, useTheme,
} from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Snackbar,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import copyText from '@utils/copyText';
import Highlight from '../../components/Highlight';

import langDic from '../../libs/REPL/languages';
import exampleDic from '../../libs/examples';

// eslint-disable-next-line import/no-cycle
import { AppContext } from '../../App';

const useStyles = makeStyles(() => createStyles({
  container: {
    padding: 20,
  },
}));

const StyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
});

type CodeCardPropsType = {
  name: string;
  content: string;
  lang?: string;
  highlightName: string;
  type: 'console' | 'editor';
}

const CodeCard: React.FC<CodeCardPropsType> = ({
  name, type, content, lang = '', highlightName = 'plain',
}) => {
  const theme = useTheme();
  const [open, setOpen, reverseOpen] = useReversibleState(false);
  return (
    <>
      <Card className="mb-20">
        <CardContent>
          <Typography variant="h6" component="h2">
            {name}
          </Typography>
          <Highlight language={highlightName} theme={theme.palette.type}>
            {content}
          </Highlight>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              copyText(content);
              setOpen(true);
            }}
          >
            Copy
          </Button>
          <Button size="small">
            <StyledLink to={{
              pathname: `/ide`,
              search: `?lang=${lang}`,
              state: {
                example: {
                  type,
                  content,
                },
              },
            }}
            >
              Run

            </StyledLink>
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={reverseOpen}
      >
        <Alert onClose={reverseOpen} severity="success">Copied!</Alert>
      </Snackbar>
    </>
  );
};

type ParamsType = {
  lang: string;
};

const Home: React.FC = () => {
  const classes = useStyles();
  const { setTitle } = useContext(AppContext);
  const { lang } = useParams() as ParamsType;
  const langDetail = langDic[lang];

  useEffect(() => {
    setTitle(`${langDetail.name} Example`);
  });
  return (
    <Container maxWidth="md" className={classes.container}>
      <header className="mb-20">
        <Typography variant="h4" component="h2">
          {langDetail.name}
          {' '}
          Example
        </Typography>
        <Divider />
      </header>
      {
        ['console', 'editor'].map((type) => (
          <section className="mb-40">
            <header className="mb-20">
              <Typography variant="h5" component="h2">
                {type === 'console' ? 'Console' : 'Editor'}
                {' '}
                Example
              </Typography>
            </header>
            {
            exampleDic[lang][type as 'console' | 'editor'].map(
              (example) => (
                <CodeCard
                  key={example.name}
                  type={type as 'console' | 'editor'}
                  name={example.name}
                  content={example.content}
                  lang={lang}
                  highlightName={langDetail?.highlightName || lang}
                />
              ),
            )
          }
          </section>
        ))
      }
    </Container>
  );
};

// const HomeTest: React.FC = () => {
//   const classes = useStyles();
//   // const { lang } = useParams() as ParamsType;
//   // const langDetail = langDic[lang];
//   return (
//     <Container maxWidth="md" className={classes.container}>
//       {
//         Object.keys(langDic).map((lang) => (
//           <>
//             <header className="mb-20">
//               <Typography variant="h4" component="h2">
//                 {langDic[lang].name}
//                 {' '}
//                 Example
//               </Typography>
//               <Divider />
//             </header>
//             {
//         ['console', 'editor'].map((type) => (
//           <section className="mb-40">
//             <header className="mb-20">
//               <Typography variant="h5" component="h2">
//                 {type === 'console' ? 'Console' : 'Editor'}
//                 {' '}
//                 Example
//               </Typography>
//             </header>
//             {
//             exampleDic[lang][type as 'console' | 'editor'].map(
//               (example) => (
//                 <CodeCard
//                   key={example.name}
//                   name={example.name}
//                   content={example.content}
//                   lang={lang}
//                 />
//               ),
//             )
//           }
//           </section>
//         ))
//       }
//           </>
//         ))
//       }
//     </Container>
//   );
// };

export default Home;
