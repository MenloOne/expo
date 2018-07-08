import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {withEth} from './EthContext'
import Message from './messaging/Message'
import MessageForm from './messaging/MessageForm'
import './css/sb-admin.css'


class ReviewBoard extends Component {

  state = {
    messages: [],
    topFive: false
  }

  constructor() {
    super()

    this.refreshMessages = this.refreshMessages.bind(this)
    this.onSubmitMessage = this.onSubmitMessage.bind(this)
  }

  componentDidMount() {
    this.props.eth.client.subscribeMessages(this.refreshMessages)
    this.refreshMessages()
  }

  componentWillUnmount() {
  }

  refreshMessages() {
    this.props.eth.client.getLocalMessages()
      .then(messages => this.setState({messages}))
  }

  onSubmitMessage(messageBody) {
    return this.props.eth.client.createMessage(messageBody)
  }

  topFiveMessages() {
    return this.state.messages.filter(m => this.props.eth.client.topicOffset(m.hash) > this.props.eth.client.epoch)
      .sort((a, b) => {
        if (this.props.eth.client.getVotes(a.hash) > this.props.eth.client.getVotes(b.hash)) {
          return -1
        }

        if (this.props.eth.client.getVotes(a.hash) < this.props.eth.client.getVotes(b.hash)) {
          return 1
        }

        return 0
      })
      .slice(0, 5)
  }

  renderMessagesFilterButton() {
    if (this.state.topFive) {
      return (<button onClick={() => this.setState({topFive: false})}>View All Messages</button>)
    } else {
      return (<button onClick={() => this.setState({topFive: true})}>View Top Five Messages</button>)
    }
  }

  renderMessages() {
    if (this.state.messages.length === 0) return (<p>There are no messages.</p>)

    const messages = this.state.topFive ? this.topFiveMessages() : this.state.messages

    return messages.map((message, index) => {
      return (
        <Message key={`${index}-${message.hash}`}
                 hash={message.hash}
                 votes={this.props.eth.client.getVotes(message.hash)}
                 type={'parent'}
                 client={this.props.eth.client}
                 body={message.body}/>)
    })
  }


  render() {
    return (
      <div className="expert-reviews-1 left-side">
        <div className="comments">
          <ul>
            {this.renderMessages()}

            <li>
              <div className='content'>
                <MessageForm onSubmit={this.onSubmitMessage}/>
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default withEth(ReviewBoard)

