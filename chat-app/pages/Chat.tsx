import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import { getAllUsers } from '../apiDuties';
import ChattingScreen from '../components/ChattingScreen';
import Contact from '../components/Contact';
import {io} from 'socket.io-client';

interface userIdentity{
    _id: string,
    email: string,
    username: string,
    avatarImagestring: string,
    isAvatarImageSet: boolean
}

const Chat = () => {
    
    // let socket = socketIO.connect('http://localhost:4500');
    // console.log(socket);
    const socket:React.MutableRefObject<any> = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState<userIdentity>();
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {

        async function chatStarter()
        {
            let curUser:any = localStorage.getItem('chat-app-user');
    
            if(!curUser)
                router.push('/login');
            let parsedUser = await JSON.parse(curUser);
            setCurrentUser(parsedUser);
            setIsLoaded(true);
        }

        chatStarter();

    }, [router]);

    useEffect(() => {

        if(currentUser)
        {
            //* This is just a trial but that url should not be exposed
            socket.current = io("http://localhost:4500");
            socket.current.emit("add-user", currentUser._id);
        }

    }, [currentUser]);
    
    useEffect(() => {

        async function chatStarter()
        {
            if(currentUser)
            {
                let usersData;
                if(currentUser._id !== undefined)
                {    
                    usersData = await getAllUsers(currentUser._id);
                    setContacts(usersData.users);
                }
            }
        }

        if(currentUser)
            chatStarter();

    }, [currentUser]);

    const handleChatChange = (chat:any) => {
        setCurrentChat(chat);
    }

  return (
    <div className='container h-[100vh] bg-slate-900 p-10 px-20'>

        <main className='h-full flex'>

            <div className="left h-full w-[25%]">

                {contacts && currentUser && <Contact contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />}

            </div>

            <div className="right h-full w-[75%]">
                {isLoaded && currentChat===undefined ? <h1 className='text-3xl text-center mt-10'>Hello welcome to the chat section!!</h1> : <ChattingScreen currentChat={currentChat} socket={socket} currentUser={currentUser} />}
            </div>

        </main>
      
    </div>
  )
}

export default Chat;
