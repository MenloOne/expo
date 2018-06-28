import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/sb-admin.css';

const userIm = require('./images/user-1.png');
const user2Im = require('./images/user-2.png');

class ReviewBoard extends Component {

    state = {
    }

    constructor() {
        super()

    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (

            <div className="expert-reviews-1 left-side">
                <div className="comments">
                    <ul>
                        <li className="borderis">
                            <div className="icon"><img src={userIm} alt=""/></div>
                            <div className="content">
                                <h3 className="tag-name">@wethefuture <span className="points">255 points </span> <span
                                    className="time">15 hours ago</span> <span
                                    className="btn">Team</span></h3>
                                <div className="comments-text">Many meows ago, we had this idea – what if we built a
                                    game on the blockchain. We had no idea what
                                    tho. You’re probably like, ‘you got to be kitten me’, but really - we just knew we
                                    wanted a game! So here we are. Hope
                                    you have fun! Live long and prospurr.
                                </div>
                                <div className="comments-review">
                                    <span><i className="fa fa-caret-up"></i> Upvote (12)</span>
                                    <span><i className="fa fa-caret-down"></i> Downvote </span>
                                    <span>Reply</span>
                                    <span>Permalink</span>
                                    <span>Report</span>
                                </div>
                            </div>

                            <ul>
                                <li>
                                    <div className="icon"><img src={user2Im} alt=""/></div>
                                    <div className="content">
                                        <h3 className="tag-name">@s0l0 <span className="points">12 points </span> <span
                                            className="time">22 hours ago </span></h3>
                                        <div className="comments-text">I think this project is an interesting use of
                                            blockchain technology and who doesn’t lo…
                                        </div>
                                        <div className="comments-review">
                                            <span><em className="blue"><i className="fa fa-caret-up"></i> Upvote </em>(12)</span>
                                            <span><i className="fa fa-caret-down"></i> Downvote </span>
                                            <span>Reply</span>
                                            <span>Permalink</span>
                                            <span>Report</span>
                                        </div>
                                        <div className="comments-review">
                                            <em className="blue">Load More Comments </em>(122 replies)
                                        </div>
                                        <textarea name="" className="field" id="" cols="30" rows="10"></textarea>
                                        <input type="submit" className="submit-btn"/>
                                        <a href="" className="cancle-btn">Cancle</a>
                                    </div>
                                </li>

                            </ul>
                        </li>
                        <li>
                            <div className="icon"><img src={userIm} alt=""/></div>
                            <div className="content">
                                <h3 className="tag-name">@gabbym <span className="points">255 points </span> <span
                                    className="time">15 hours ago</span></h3>
                                <div className="comments-text">CUUUUUUTE! Nice job guys! Can’t wait to try this out.
                                </div>
                                <div className="comments-review">
                                    <span><i className="fa fa-caret-up"></i> Upvote (12)</span>
                                    <span><i className="fa fa-caret-down"></i> Downvote </span>
                                    <span>Reply</span>
                                    <span>Permalink</span>
                                    <span>Report</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default ReviewBoard