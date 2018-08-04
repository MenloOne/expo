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
import MessageForm from './MessageForm'
import './Message.css'

const userIm = require('../images/user-1.png')
const user2Im = require('../images/user-2.png')

class Message extends React.Component {
  reply = async (messageBody) => {
    this.setState({showReplyForm: false})

    return this.props.client.createMessage(messageBody, this.props.hash)
      .then(async messageHash => {
        const child = (
          <Message key={`${this.state.children.length}-${messageHash}`}
                   hash={messageHash}
                   votes={this.props.client.getVotes(messageHash)}
                   type={'child'}
                   client={this.props.client}
                   body={messageBody}/>)

        await this.showReplies(true)
        this.setState({children: [...this.state.children, child], showReplyForm: false})
      })
  }

  showReplies = async (show) => {
    this.setState({showReplies: show})
    this.refreshMessages()
  }

  constructor(props) {
    super(props)

    this.state = {
      showReplyForm: false,
      showReplies: false,
      children: [],
      votes: this.props.votes || 0,
      upvote: 0,
      downvote: 0
    }
  }

  componentDidMount() {
    this.props.client.subscribeMessages(this.refreshMessages.bind(this))
    this.refreshMessages()
  }

  refreshMessages() {
    this.props.client.getLocalMessages(this.props.hash).then(replies => {
      const replyItems = replies.map(r => {
        return <Message key={r.hash}
                        hash={r.hash}
                        votes={this.props.client.getVotes(r.hash)}
                        type={'child'}
                        client={this.props.client}
                        body={r.body}/>
      })

      this.setState({children: replyItems})
    })
  }

  showReplyForm() {
    this.setState({showReplyForm: true})
  }

  upvote() {
    this.props.client.upvote(this.props.hash)
      .then(r => {
        this.setState({
          votes: this.state.votes + 1 + this.state.downvote,
          downvote: 0,
          upvote: 1
        })
      })
  }

  downvote() {
    this.props.client.downvote(this.props.hash)
      .then(r => {
        this.setState({
          votes: this.state.votes - 1 - this.state.upvote,
          downvote: 1,
          upvote: 0
        })
      })
  }

  countReplies() {
    return this.state.children.length > 0 ? this.state.children.length : this.props.client.countReplies(this.props.hash)
  }

  messageStatus() {
    return this.props.client.topicOffset(this.props.hash) ? 'complete' : 'pending'
  }

  messageComplete() {
    return this.messageStatus() === 'complete'
  }

  messagePending() {
    return this.messageStatus() === 'pending'
  }

  render() {
    return (
      <li className="borderis">
        <div className="icon"><img src={Math.random() < 0.5 ? userIm : user2Im} alt=""/></div>
        <div className="content">
          <h3 className="tag-name">@wethefuture <span className="points">255 points </span> <span
            className="time">15 hours ago</span> <span
            className="btn">Team</span>
          </h3>
          <div className="comments-text">
            {this.props.body}
          </div>
          <div className="comments-review">
            {' '}{this.state.upvote === 0 && this.messageComplete() &&
          <a onClick={this.upvote.bind(this)}><span><i
            className="fa fa-caret-up"></i> Upvote ({this.state.votes})</span></a>}
            {' '}{this.state.downvote === 0 && this.messageComplete() &&
          <a onClick={this.downvote.bind(this)}><span><i
            className="fa fa-caret-down"></i> Downvote </span></a>}
            {this.props.type === 'parent' && this.messageComplete() &&
            <a className="reply" onClick={this.showReplyForm.bind(this)}><span>Reply</span></a>}
          </div>
          <div className="comments-review">
            {' '}
            {this.props.type === 'parent' && this.countReplies() > 0 &&
              <span>
                { this.state.showReplies && <a onClick={() => this.showReplies(!this.state.showReplies)}> <em className="blue">Hide Replies </em></a> }
                { !this.state.showReplies && <a onClick={() => this.showReplies(!this.state.showReplies)}> <em className="blue">Load More Comments </em> ({this.countReplies()})</a> }
              </span>
            }
          </div>
          {this.state.showReplies && this.state.children}
          {this.state.showReplyForm && <MessageForm onSubmit={(message) => this.reply(message)}/>}
        </div>
      </li>
    )
  }
}

export default Message
