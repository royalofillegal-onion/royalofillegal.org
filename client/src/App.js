import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function ChatApp() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            setMessages((prev) => [...prev, data]);
        });
        socket.on('updateUsers', (userList) => {
            setUsers(userList);
        });
    }, []);
    
    const sendMessage = () => {
        socket.emit('sendMessage', { username, message });
        setMessage('');
    };
    
    return (
        <div className="p-5 bg-gray-900 text-white min-h-screen">
            <input type="text" placeholder="Enter your name" className="p-2 mb-2 w-full bg-gray-800" 
                value={username} onChange={(e) => setUsername(e.target.value)} />
            <div className="border p-4 h-96 overflow-y-scroll bg-gray-800">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>{msg.username}: </strong>{msg.message}
                    </div>
                ))}
            </div>
            <input type="text" placeholder="Type a message..." className="p-2 w-full bg-gray-700 mt-2" 
                value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage} className="w-full p-2 bg-blue-600 mt-2">Send</button>
        </div>
    );
}
