import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import AuthContext from "../Storage/AuthStorage";
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function DataRequest() {
  const classes = useStyles();

  const [description, setDescription] = useState("");
  const [data, setData] = useState("");
  const [selectCompany, setSelectCompany] = useState(0);
  const [company, setCompany] = useState([]);
  const [listening, setListening] = useState(false);
  let eventSource = undefined;

  const authctx = useContext(AuthContext);
  const token = authctx.token;
  const companyId = localStorage.getItem("CompanyID");

  useEffect(() => {
    async function fetchData() {
      await axios
        .get("http://localhost:9001/getAllCompany/" + companyId, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          console.log(response.data);
          const companies = response.data.map((comp) => ({
            key: comp.id,
            value: comp.name,
          }));
          console.log(companies);
          setCompany(companies);
        });
    }
    fetchData();
  }, [companyId, token]);

  console.log("company is" + company);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "post",
      url: "http://localhost:9001/dataRequest/add",
      data: JSON.stringify({
        sender: companyId,
        reciever: selectCompany,
        description: description,
        dataNames: data,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      console.log(response);
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Your Data Request
        </Typography>

        <form
          className={classes.form}
          noValidate
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="company"
                select
                label="Select Company"
                value={selectCompany}
                onChange={(event) => setSelectCompany(event.target.value)}
                variant="outlined"
                helperText="Please select your destination company"
              >
                {company.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="description"
                label="Data request description"
                placeholder="description"
                rowsMax={3}
                multiline
                variant="outlined"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="data"
                label="Required Data/ Data list"
                name="data"
                autoComplete="data"
                value={data}
                onChange={(event) => setData(event.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Send Request
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
