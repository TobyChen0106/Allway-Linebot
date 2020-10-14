
import React, { Component } from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import './SelectList.css'

const useStyles = ((theme) => ({
    root: {
        width: "82vw",
        margin: "9vw",
        display: 'flex',
        flexDirection: 'column',
    },
    textField: {
        margin: '1rem',
        maxWidth: '100%',
    },
    formControl: {
        margin: '1rem',
        maxWidth: '100%',
        marginBottom: '2rem',
    },
    solution: {
        width: '72vw',
        margin: '5vw',
        backgroundColor: '#edf7ed',
        whiteSpace: 'pre-line'
    },
    title: {
        fontSize: "5vw",
    },
    content: {
        fontSize: "4.5vw",
    },
    submit: {
        width: '82vw',
        backgroundColor: '#fff4e5'
    },
    button: {
        width: '72vw',
        margin: '5vw',
        backgroundColor: '#0063cc',
        color: '#fff'
    }
}));

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            machineId: "",
            machineType: "",
            solution: "",
            showSubmit: false,
        };
    }

    componentDidMount = () => {
        if (this.props.customerMachineList.length === 1) {
            this.setState({ machineId: this.props.customerMachineList[0].Device_Id, machineType: this.props.customerMachineList[0].Devie_Type_Id });
            this.props.handleTextareaChange({ Device_Id: this.props.customerMachineList[0].Device_Id })
        }
    }

    handleSelectMachine = (e) => {
        const m = this.props.customerMachineList.find(m => m.Device_Id === e.target.value);
        this.setState({ machineId: m.Device_Id, machineType: m.Devie_Type_Id });
        this.props.handleTextareaChange({ Device_Id: e.target.value })
    }

    handleSelectSituation = (e) => {
        this.props.handleTextareaChange({ Problem_Id: e.target.value });
        const s = this.props.problemList.find(er => er.Problem_Id === e.target.value);
        this.setState({ solution: s.Problem_Solution, showSubmit: true });
    }

    render() {
        const { classes } = this.props;
        const machines = this.props.customerMachineList.map(
            (data, index) => (
                <MenuItem value={data.Device_Id} style={{ whiteSpace: 'pre-line' }}>{`${data.Device_Type_Name} (機器編號:${data.Device_Id})`}</MenuItem>
            )
        );
        const situation = this.props.problemList.filter(e => e.Device_Type_Id === this.state.machineType).map(
            (data, index) => (
                <MenuItem value={data.Problem_Id} style={{ whiteSpace: 'pre-line' }}>{`[${data.Problem_Name}] ${data.Problem_Text}`}</MenuItem>
            )
        );
        const solution = this.state.solution ? (
            <Card className={classes.solution}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        解決辦法
                    </Typography>
                    <Typography className={classes.content} variant="h5" component="h2">
                        {this.state.solution}
                    </Typography>
                </CardContent>
            </Card>
        ) : null;

        const submit = this.state.showSubmit ? (
            <>
                <TextField
                    className={classes.textField}
                    id="standard-required"
                    label="備註事項 (選填)"
                    variant="outlined"
                    onChange={(e) => this.props.handleTextareaChange({ Exception: e.target.value })}
                    multiline
                    rows={4}
                />
                <Button className={classes.button} onClick={this.props.formOnSubmit} variant="contained" >
                    送出報修單
                </Button>
            </>
        ) : null;

        return (
            <form className={classes.root} noValidate autoComplete="off">
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-placeholder-label-label">
                        {`選擇報修機器*`}
                    </InputLabel>
                    <Select
                        defaultValue={this.props.customerMachineList.length === 1 ? this.props.customerMachineList[0].Device_Id : null}
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        onChange={(e) => this.handleSelectMachine(e)}
                        displayEmpty
                        className={classes.selectEmpty}
                    >
                        {machines}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-placeholder-label-label">
                        {`選擇故障情形*`}
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        onChange={(e) => this.handleSelectSituation(e)}
                        displayEmpty
                        className={classes.selectEmpty}
                    >
                        {situation}
                    </Select>
                </FormControl>
                {solution}
                {submit}
            </form>
        );
    }
}
export default withStyles(useStyles)(Form)