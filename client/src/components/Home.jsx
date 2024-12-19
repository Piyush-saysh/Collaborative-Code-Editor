import React, { useState } from 'react'
import Logo from './Logo'
import { v4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const navigate = useNavigate()
    const generateRoom =(e)=>{
        e.preventDefault();
        const id =v4();
        setRoomId(id);
        toast.success("room Id is generated")
    }
    const joinRoom =()=>{
        if(!roomId || !username){
            toast.error("Both Fields are Requried")
            return;

        }
        else{

            navigate(`editor/${roomId}`,{
                state:{username},
            })
            toast.success("room is created")
        }
    }




  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center  ">
        <div className="w-full md:w-1/2 ">
            <div className="shadow-sm p-2 mb-5 bg-gray-400 rounded">
                <div className="text-center bg-gray-900 text-white">
                    <div className="width-100px ">
                        <Logo/>
                    </div>

                    <div className="flex justify-center items-center min-h-fit bg-gray-900">
                        <form className=" p-6 rounded-lg shadow-md w-full max-w-md text-black">
                            <div className="mb-4">
                            <label className="block text-gray-300 font-bold mb-2">Enter Room Id</label>
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e)=> setRoomId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Room Id"
                            />
                            </div>
                                    <div className="mb-4">
                                    <label className="block text-gray-300 font-bold mb-2">Enter Your Name</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e)=> setUsername(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Username"
                                    />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full 
                                        bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                        onClick={joinRoom}

                                        >
                                        Join
                                    </button>
                                    <p className='mt-5 text-gray-400'>Don't have a room Id? 
                                        <span className='text-green-700 cursor-pointer'
                                        onClick={generateRoom}> new Room</span></p>
                        </form>

                    </div>


                </div>
            </div>
        </div>
    </div>
  )
}
 
export default Home;