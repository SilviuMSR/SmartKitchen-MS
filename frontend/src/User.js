import React, { Component } from 'react'
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    button: {
        margin: theme.spacing.unit,
        marginTop: '30px'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    table: {
        minWidth: 700,
    },
});


const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

class User extends Component {

    state = {
        board: {
            name: ''
        },
        requests: [],
        currentBoard: null,
        initialized: false,
        renderOptions: false,
        fan: false,
    }

    componentDidMount() {
        this.getRequests()
    }

    getRequests = () => {
        axios.get('http://localhost:9002/requests').then(response => {
            this.setState({
                requests: response.data.requests
            })
        })
    }

    onStartHandler = () => {
        console.log("Application should start")
        const updatedBoard = { ...this.state.currentBoard }
        updatedBoard.isON = true

        axios.put('http://localhost:9002/boards/' + this.state.currentBoard._id + '/turnOn', updatedBoard)
            .then(() => {
                axios.get('http://localhost:9002/boards/' + this.state.currentBoard._id)
                    .then(response => {
                        this.setState({
                            currentBoard: response.data.board[0]
                        }, () => {
                            this.setState({
                                renderOptions: this.state.currentBoard.isON
                            })
                        })
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    onStopHandler = () => {
        console.log("Applications should stop")
        axios.put('http://localhost:9002/boards/' + this.state.currentBoard._id + '/turnOff')
            .then(() => {
                axios.get('http://localhost:9002/boards/' + this.state.currentBoard._id)
                    .then(response => {
                        this.setState({
                            currentBoard: response.data.board[0]
                        }, () => {
                            this.setState({
                                renderOptions: this.state.currentBoard.isON
                            })
                        })
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    onStartTemperatureHandler = () => {
        console.log("Measuring temperature...")
        axios.put('http://localhost:9002/boards/' + this.state.currentBoard._id + '/turnTemperatureON')
            .then(() => {
                console.log("Ok")
                axios.get('http://localhost:9002/boards/' + this.state.currentBoard._id)
                    .then(response => {
                        this.setState({
                            currentBoard: response.data.board[0]
                        }, () => {
                            console.log(this.state.currentBoard)
                        })
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    onStartHumidityHandler = () => {
        console.log("Measuring humidity")
        axios.put('http://localhost:9002/boards/' + this.state.currentBoard._id + '/turnHumidityON')
            .then(() => {
                axios.get('http://localhost:9002/boards/' + this.state.currentBoard._id)
                    .then(response => {
                        this.setState({
                            currentBoard: response.data.board[0]
                        }, () => {
                            console.log(this.state.currentBoard)
                        })
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    onFanHandler = () => {
        let fanState = this.state.fan ? '/turnFanOff' : '/turnFanOn'
        axios.put('http://localhost:9002/boards/' + this.state.currentBoard._id + fanState)
            .then(() => {
                console.log("AICIII")
                axios.get('http://localhost:9002/boards/' + this.state.currentBoard._id)
                    .then(response => {
                        this.setState({
                            fan: !this.state.fan,
                            currentBoard: response.data.board[0],
                        }, () => {
                            console.log(this.state.currentBoard)
                        })
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    onInitializeHandler = () => {
        const boardToCreate = {
            board: this.state.board
        }
        axios.post('http://localhost:9002/boards', boardToCreate)
            .then(result => {
                this.setState({
                    currentBoard: result.data.board,
                    initialized: true
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    onChangeHandler = event => {
        const updatedBoard = { ...this.state.board }
        updatedBoard.name = event.target.value
        this.setState({
            board: updatedBoard
        })
    }

    render() {
        const { classes } = this.props;

        let onInitializeDisplay = (
            // <div>
            //     <input type="text" name="boardName" onChange={this.onChangeHandler} placeholder="Insert board name" />
            //     <input type="submit" value="Submit" onClick={this.onInitializeHandler} />
            // </div>
            <>
                <TextField
                    id="standard-name"
                    label="Board name"
                    className={classes.textField}
                    name="boardName"
                    onChange={this.onChangeHandler}
                    margin="normal"
                />
                <Button variant="outlined" onClick={this.onInitializeHandler} className={classes.button}>
                    Initialize
                </Button>
            </>
        )

        let onStartDisplay = (
            <div style={{
                'display': 'block'
            }}>
                <Button variant="outlined" onClick={this.onStartTemperatureHandler} className={classes.button}>
                    MEASURE TEMPERATURE
                </Button>
                <Button variant="outlined" onClick={this.onStartHumidityHandler} className={classes.button}>
                    MEASURE HUMIDITY
                </Button>
                <Button variant="outlined" onClick={this.onFanHandler} className={classes.button}>
                    {!this.state.fan ? 'START' : 'STOP'} FAN
                </Button>
            </div>
        )

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <h1>Welcome to application</h1>
                            {!this.state.initialized ? onInitializeDisplay :
                                <div>
                                    <Button variant="outlined" onClick={this.onStartHandler} className={classes.button}>
                                        START
                                    </Button>
                                    <Button variant="outlined" onClick={this.onStopHandler} className={classes.button}>
                                        STOP
                                    </Button>
                                </div>
                            }
                            {this.state.renderOptions ? onStartDisplay : null}
                        </Paper>
                    </Grid>

                    <Grid item xs={6}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell>#</CustomTableCell>
                                    <CustomTableCell align="right">Pathname</CustomTableCell>
                                    <CustomTableCell align="right">User Agent</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.requests.map((req, index) => (
                                        <TableRow className={classes.row} key={req.id}>
                                            <CustomTableCell align="right">{index}</CustomTableCell>
                                            <CustomTableCell align="right">{req.path}</CustomTableCell>
                                            <CustomTableCell align="right">{req.userAgent}</CustomTableCell>                  
                                        </TableRow>
                                    ))
                                }
                                {/* {rows.map(row => (
                                    <TableRow className={classes.row} key={row.id}>
                                        <CustomTableCell component="th" scope="row">
                                            {row.name}
                                        </CustomTableCell>
                                        <CustomTableCell align="right">{row.calories}</CustomTableCell>
                                        <CustomTableCell align="right">{row.fat}</CustomTableCell>
                                        <CustomTableCell align="right">{row.carbs}</CustomTableCell>
                                        <CustomTableCell align="right">{row.protein}</CustomTableCell>
                                    </TableRow>
                                ))} */}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </div>
        )
    }

}

export default withStyles(styles)(User);