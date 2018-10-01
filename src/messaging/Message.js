/*
 * Copyright 2018 Menlo One, Inc.
 * Parts Copyright 2018 Vulcanize, Inc.
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
import AnimateHeight from 'react-animate-height';
import Blockies from 'react-blockies'
import Moment from 'react-moment'

import MessageForm from './MessageForm'
import authors from './Authors'

import '../css/sb-admin.css'
import './Message.css'

const voteTriangle = require('../images/vote-triangle.svg')

class Message extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showReplyForm: false,
            showReplies: true,
            children: [],
            expanded: true,
            height: 'auto'
        }
    }

    toggle = () => {
        const { height } = this.state;

        this.setState({
            height: height === 200 ? 'auto' : 200,
        });
    };

    componentDidMount() {
        

        this.props.forumService.subscribeMessages(this.props.message.id, this.refreshMessages.bind(this))

        this.setState({
            height: this.message.clientHeight > 200 ? 200 : 'auto',
            originalHeight: this.message.clientHeight
        })

    }

    componentWillUnmount() {
        this.props.forumService.subscribeMessages(this.props.message.id, null);
    }

    componentWillReceiveProps(newProps) {
        this.refreshMessages()
    }

    async refreshMessages() {
        let message = this.props.message

        let replies = await this.props.forumService.getChildrenMessages(message.id)


        replies = replies.map((msg, i) => {
            if (!authors[msg.author]) {
                authors[msg.author] = ['s110', 's115', 's20', 's43', 's52', 's56', 's62', 's68', 's7', 's74', 's80', 's84', 's88', 's92', 's96', 's11', 's116', 's14', 's17', 's24', 's27', 's34', 's37', 's40', 's47', 's50', 's60', 's66', 's72', 's78', 's111', 's117', 's21', 's29', 's32', 's44', 's53', 's57', 's63', 's69', 's75', 's8', 's81', 's85', 's89', 's93', 's97', 's112', 's119', 's22', 's45', 's54', 's58', 's64', 's70', 's76', 's82', 's86', 's9', 's90', 's94', 's98', 's118', 's12', 's15', 's18', 's25', 's28', 's35', 's38', 's41', 's48', 's51', 's61', 's67', 's73', 's79', 's10', 's113', 's120', 's23', 's30', 's33', 's46', 's55', 's59', 's65', 's71', 's77', 's83', 's87', 's91', 's95', 's99', 's1'].randomElement()
                console.log('daf', msg.author, authors[msg.author]);
            }

            msg.star = authors[msg.author];

            return msg
        })

        this.setState({ children: replies })
    }

    async reply(body) {
        this.setState({ showReplyForm: false })

        let message = await this.props.forumService.createMessage(body, this.props.message.id)
        /*

        const child = (
            <Message key={message.id}
                     message={message}
                     forumService={this.props.forumService}/>
        )

        this.showReplies(true)
        this.setState({
            children: [...this.state.children, child],
            showReplyForm: false
        })
         */
        this.setState({
            showReplyForm: false
        })

        if (this.props.onChangeReplying) {
            this.props.onChangeReplying(false)
        }
    }

    showReplies (show) {
        this.setState({ showReplies: show })
    }

    showReplyForm() {
        this.setState({showReplyForm: true})

        if (this.props.onChangeReplying) {
            this.props.onChangeReplying(true)
        }
    }

    async upvote() {
        await this.props.forumService.upvote(this.props.message.id)
    }

    async downvote() {
        await this.props.forumService.downvote(this.props.message.id)
    }

    messageStatus() {
        return this.props.forumService.getMessage(this.props.message.id) ? 'complete' : 'pending'
    }

    messageComplete() {
        return this.messageStatus() === 'complete'
    }

    messagePending() {
        return this.messageStatus() === 'pending'
    }

    renderVotes() {
        let message = this.props.message
        if (message.votes === 0) {
            return null
        }

        return (
            <span className="votes-indicator item text-primary d-lg-block" negative={(message.votes < 0) ? 'true' : 'false'}>
                <div className='circle left'/>
                <div className='circle mid'>
                    {message.votes < 0 ?
                        <span><i className='fa fa-fw fa-thumbs-down'/>{message.votes}</span>
                        :
                        <span><i className='fa fa-fw fa-thumbs-up'/>{message.votes}</span>
                    }
                </div>
                <div className='circle right'/>
            </span>
        )
    }

    renderReplies() {
        return this.state.children.map(m => {
            return (
                <Message key={m.id}
                    message={m}
                    forumService={this.props.forumService}
                />
            )
        })
    }

    render() {
        let message = this.props.message

        const { height } = this.state;
        

        return (
            <li className="borderis message">
                <div className="user-img">
                    <Blockies seed={message.author} size={ 9 } />
                </div>
                <div className="content">
                    <div className="tag-name-container">
                        <div className="tag-name-wrapper">
                            <span className="tag-name-0x">
                                {message.author && message.author.slice(0,2)}
                            </span>
                            <span className="tag-name">
                                {message.author && message.author.slice(2, message.author.length)}
                            </span>
                            <span className="tag-name-dots">
                                …
                            </span>
                        </div>
                        <i className={`sX ${this.props.message.star}`}></i>
                    </div>
                    <span className="points" style={{ display: 'none' }}>??? points </span>
                    <span className="time">
                        <Moment fromNow>{message.date}</Moment>
                    </span>
                    <AnimateHeight
                        duration={500}
                        height={height} // see props documentation bellow
                    >
                        <div className={"comments-text " + (this.state.expanded ? "" : "limit")} ref={element => {
                            this.message = element;
                        }}>
                            {message.body}
                        </div>
                    </AnimateHeight>
                    {this.state.originalHeight > 200 && this.state.height !== 'auto' &&
                        <button className="comments-readmore" onClick={ () => this.toggle() }>
                            Read More
                        </button>
                    }
                    {this.state.originalHeight > 200 && this.state.height === 'auto' &&
                        <button className="comments-readmore" onClick={ () => this.toggle() }>
                            Collapse Comment
                        </button>
                    }
                    <div className="comments-votes">
                        <span>{ this.renderVotes() }</span>
                        { (!this.props.message.upvoteDisabled() || !this.props.message.downvoteDisabled()) &&
                            <span >
                            <a onClick={this.upvote.bind(this)} disabled={this.props.message.upvoteDisabled()}><span className="Question-upvote Question-action"><img src={voteTriangle} className="icon-upvote" />Upvote</span></a>
                                <a onClick={this.downvote.bind(this)} disabled={this.props.message.downvoteDisabled()}>
                                <span className="Question-downvote Question-action">
                                        <img src={voteTriangle} className="icon-downvote" />
                                        Downvote
                                    </span>
                                </a>
                            </span>
                        }
                        { (this.state.children.length > 0 || message.parent === '0x0') &&
                        <span className='item'>
                            {message.parent === '0x0' && <a className="reply" onClick={this.showReplyForm.bind(this)}>
                                <span className="Question-reply Question-action">
                                    Reply
                                    </span></a>}
                                <a href="" className="Question-action">
                                    <span className="Question-permalink">
                                        Permalink
                                    </span>
                                </a>
                                <a href="" className="Question-action">
                                    <span className="Question-report">
                                        Report
                                    </span>
                                </a>
                            {this.state.children.length > 0 &&
                            <span>
                                {this.state.showReplies &&
                                <a className="hideReplies" onClick={() => this.showReplies(!this.state.showReplies)}> <em className="blue">Hide
                                    Replies </em></a>}
                                {!this.state.showReplies &&
                                <a className="showReplies" onClick={() => this.showReplies(!this.state.showReplies)}> <em className="blue">Show
                                    Replies</em> ({message.children.length})</a>}
                                </span>
                            }
                        </span>
                        }
                    </div>
                    <ul>
                        {this.state.showReplies && this.renderReplies()}
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
