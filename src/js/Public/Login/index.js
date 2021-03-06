import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContentWrapper } from '../../utils/SnackbarContentWrapper';

import Logo from './../../utils/Logo';
import Loading from './../../utils/Loading';
import { login, getUser } from './../../services/firebase';
import { saveToken, saveUserid } from '../../services/storage';

function Login(props) {
  const [variant, setVariant] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (email && password) {
      const { res, success } = await login(email, password)
      
      if (success) {
        saveToken(res.idToken)
        saveUserid(res.localId)
        const userData = await  getUser()
        setOpenSnackbar(true);
        setVariant('success')
        setMessage('Ingreso correcto');


        setTimeout(() => {
          props.history.replace('/')
          props.setAuthentication(true);
        }, 2000)

      } else {
        setVariant('error');
        setMessage(res);
        setOpenSnackbar(true);

      }

    } else {
      setVariant('error');
      setMessage('Digite todos los campos');
      setOpenSnackbar(true);
      setPassword('');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpenSnackbar(false);
  };


  return (
    <Container component="main" maxWidth="xs" className="login">
      {loading &&
        <Loading />
      }
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Logo />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography component="h1" variant="h5" align="center">
              INWORKERS
              </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Correo"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Inicia sesión
          </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography component='p' align='center'>Ó</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={()=>props.history.push('/signup')}
            >
              Registrate
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography component="p" align='center'> <Link to="/passwordRecovery">¿Olvidaste tu contraseña?</Link></Typography>
          </Grid>
        </Grid>
      </form>


      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <SnackbarContentWrapper
          onClose={handleClose}
          variant={variant}
          message={message}
        />
      </Snackbar>
    </Container>
  );
}

export default Login;
