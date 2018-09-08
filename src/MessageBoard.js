import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {withEth} from './EthContext'
import Message from './messaging/Message'
import MessageForm from './messaging/MessageForm'
import './css/sb-admin.css'


class MessageBoard extends Component {

    state = {
        messages: [],
        topFive: false
    }

    constructor() {
        super()
        this.onSubmitMessage = this.onSubmitMessage.bind(this)
    }

    componentDidMount() {
        this.props.eth.messageBoard.subscribe('0x0', this.refreshMessages.bind(this))
        this.refreshMessages()
    }

    componentWillUnmount() {
    }

    async refreshMessages() {
        const messages = await this.props.eth.messageBoard.getChildrenMessages('0x0')
        this.setState({ messages })
    }

    onSubmitMessage(body) {
        return this.props.eth.messageBoard.createMessage(body)
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

    renderMessages() {
        if (this.state.messages.length === 0) return (<p>Be the first to leave a comment...</p>)

        const messages = this.state.topFive ? this.topFiveMessages() : this.state.messages

        return messages.map((m, index) => {
            return (
                <Message key={`${index}-${m.id}`}
                         messageBoard={this.props.eth.messageBoard}
                         message={m} />)
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

export default withEth(MessageBoard)

