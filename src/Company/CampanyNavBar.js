import { React, useContext, useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import AuthContext from "../Storage/AuthStorage";
import IconButton from "@material-ui/core/IconButton";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import Badge from "@material-ui/core/Badge";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useHistory } from "react-router-dom";
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {},
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function SearchAppBar() {
  const classes = useStyles();
  const authctx = useContext(AuthContext);
  const history = useHistory();
  const [listening, setListening] = useState(false);
  const [dataRequest, setDataRequest] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  let eventSource = null;

  const companyId = localStorage.getItem("CompanyID");
  const token = authctx.token;

  /* useEffect(() => {
    if (!listening) {
      eventSource = new EventSource("http://localhost:9001/subscribe/7");
    
      eventSource.addEventListener("latestDataRequest", (event) => {
        const result = JSON.parse(event.data);
        console.log("received:", result.requestName);
        setRequest(result);
        setCount(1);
      });

      eventSource.onerror = (event) => {
        console.log(event.target.readyState);
        if (event.target.readyState === EventSource.CLOSED) {
          console.log("SSE closed (" + event.target.readyState + ")");
        }
        eventSource.close();
      };

      eventSource.onopen = (event) => {
        console.log("connection opened");
      };
      setListening(true);
    }
    return () => {
      eventSource.close();
      console.log("event closed");
    };
  }, []);  */

  useEffect(() => {
    async function fetchDataRequests() {
      await axios
        .get("http://localhost:9001/getDataRequest/" + companyId, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          console.log("Res Data" + response.data);
          setCount(response.data.length);
          const dataRequests = response.data.map((reqsts) => ({
            key: reqsts.id,
            value: reqsts.companyName,
          }));
          setDataRequest(dataRequests);
        });
    }
    fetchDataRequests();
    setInterval(fetchDataRequests, 60000);
  }, [companyId, token]);

  const handleClose = () => {
    setOpen(false);
    setCount(0);
  };

  const hadndleNotifications = (event) => {
    //setCount(0);
    setOpen(true);
  };
  const logoutHandeler = () => {
    authctx.logout();
    history.replace("/");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Welcome!
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <div>
            <IconButton aria-label="data request notifications" color="inherit">
              <Badge
                badgeContent={count}
                color="secondary"
                onClick={hadndleNotifications}
              >
                <NotificationsActiveIcon />
              </Badge>
            </IconButton>
          </div>
          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
              disableBackdropClick = 'true'
            >
              <DialogTitle>Recent Notifications</DialogTitle>
              <List>
                {dataRequest.map((option) => (
                  <ListItem key={option.key}>
                    <Card variant="outlined">
                      <CardContent variant="outlined">
                        <Typography>
                          You have data request from {option.value}
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={handleClose}
                          color="primary"
                        >
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  </ListItem>
                ))}
              </List>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <div>
            <Button color="inherit" onClick={logoutHandeler}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
