import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import BigNumber from 'bignumber.js'

import {withEth} from '../EthContext'
import Message from './Message'
import MessageForm from './MessageForm'
import CountdownTimer from '../CountdownTimer'

import '../css/sb-admin.css'

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
        const messages = await this.props.eth.forumService.getChildrenMessages('0x0')
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
                <div style={{ paddingBottom: '3em' }}>
                    Loading Discussion...
                </div>
            </li>)
        }

        if (this.state.messages.length === 0) {
            return (<li className='borderis'>
                <div style={{ paddingBottom: '3em' }}>
                    Be the first to leave a comment...
                </div>
            </li>)
        }

        const messages = this.state.topFive ? this.topFiveMessages() : this.state.messages

        return messages.map((m, index) => {
            return (
                <div key={index} className='row'>
                    <div className='col-12'>
                        <Message key={m.id}
                                 forumService={this.props.eth.forumService}
                                 message={m}
                                 onChangeReplying={this.onChangeReplying}
                        />
                    </div>
                </div>
            )
        })
    }


    render() {
        return (
            <div className="left-side">
                <div className="left-side-wrapper">
                    <div className="expert-reviews-1 left-side white-bg">
                        <h2>Question</h2>
                        <h6>How does Menlo.one work with relational databases?</h6>
                        <p>
                            With the content node infrastructure being Node and Mongo, how can Menlo One store relational data?
                        </p>
                        <div className="comments">
                            <ul>
                                { this.renderMessages() }

                                {
                                    this.state.showCompose &&
                                    <li>
                                        <div className='content'>
                                            <MessageForm onSubmit={this.onSubmitMessage}/>
                                        </div>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>



        )
    }
}

export default withEth(MessageBoard)

