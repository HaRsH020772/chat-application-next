import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { getTheAvatars, saveTheAvatar } from '../apiDuties';
import Modal from '../components/Modal';

const SetAvatar = () => {

    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const router = useRouter();


    useEffect(() => {

        try 
        {
            if(!localStorage.getItem('chat-app-user'))
                router.push('/login');
            
            let rawUser:string | null = localStorage.getItem('chat-app-user');
            let user;
            if(rawUser)
                user = JSON.parse(rawUser);

            if(user.isAvatarImageSet)
                router.push('/');

            const fetchImages = async () => {
                let images: any = await getTheAvatars(3);
                setAvatars(images);
                setIsLoading(false);
            }
            fetchImages();
        }
        catch (error) {
            console.log(error);
        }

    }, [router]);

    const setProfilePicture = async () => {

        if (selectedAvatar) 
        {
            let userObj: string | null = localStorage.getItem('chat-app-user');

            if (userObj !== null) 
            {
                let chatUser = await JSON.parse(userObj);
                let res = await saveTheAvatar(selectedAvatar, chatUser._id);
                localStorage.setItem('chat-app-user', JSON.stringify(res.user));
                toast.success('You have selected avatar perfectly!!');

                setTimeout(() => {
                    router.push('/Chat');
                }, 1000);
            }
        }
    }

    return (
        <>
            <div className='bg-slate-900 text-white p-1 flex h-[100vh]'>


                <div className='h-1/2 border border-white w-full p-5 flex flex-col justify-center items-center space-y-10'>

                    <div className='flex justify-center'>
                        <h1 className='text-2xl text-gray-400'>Choose a avatar for your profile</h1>
                    </div>

                    <div className='flex w-1/2 justify-center space-x-14'>

                        {isLoading ? <Image src="/loader1.svg" alt="" width={100} height={10} /> : avatars.map((avatar, index) => <label htmlFor="my-modal" onClick={() => { setSelectedAvatar(avatar) }} key={index}>
                            <Image key={index} src={avatar} className='hover:scale-125 cursor-pointer transition-transform duration-200 ease-in' alt='sorry for the inconveinance' width={100} height={100} />
                        </label>)}

                    </div>

                    <Modal setProfilePicture={setProfilePicture} />

                </div>


            </div>
            <ToastContainer position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" />
        </>
    )
}

export default SetAvatar;
