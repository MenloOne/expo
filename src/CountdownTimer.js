import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Countdown from 'react-countdown-now'
import './css/sb-admin.css'

export default class CountdownTimer extends Component {
    static propTypes = {
        date: PropTypes.object.isRequired,
    }

    constructor() {
        super()
        this.renderer = this.renderer.bind(this)
    }

    renderer({ days, hours, minutes, seconds, completed }) {
        if (completed) {
            if (this.props.renderCompleted) {
                this.props.renderCompleted()
            }

            return null
        }

        return (
            <div className="time-watch">
                {parseInt(days, 10) > 0 && (
                    <span>
                        <div>
                            <span>{days}</span>
                            <span>Days</span>
                        </div>
                        <div className="dots">:</div>
                    </span>
                )}
                <div>
                    <span>{hours}</span>
                    <span>Hours</span>
                </div>
                <div className="dots">:</div>
                <div>
                    <span>{minutes}</span>
                    <span>Minutes</span>
                </div>
                <div className="dots">:</div>
                <div>
                    <span>{seconds}</span>
                    <span>Seconds</span>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Countdown date={ this.props.date } zeroPadLength={2} renderer={ this.renderer } />
        )
    }
}
