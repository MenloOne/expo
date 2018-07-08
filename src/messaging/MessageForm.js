/*
 *
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'

class MessageForm extends React.Component {
  state = {
    message: '',
    disabled: false
  }

  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()
    this.setState({disabled: true})

    this.props.onSubmit(this.state.message)
      .then(() => {
        if (this.props.type !== 'Response') this.setState({message: '', disabled: false, error: null})
      })
      .catch(error => this.setState({error: error.message}))
  }

  onChange(event) {
    this.setState({message: event.target.value})
  }

  onCancel() {
    this.setState({message: ''})
  }

  render() {
    return (

      <form onSubmit={this.onSubmit}>
                <textarea name="" className="field" id="" cols="30" rows="10" value={this.state.message}
                          onChange={this.onChange}></textarea>
        <input type="submit" className="submit-btn" disabled={this.state.disabled}/>
        <a href="" className="cancle-btn" onClick={this.onCancel}>Cancel</a>
        {this.state.error && <p className="error">{this.state.error}</p>}
      </form>
    )
  }
}

export default MessageForm
