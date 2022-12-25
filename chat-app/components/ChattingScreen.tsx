import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { IoMdLogOut } from 'react-icons/io';
import { useRouter } from 'next/router';
import { addMessage, getMessages } from '../apiDuties';

interface chattingScreen {
  currentChat: any;
  currentUser: any;
  socket:React.MutableRefObject<any>;
}

const ChattingScreen = ({ currentChat, currentUser, socket }: chattingScreen) => {

  const [messages, setMessages] = useState<any>([]);
  const [msg, setMsg] = useState<string>("");
  const [arrivalMsg, setArrivalMsg] = useState<any>(null);
  const router = useRouter();
  const scrollRef:React.MutableRefObject<any> = useRef();

  useEffect(() => {

    async function chatterStarter() {
      let userId = {
        from: currentUser._id,
        to: currentChat._id
      };
      const chats = await getMessages(userId);
      setMessages(chats.projectMsg);
    }

    try 
    {
      if (currentChat._id === undefined)
        console.log("Nothing!!");
      else
        chatterStarter();
    }
    catch (error) {
      console.log(error);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat]);

  const handleClick = () => {

    console.log('Working')
    localStorage.clear();
    router.push('/login');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  }

  const handleSendMsg = async () => {

    let userObj = {
      message: msg,
      from: currentUser._id,
      to: currentChat._id
    };
//* Emitting that send event to the logged person
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg
    });
//* Adding the msg to db after socket
    let check = await addMessage(userObj);

    const msgs = [...messages];
    msgs.push({fromSelf: true, message: msg});
    setMessages(msgs);

    if (check)
      setMsg('');
  }

  useEffect(() => {

    if(socket.current)
      socket.current.on("msg-receive", (msg:string) => {
        setArrivalMsg({fromSelf: false, message: msg})
      });
  }, [socket]);

  useEffect(() => {

    arrivalMsg && setMessages((prev: any) => [...prev, arrivalMsg]);

    console.log(arrivalMsg);

  }, [arrivalMsg]);

  useEffect(() => {

    scrollRef.current?.scrollIntoView({behaviour: 'smooth'});

  }, [messages]);


  return (
    <>
      {currentChat && <div id="mainContainer" className='flex flex-col justify-between h-full'>

        <div className='flex space-x-5 items-center justify-between bg-slate-800 px-3 py-2'>

          <div className='flex space-x-5 items-center'>
            <Image src={currentChat.avatarImage} height={50} width={50} alt='Sorry for the inconveinance' />
            <span>{currentChat.username}</span>
          </div>

          <div>
            <button className='btn btn-sm text-lg' onClick={handleClick}><IoMdLogOut /></button>
          </div>

        </div>

        <div className=' h-full flex flex-col overflow-y-scroll'>

          {messages.map((msg:any, index:number) => <div key={index} ref={scrollRef} className={`chat ${ msg.fromSelf ? "chat-end" : "chat-start"}`}>
            <div className="chat-bubble chat-bubble-primary">{msg.message}</div>
          </div>)}
        </div>

        <div className='flex items-center space-x-5 px-4 py-2 justify-evenly bg-slate-800'>
          <input type="text" className='input input-ed w-[90%] p-2 rounded-md' value={msg} onChange={handleChange} />
          <button className='btn px-4 py-2' onClick={handleSendMsg}><IoSend /></button>
        </div>

      </div>}
    </>
  )
}

export default ChattingScreen
