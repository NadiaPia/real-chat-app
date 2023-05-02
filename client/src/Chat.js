//import React from 'react';
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import ScrollToBottom from "react-scroll-to-bottom";


//React;

function Chat(props) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => { //async so that we wait for the message to be sent to update our array 
        if (currentMessage !== "") {
            const messageData = {
                room: props.room,    //props.room will not work without prop-types package as the eslint
                author: props.username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            await props.socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]); //to receive also your own messages
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        props.socket.on("receive_message", (data) => {
            console.log(data);
            setMessageList((list) => [...list, data]); //set up the list of messeges + the newest
        });

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!clear event listeners for receive_message event on component unmount. 
        //If no use it our event listeners will run twice!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        return () => props.socket.off("receive_message");
    }, [props.socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">Live Chat</div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent, i) => {
                        return (
                            <div key={i} className="message" id={props.username === messageContent.author ? "you" : "other"}>
                                <div className="message-content">
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    placeholder='hey...'
                    value={currentMessage}
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

Chat.propTypes = {
    socket: PropTypes.object,
    username: PropTypes.string,
    room: PropTypes.string,

};

export default Chat;
