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
import Blockies from 'react-blockies'

import MessageForm from './MessageForm'
import './Message.css'

const userIm = require('../images/user-1.png')
const user2Im = require('../images/user-2.png')

class Message extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showReplyForm: false,
            showReplies: true,
            children: [],
            upvote: 0,
            downvote: 0
        }
    }

    componentDidMount() {
        this.props.messageBoard.subscribe(this.props.message.id, this.refreshMessages.bind(this))
    }

    async refreshMessages() {
        let replies = this.props.messageBoard.getChildrenMessages(this.props.message.id)

        const messages = replies.map(m => {
            return <Message key={m.id}
                            message={m}
                            messageBoard={this.props.messageBoard}/>
        })

        this.setState({ children: messages })
    }

    async reply(body) {
        this.setState({ showReplyForm: false })

        let message = await this.props.messageBoard.createMessage(body, this.props.message.id)
        const child = (
            <Message key={message.id}
                     message={message}
                     messageBoard={this.props.messageBoard}/>
        )

        this.showReplies(true)
        this.setState({
            children: [...this.state.children, child],
            showReplyForm: false
        })
    }

    showReplies (show) {
        this.setState({ showReplies: show })
    }

    showReplyForm() {
        this.setState({showReplyForm: true})
    }

    async upvote() {
        await this.props.messageBoard.upvote(this.props.message.id)
        this.setState({
            votes: this.state.votes + 1 + this.state.downvote,
            downvote: 0,
            upvote: 1
        })
    }

    async downvote() {
        await this.props.messageBoard.downvote(this.props.message.id)
        this.setState({
            votes: this.state.votes - 1 - this.state.upvote,
            downvote: 1,
            upvote: 0
        })
    }

    messageStatus() {
        return this.props.messageBoard.getMessage(this.props.message.id) ? 'complete' : 'pending'
    }

    messageComplete() {
        return this.messageStatus() === 'complete'
    }

    messagePending() {
        return this.messageStatus() === 'pending'
    }

    render() {
        let message = this.props.message

        return (
            <li className="borderis">
                <div className="icon"><Blockies seed={message.author} size={10} ></Blockies></div>
                <div className="content">
                    <h3 className="tag-name">
                        {message.author}
                        <span className="points">??? points </span>
                        <span className="time">15 hours ago</span>
                    </h3>
                    <div className="comments-text">
                        {message.body}
                    </div>
                    <div className="comments-review">
                        {' '}{ this.state.upvote === 0 && this.messageComplete() &&
                            <a onClick={this.upvote.bind(this)}><span><i className="fa fa-caret-up"></i> Upvote ({this.state.votes})</span></a>
                        }
                        {' '}{this.state.downvote === 0 && this.messageComplete() &&
                            <a onClick={this.downvote.bind(this)}><span><i className="fa fa-caret-down"></i> Downvote </span></a>
                        }
                        {message.parent === '0x0' && this.messageComplete() &&
                            <a className="reply" onClick={this.showReplyForm.bind(this)}><span>Reply</span></a>
                        }
                    </div>
                    <div className="comments-review">
                        {' '}
                        {message.parent === '0x0' && this.countReplies() > 0 &&
                            <span>
                                { this.state.showReplies && <a onClick={() => this.showReplies(!this.state.showReplies)}> <em className="blue">Hide Replies </em></a> }
                                { !this.state.showReplies && <a onClick={() => this.showReplies(!this.state.showReplies)}> <em className="blue">Load More Comments </em> ({ message.children.length })</a> }
                            </span>
                        }
                    </div>
                    <ul>
                        {this.state.showReplies && this.state.children}
                    </ul>
                    {this.state.showReplyForm &&
                        <MessageForm onSubmit={(message) => this.reply(message)}/>
                    }
                </div>
            </li>
        )
    }
}

export default Message
