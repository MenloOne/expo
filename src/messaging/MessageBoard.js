import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import BigNumber from 'bignumber.js'
import Blockies from 'react-blockies'

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

        this.ranks = ['1st', '2nd', '3rd', '4th', '5th']

        this.onSubmitMessage = this.onSubmitMessage.bind(this)
        this.onChangeReplying = this.onChangeReplying.bind(this)
        this.claimWinnings = this.claimWinnings.bind(this)
    }

    componentDidMount() {
        this.props.eth.forumService.subscribeMessages('0x0', this.refreshMessages.bind(this))
        this.refreshMessages()

        this.props.eth.forumService.subscribeLotteries(this.refreshLotteries.bind(this))
        this.refreshLotteries()
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

    async refreshLotteries() {
        const svc = this.props.eth.forumService
        let lotteries = await svc.getLotteries()
        this.setState({
            ...lotteries,
            endTimestamp: svc.endLotteryTime,
            timeExtended: (svc.endLotteryTimeServer != svc.endLotteryTime)})
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

    renderLottery(lottery) {
        return (
            <div className='lottery-block right-side'>
                <h4>{ lottery.name() } Lottery</h4>

                { !lottery.hasEnded() &&
                    <div>
                        <div className='message'>TIME { this.state.timeExtended ? 'EXTENDED' : 'LEFT' }</div>
                        <div className='time-left'>
                            <CountdownTimer date={ new Date(this.state.endTimestamp) }/>
                        </div>
                    </div>
                }
                { !(lottery.winners && lottery.winners.length > 0) &&
                    <div className='message' style={{ top: '0.3em', textAlign: 'center' }}>
                        TOP VOTED POSTERS WIN ONE TOKENS<br/>
                        NO VOTES YET...
                    </div>
                }
                { lottery.winners && lottery.winners.length > 0 &&
                    <span>
                    {  lottery.iWon && !lottery.claimed && <div className='message'>YOU WON!!!</div> }
                    {  lottery.iWon &&  lottery.claimed && <div className='message'>YOU GOT TOKENS</div> }
                    { !lottery.iWon && <div className='winners-message'>CURRENT WINNERS</div> }

                    <div className='winners-block'>
                            <div className='winners'>
                                {
                                    lottery.winners.map((a, i) => {
                                        return (
                                            <div key={i} className='pedestal'>
                                                <div className='user-img'>
                                                    <Blockies seed={a} size={10} scale={3}/>
                                                </div>
                                                <div className='rank'>{ this.ranks[i] }</div>
                                                <div className='tokens'>{ Number(lottery.winnings(i)).toFixed(1) }<br/>ONE</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        {   lottery.iWon && !lottery.claimed &&
                            <div className='claim'>
                                <button className='btn claim-btn' onClick={this.claimWinnings}>CLAIM { Number(lottery.totalWinnings()).toFixed(1) } ONE TOKENS</button>
                            </div>
                        }
                        </div>
                    </span>
                }
            </div>
        )
    }

    renderLotteries() {

        let lotteries = [this.state.currentLottery, this.state.priorLottery]

        return lotteries.map((lottery) => {
            if (!lottery || !lottery.show()) { return null }

            return (
                <div key={lottery.type} className="lottery right-side-box white-bg">
                    { this.renderLottery(lottery) }
                </div>
            )
        })
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
            <div className='row'>
                <div className="col-md-8">

                    <div className="left-side">
                        <div className="expert-reviews-1 left-side white-bg">
                            <h4> ONE Powered Discussion </h4>

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

                <div className="col-md-4">
                    <div className='right-side'>
                        { this.renderLotteries() }
                    </div>
                </div>
            </div>



        )
    }
}

export default withEth(MessageBoard)

