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
        reward: 0,
        isOpen: true,
        rewards: null
    }

    constructor() {
        super()

        this.onSubmitMessage = this.onSubmitMessage.bind(this)
        this.onChangeReplying = this.onChangeReplying.bind(this)
    }

    componentDidMount() {
        this.props.eth.forumService.subscribe('0x0', this.refreshMessages.bind(this))
        this.refreshMessages()
    }

    componentWillUnmount() {
        this.props.eth.forumService.subscribe('0x0', null)
    }

    componentWillReceiveProps(newProps) {
        this.updateStatus(newProps)
    }

    async updateStatus(newProps) {
        await newProps.eth.ready

        let isOpen = await newProps.eth.forumService.isOpen()

        this.setState ({
            endTimestamp: await newProps.eth.forumService.endTimestamp(),
            reward:       await newProps.eth.forumService.rewardPool(),
            isOpen:       isOpen,
            rewards:      isOpen ? null : await newProps.eth.forumService.rewards()
        })
    }

    async refreshMessages() {
        const messages = await this.props.eth.forumService.getChildrenMessages('0x0')
        this.setState({ messages })
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

    renderMessages() {
        if (this.props.eth.status !== 'ok') {
            return <li className='borderis'>Loading Discussion...</li>
        }

        if (this.state.messages.length === 0) {
            return <li className='borderis'>Be the first to leave a comment...</li>
        }

        const messages = this.state.topFive ? this.topFiveMessages() : this.state.messages

        return messages.map((m, index) => {
            return (
                <Message key={m.id}
                         forumService={this.props.eth.forumService}
                         message={m}
                         onChangeReplying={this.onChangeReplying}
                />)
        })
    }

    renderForumState() {
        if (!this.state.endTimestamp) {
            return null
        }

        if (!this.state.isOpen) {
            if (!this.state.rewards) {
                return null
            }

            return (
                <li className={'forum-state'}>
                    <div className={'forum-state-block'}>
                        <div className='pot'>
                            Discussion winners:
                        </div>
                        { this.state.rewards.map(r => (
                            <div className='pot'>
                                { r }
                            </div>
                        ))}
                    </div>
                </li>
            )
        }

        return (
            <li className={'forum-state'}>
                <div className={'forum-state-block'}>
                    <div className='pot'>
                        top voted posters share { this.state.reward > 0 && new BigNumber(this.state.reward).toFormat(0) } ONE Tokens
                    </div>
                    <div className='time-left'>
                        <CountdownTimer date={ new Date(this.state.endTimestamp) }/>
                    </div>
                </div>
            </li>
        )
    }


    render() {
        return (
            <div className="expert-reviews-1 left-side">
                <div className="comments">
                    <ul>
                        {this.renderForumState()}

                        {this.renderMessages()}

                        { this.state.showCompose &&
                            <li>
                                <div className='content'>
                                    <MessageForm onSubmit={this.onSubmitMessage}/>
                                </div>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default withEth(MessageBoard)

