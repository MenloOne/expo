import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import BigNumber from 'bignumber.js'

import {withEth} from '../EthContext'
import Message from './Message'
import MessageForm from './MessageForm'
import authors from './Authors'
import CountdownTimer from '../CountdownTimer'
import '../css/sb-admin.css'

const questionAvatar = require('../images/question-avatar.svg')
const voteTriangle = require('../images/vote-triangle.svg')

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

class MessageBoard extends Component {

    state = {
        messages: [],
        topFive: false,
        showCompose: true,
        endTimestamp: 0,
    }

    constructor() {
        super()

        this.onSubmitMessage = this.onSubmitMessage.bind(this)
        this.onChangeReplying = this.onChangeReplying.bind(this)
        this.claimWinnings = this.claimWinnings.bind(this)
        this.refreshMessages = this.refreshMessages.bind(this)
    }

    componentDidMount() {
        this.props.eth.forumService.subscribeMessages('0x0', this.refreshMessages)
        this.refreshMessages()
    }

    componentWillUnmount() {
        this.props.eth.forumService.subscribeMessages('0x0', null)
        this.props.eth.forumService.subscribeLotteries(null)
    }

    componentWillReceiveProps(newProps) {
    }

    async refreshMessages() {
        let messages = await this.props.eth.forumService.getChildrenMessages('0x0')

        messages = messages.map((msg, i) => {
            if (!authors[msg.author]) {
                authors[msg.author] = ['s110', 's115', 's20', 's43', 's52', 's56', 's62', 's68', 's7', 's74', 's80', 's84', 's88', 's92', 's96', 's11', 's116', 's14', 's17', 's24', 's27', 's34', 's37', 's40', 's47', 's50', 's60', 's66', 's72', 's78', 's111', 's117', 's21', 's29', 's32', 's44', 's53', 's57', 's63', 's69', 's75', 's8', 's81', 's85', 's89', 's93', 's97', 's112', 's119', 's22', 's45', 's54', 's58', 's64', 's70', 's76', 's82', 's86', 's9', 's90', 's94', 's98', 's118', 's12', 's15', 's18', 's25', 's28', 's35', 's38', 's41', 's48', 's51', 's61', 's67', 's73', 's79', 's10', 's113', 's120', 's23', 's30', 's33', 's46', 's55', 's59', 's65', 's71', 's77', 's83', 's87', 's91', 's95', 's99', 's1'].randomElement()
                console.log('daf', msg.author, authors[msg.author]);
            }

            msg.star = authors[msg.author];

            return msg
        })
        

        this.setState({messages})
    }

    claimWinnings() {
        let lottery = this.state.priorLottery
        lottery.claimWinnings()
    }

    onSubmitMessage(body) {
        return this.props.eth.forumService.createMessage(body)
    }

    topFiveMessages() {
        return this.state.messages
            .sort((a, b) => {
                if (a.votes > b.votes) {
                    return -1
                }

                if (a.votes < b.votes) {
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

    onChangeReplying(replying) {
        this.setState({ showCompose: !replying })
    }

    renderCompleted() {
        return null
    }

    renderMessages() {
        if (this.state.messages.length === 0 && (this.props.eth.status !== 'ok' || !this.props.eth.forumService.synced.isFulfilled())) {
            return (<li className='borderis'>
                <div className="message-wrapper" style={{ paddingBottom: '3em' }}>
                    Loading Discussion...
                </div>
            </li>)
        }

        if (this.state.messages.length === 0) {
            return (<li className='borderis'>
                <div className="message-wrapper" style={{ paddingBottom: '3em' }}>
                    Be the first to leave a comment...
                </div>
            </li>)
        }

        const messages = this.state.topFive ? this.topFiveMessages() : this.state.messages

        return messages.map((m, index) => {
            return (
                <div key={index} className='message-wrapper'>
                    <div className='col-12'>
                        <Message key={m.id}
                            forumService={this.props.eth.forumService}
                            message={m}
                            onChangeReplying={this.onChangeReplying}
                            authors={authors}
                        />
                    </div>
                </div>
            )
        })
    }


    render() {
        
        return (
            <div className="left-side">
                <div className="QuestionHeader">
                    <div className="QuestionHeader-logoWrapper">
                        <img src={questionAvatar} />
                    </div>
                    <div className="QuestionHeader-textWrapper">
                        <h6>How does Menlo.one work with relational databases?</h6>
                        <span>@cypherpunk<i className="sX"></i></span><span>104 points</span><span>19 hours ago</span>
                    </div>
                    <div className="QuestionHeader-countdown">
                        {this.props.currentLottery && <CountdownTimer date={new Date(this.props.currentLottery.endTime)} />}
                    </div>
                </div>
                <div className="Question-stats">
                    <div className="stat">
                        <div className="number-circle"><span>84%</span></div>
                        <div className="stat-label-wrapper">
                            <span>Payout for Winning Answer</span>
                            <span>1,337 ONE token ($41 USD)</span>
                        </div>
                    </div>
                    <div className="stat">
                        <div className="number-circle"><span>84%</span></div>
                        <div className="stat-label-wrapper">
                            <span>Most Popular</span>
                            <span>9 Replies</span>
                        </div>
                    </div>
                    <div className="stat">
                        <div className="stat-label-wrapper">
                            <span>Total Votes</span>
                            <span>
                                <i className="fa fa-fw fa-thumbs-up"></i>
                                210
                                <i className="fa fa-fw fa-thumbs-down"></i>
                                10
                            </span>
                        </div>
                    </div>
                </div>
                <div className="Question-wrapper left-side-wrapper">
                    <span className="small-heading">Question</span>
                    <p>
                        With the content node infrastructure being Node and Mongo, how can Menlo One store relational data?
                    </p>
                    <p>
                        <a href="" className="Question-action">
                            <span className="Question-upvote">
                                <img src={voteTriangle} className="icon-upvote" />
                                Upvote (12)
                            </span>
                        </a>
                        <a href="" className="Question-action">
                            <span className="Question-downvote">
                                <img src={voteTriangle} className="icon-downvote" />
                                Downvote
                            </span>
                        </a>
                        <a href="" className="Question-action">
                            <span className="Question-reply">
                                Reply
                            </span>
                        </a>
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
                    </p>
                </div>
                <div className="left-side-wrapper townhall">
                    <div className="expert-reviews-1">
                        <div>
                            <div className="comments">
                                <div className="message-wrapper">
                                    <span className="small-heading">Townhall</span>
                                </div>
                                <ul>
                                    { this.renderMessages() }

                                    {
                                        this.state.showCompose &&
                                        <li>
                                            <div className='content message-wrapper'>
                                                <MessageForm onSubmit={this.onSubmitMessage}/>
                                            </div>
                                        </li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        )
    }
}

export default withEth(MessageBoard)

