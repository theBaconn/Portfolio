import { House, Menu } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useAsyncError } from "react-router-dom"

export default function Home() {
  const [commandHistory, setCommandHistory] = useState([])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [renderedMessages, setRenderedMessages] = useState([])
  const [responseHistory, setResponseHistory] = useState([])
  const [bootSequenceDone, setBootSequenceDone] = useState(false)
  const [initialScreen, setInitialScreen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [showTerminal, setShowTerminal] = useState(true)

  const terminalref = useRef(null)
  const newlineref = useRef(null)
  const github = "https://github.com/theBaconn"
  const linkedin = "https://www.linkedin.com/in/ethan-snead-12964a278/"
  const resume = "/resume1.pdf"
  const messageHead = "root@ELS-Desktop:~$"
  const terminalMessages = ["Initializing...","Communicating with server...","Fetching Ethan's Data...","Finalizing...","Done!"]
  const commandsMap = {
    'about': 
      `--------------------------------------------------------------------------------------------------------------------\nHi! I'm Ethan Snead and I'm a Senior at LSU pursuing a bachelor's in Computer Science with a focus in Cybersecurity!\n\nI am currently working as a Student Security Analyst at LSU's TigerSOC.\n\nTo view my resume and socials, enter one of the following: 'linkedin', 'resume', 'github' or use the quick access menu below!\n--------------------------------------------------------------------------------------------------------------------`
    ,
    'clear':
      " "
    ,
    'help':
      `Available commands: 'about', 'clear', 'help', 'linkedin', 'github', 'resume', 'reboot', 'quit'}`
    ,
    'quit': 
      " "
    ,
    'linkedin':
      `Ethan Snead's LinkedIn: ${linkedin}`
    ,
    'github': 
      `Ethan Snead's GitHub: ${github}` 
    ,
    'reboot':
      `Rebooting...`
    ,
    'resume': 
      "Opening Ethan's Resume..."
  }
  // Initial welcome screen
  useEffect(()=>{
    if (initialScreen){
    }
  },[initialScreen])
  // Checks if boot sequence is done
  useEffect(()=>{
    if (renderedMessages.length == terminalMessages.length) {
      const delay = setTimeout(()=> {
        setRenderedMessages([]);
      setBootSequenceDone(true)
      },1500)      
      return () => clearTimeout(delay);
    }
  },[renderedMessages,currentMessageIndex])

  // Timer for boot sequence messages
  useEffect(() => {
    if (initialScreen){
      return
    }
    if (currentMessageIndex < terminalMessages.length){
      const timer = setInterval(() => {
        setRenderedMessages(prevMessages => [
        ...prevMessages,
        terminalMessages[currentMessageIndex]
      ]);
      setCurrentMessageIndex(prevIndex =>prevIndex+ 1);
      }, 2000);
      return () => clearInterval(timer);
    }
  },[currentMessageIndex,terminalMessages,initialScreen])

  // Autoscrolls in terminal
  useEffect(()=>{
    if (terminalref.current) {
      terminalref.current.scrollTop=terminalref.current.scrollHeight
    }
  },[commandHistory,responseHistory])

  // Handles command submission
  const handleCommand = (command) => {
    if (!command.trim()) {return}
    setCommandHistory(prev=>[...prev, `${command}`]);
    const cleanedCommand = command.trim().toLowerCase()
    const action = commandsMap[cleanedCommand]
    if (action) {
      if (cleanedCommand=="quit"){
        setShowTerminal(false)
        setResponseHistory([])
        setCommandHistory([])
        setInputValue("")
        return
      }
      if (cleanedCommand=="clear"){
        setCommandHistory([])
        setResponseHistory([])
        setInputValue("")
        return
      }
      if (cleanedCommand=="reboot"){
        setCommandHistory([])
        setResponseHistory([])
        setInputValue("")
        setBootSequenceDone(false)
        setCurrentMessageIndex(0)
        return
      }
      if (cleanedCommand=="linkedin"){
        window.open(linkedin,'_blank')
      } else if (cleanedCommand=="github"){
        window.open(github,'_blank')
      } else if (cleanedCommand=="resume"){
        window.open(resume,'_blank')
      }
      setResponseHistory(prev=>[...prev,action])
    }
    else {
      setResponseHistory(prev=>[...prev,`Error: Command "${command}" not found. Type 'help' for available commands.`])
    }
    setInputValue("")
  }

  return (
    <div className='min-h-screen bg-teal-600 bg-cover overflow-hidden'>
      {initialScreen && (
        <div className="min-h-screen bg-gray-600 bg-cover overflow-hidden">
          <p className="text-blue-300/70 text-center">Welcome to Ethan Snead's Portfolio</p>
        </div>
      )}
      {showTerminal && (
        <div className="fixed top-[10px] bottom-[42px] flex-grow flex-col left-0 right-0 max-w-7xl p-8 pb-10 rounded-xl mx-auto z-50">
        {/* Terminal Header */}
          <div className="flex w-full h-8 p-2 gap-1 rounded-t-xl bg-gray-900/50 backdrop-blur-md">
            <span className="inline-block w-4 h-4 bg-black/40 rounded-full"></span>
            <span className="inline-block w-4 h-4 bg-gray-500/70 rounded-full"></span>
            <span className="inline-block w-4 h-4 bg-gray-200/70 rounded-full"></span>
          </div>
        {/* Terminal Body */}
          <div ref={terminalref} onClick={()=>newlineref.current.focus()} className="flex-grow w-full p-1 rounded-xl shadow-xl h-full overflow-y-auto rounded-t-none bg-gray-500/30 backdrop-blur-md">
          {renderedMessages.map((message,index)=>{
            if (message!="Done!"){
              return(
                <p key={index} className="terminal pl-2 pt-0 text-lg text-gray-900 font-semibold">{message}</p>
              ) 
            }
            else {
              return(
                <p key={index} className="terminal pl-2 pt-0 text-lg text-green-500 font-semibold">{message}</p>
              )
            }
          })}
          {bootSequenceDone && (
            <>
            {/* Previous commands/responses */}
            {commandHistory.map((command,index)=>{
              return(
                <div key={index}>
                  <div className="flex items-center">
                    <p className="terminal pl-2 pt-0 text-md text-teal-900 font-bold">{messageHead} </p>
                    <span className="terminal ml-1 text-md text-gray-200  bg-transparent border-none focus:outline-none max-w-full">
                      {command}
                    </span>
                  </div>
                  {responseHistory[index] && (
                    <p className="whitespace-pre-wrap terminal pl-2 py-2 text-md text-gray-900 font-semibold">{responseHistory[index]}</p>
                  )}
                </div>
              )
            })}
          {/* New input line */}
            <div className="flex items-center">
              <p className="terminal pl-2 pt-0 text-md text-teal-900 font-bold">{messageHead} </p>
              <input
                ref={newlineref}
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key == "Enter"){
                    handleCommand(inputValue)
                  }
                }}
                className="terminal ml-1 text-md text-gray-200 bg-transparent border-none focus:outline-none max-w-full">
              </input>
            </div>
            </>
          )}
          </div>
        </div>
      )}
    {/* Taskbar */}
      <div aria-label="Quick Access" onClick={()=>setShowTerminal(prev=>!prev)} className="fixed flex items-center justify-center left-0 right-0 mx-auto rounded-full hover:cursor-pointer shadow-xl w-20 bottom-0 h-10 mb-1 bg-gray-700/80 z-40">
        <Menu className="h-6 w-6 stroke-gray-200"></Menu>
      </div>
    </div>
  )
}