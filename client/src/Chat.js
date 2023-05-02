import React from 'react';
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';


React;

function Chat(props) {
    const [currentMessage, setCurrentMessage] = useState("");
    const sendMessage = async () => { //async so that we wait for the message to be sent to update our array 
        if(currentMessage !== "") {
            const messageData = {
                room: props.room,    //props.room will not work without prop-types package as the eslint
                author: props.username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await props.socket.emit("send_message", messageData);
        }

    };

    useEffect(() => {
        props.socket.on("receive_message", (data) => {
            console.log(data);
        });

    }, [props.socket]);



  return (
    <div>
      <div className="chat-header">Live Chat</div>
      <div className="chat-body"></div>
      <div className="chat-footer">
        <input type="text" placeholder='hey...' onChange={(event) => {setCurrentMessage(event.target.value);}}/>
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
