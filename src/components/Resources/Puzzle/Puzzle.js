import React, { Component } from 'react';
import { Alert, Row } from 'reactstrap';
import Navigation from '../../Navbar/Navbar';
import Banner from '../../Banner/Banner';
import Past from './Past/Past';
import Present from './Present/Present';
import './Puzzle.css';
import firebase from '../../../Firebase';
import config from '../../config.js';
import { initializeSchedule } from '../../../utils/Scheduling';

export default class Puzzle extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.processData = this.processData.bind(this);
        this.getDate = this.getDate.bind(this);
        this.err = this.err.bind(this);

        this.state = { collapse: false };

        this.quarter = 'Spring 2020';
        this.week = 1;
        this.session = 1;
        this.end = false;
        this.quarters = config['quarters'];

        this.done = false;
        this.error = null;
        this.past = null;
        this.present = null;

        initializeSchedule()
            .then(this.getDate)
            .catch(e => this.err(e.message));
    }

    processData(data) {
        this.data = data.val();
        // this.data = data;

        this.past = (
            <Past
                week={this.week}
                quarters={this.quarters}
                session={this.session}
                className="center"
                data={this.data}
            />
        );

        this.present = (
            <Present
                end={this.end}
                week={this.week}
                quarter={this.quarter}
                session={this.session}
                data={this.data}
                // end={false}
                // week={'2'}
                // quarter={'Spring 2019'}
                // session={1}
                // data={this.data[this.quarter]['2']}
            />
        );
        this.toggle();
    }

    err(message) {
        this.done = true;
        this.error = <Alert color="info">{message}</Alert>;
        this.toggle();
    }

    getDate(state) {
        this.quarter = state.quarter;
        this.week = state.week;
        this.session = state.session;
        this.end = state.currentSessionOver;

        this.quarters = this.quarters.slice(0, state.quarterIndex + 1);
        this.done = true;

        var ref = firebase.database().ref();
        ref.on('value', this.processData);

        this.toggle();
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        if (this.done) {
            return (
                <div className="center">
                    <Navigation />
                    <Banner
                        lead="Weekly Problems and Solutions"
                        leadSub="Due to current circumstances all meetings will be held online. Times are TBD"
                    />
                    {this.error}
                    <div className="center">
                        <Row className="center">
                            <Alert
                                className="easy m"
                                transition={{ in: true, timeout: 300 }}>
                                Easy
                            </Alert>
                            <Alert
                                className="med m"
                                transition={{ in: true, timeout: 300 }}>
                                Medium
                            </Alert>
                            <Alert
                                className="hard m"
                                transition={{ in: true, timeout: 300 }}>
                                Hard
                            </Alert>
                            <Alert
                                className="icpc m"
                                transition={{ in: true, timeout: 300 }}>
                                ICPC
                            </Alert>
                            <Alert
                                className="competition m"
                                transition={{ in: true, timeout: 300 }}>
                                Competition
                            </Alert>
                            <Alert
                                className="codealong m"
                                transition={{ in: true, timeout: 300 }}>
                                Code Along
                            </Alert>
                            <Alert
                                className="event m"
                                transition={{ in: true, timeout: 300 }}>
                                Event
                            </Alert>
                        </Row>
                        <Row className="center">
                            <h1 className="display-3">
                                Join Meetings on{' '}
                                <a
                                    href="https://discord.gg/MCtKPxC"
                                    style={{ color: 'rgb(81, 168, 202)' }}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Discord
                                </a>
                            </h1>
                        </Row>
                        <Row className="center">
                            <span>Meetings TBD</span>
                        </Row>
                    </div>

                    <div className="small center">{this.present}</div>

                    <br />

                    <div className="small center">{this.past}</div>

                    <div>
                        <br />
                        <br />
                    </div>
                </div>
            );
        }
        return (
            <div className="center">
                <Navigation />
                <Banner
                    lead="Weekly Problems and Solutions"
                    leadSub="Ready to have your minds blown?"
                />

                <Alert
                    className="med m"
                    transition={{ in: true, timeout: 100 }}>
                    Fetching Data :3
                </Alert>

                <div>
                    <br />
                    <br />
                </div>
            </div>
        );
    }
}
