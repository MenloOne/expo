import React, {Component} from 'react'
import countdown from 'countdown'

import './css/sb-admin.css'


class CountdownTimer extends Component {

  state = {
    days: '--',
    hours: '--',
    minutes: '--',
    seconds: '--',
  }

  constructor() {
    super()

    this.tick = this.tick.bind(this)
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.tick()
    this.loop = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.loop)
  }

  tick() {
    const date = this.props.date

    const timespan = countdown(null, date)
    let daysUntil  = countdown(null, date, countdown.DAYS).days

    daysUntil = daysUntil < 1 ? '00' : daysUntil

    timespan.hours   = timespan.hours < 1 ? '00' : timespan.hours
    timespan.minutes = timespan.minutes < 1 ? '00' : timespan.minutes
    timespan.seconds = timespan.seconds < 1 ? '00' : timespan.seconds

    daysUntil = daysUntil < 10 && daysUntil !== '00' ? `0${daysUntil}` : daysUntil

    timespan.hours   = timespan.hours   < 10 && timespan.hours !== '00' ? `0${timespan.hours}` : timespan.hours
    timespan.minutes = timespan.minutes < 10 && timespan.minutes !== '00' ? `0${timespan.minutes}` : timespan.minutes
    timespan.seconds = timespan.seconds < 10 && timespan.seconds !== '00' ? `0${timespan.seconds}` : timespan.seconds

    const newState = {
      days: daysUntil,
      hours: timespan.hours,
      minutes: timespan.minutes,
      seconds: timespan.seconds
    }

    this.setState(Object.assign({}, this.state, newState))
  }

  render() {
    return (
      <div className="time-watch">
        <div>{this.state.days}<span>Days</span></div>
        <div className="dots">:</div>
        <div>{this.state.hours}<span>Hours</span></div>
        <div className="dots">:</div>
        <div>{this.state.minutes}<span>Minutes</span></div>
        <div className="dots">:</div>
        <div>{this.state.seconds}<span>Seconds</span></div>
      </div>
    )
  }
}

export default CountdownTimer
