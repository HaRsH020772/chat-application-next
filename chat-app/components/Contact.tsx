import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const Contact = ({ contacts, currentUser, changeChat }: any) => {

    const [currentUsername, setCurrentUsername] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);


    useEffect(() => {
        if (currentUser) {
            setCurrentUsername(currentUser.username);
            setCurrentUserImage(currentUser.avatarImage);
        }
    }, []);

    const changeCurrentChat = (index: any, contact: any) => {
        setCurrentSelected(index);
        changeChat(contact);
    }

    return (
        <>
            {currentUsername && currentUserImage && <section>

                <div className='flex items-center px-5 py-3 space-x-5'>
                    <Image src={currentUserImage} height={50} width={50} alt='' />
                    <span>{currentUsername}</span>
                </div>

                <div className='flex flex-col space-y-3 px-3 h-[75vh] overflow-y-scroll'>
                    {contacts.map((contact:any, index:number) => <div key={index} className='flex cursor-pointer items-center rounded-md py-2 px-5 bg-slate-800 space-x-5' onClick={() => changeCurrentChat(index, contact)}><Image src={contact.avatarImage} alt='sorry for the inconveinance!' height={50} width={50} />
                        <span>{contact.username}</span></div>)}
                </div>

            </section>}

        </>
    )
}

export default Contact
