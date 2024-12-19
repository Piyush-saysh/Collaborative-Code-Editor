import {io} from "socket.io-client"

export const initSocket = async ()=>{
    const option ={
       'force new connection' : true,
       recconectionAttempt :"infinity",
       timeout: 1000,
       transports:['websocket'],
    };
    return io("http://localhost:5174", option);
}