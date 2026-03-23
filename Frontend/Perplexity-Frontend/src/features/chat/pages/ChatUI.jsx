import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import {useSelector ,useDispatch} from 'react-redux'
import { useChat } from '../hook/useChat'
import remarkGfm from 'remark-gfm'
import { setCurrentChatId, setLoading } from '../chat.slice'
import { deleteChat } from '../service/chat.api'

const ChatUI = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Toggle state for mobile
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading) 
  const scrollRef = useRef(null)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const dispatch = useDispatch(); // Dispatch initialize karein

// isLoading ko monitor karne ke liye useEffect
useEffect(() => {
  let timer;
  if (isLoading) {
    // Agar 3 seconds tak isLoading true rehta hai, toh use false kar do
    timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 3000);
  }

  // Cleanup: Agar component band ho ya loading pehle hi khatam ho jaye
  return () => clearTimeout(timer);
}, [isLoading, dispatch]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chats, currentChatId, isLoading])

  // Close sidebar automatically on mobile when a chat is selected
  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setIsSidebarOpen(false) 
  }

  const handleSubmitMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim() || isLoading) return
    console.log("Sending to ID:", currentChatId);
    chat.handleSendMessage({ message: chatInput.trim(), chatId: currentChatId })
    setChatInput('')
  }

//   const handleDelete = (chatId)=>{
// if(window.confirm("Kya aap ye chat delete karna chahte hai !"))
//   chat.handleDeleteChat(chatId)
// dispatch(deleteChat(chatId))
//   }

  


  return (
    <main className='flex h-screen w-full bg-[#000000] text-white font-sans overflow-hidden p-0 md:p-6'>
    
      {/* 1. Glass Overlay & Mobile Sidebar */}


   
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside className={`fixed top-0 left-0 z-50 h-full w-[85%] max-w-sm flex-col bg-[#0a0a0a] p-6 border-r border-white/5 transition-transform duration-300 transform md:relative md:flex md:w-80 md:shrink-0 md:translate-x-0 md:rounded-[2.5rem] md:border md:mr-6 md:p-6 md:z-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center'>
                <span className='font-bold italic'>G</span>
            </div>
            <h1 className='text-xl font-bold tracking-tight'>Gnosis</h1>
          </div>
          <button className='bg-white/10 px-4 py-1.5 rounded-full text-xs font-medium'>Try premium</button>
        </div>

        <button 
  onClick={() => {
    dispatch(setCurrentChatId(null)); // ID null hote hi Welcome screen aa jayegi
    setIsSidebarOpen(false);
  }}
  className='w-full mb-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-medium'
>
  <span className='text-lg'>+</span> New Chat
</button>

        <h2 className='text-3xl font-semibold mb-6 tracking-tight'>History</h2>
        
        <div className='flex-1 space-y-3 overflow-y-auto custom-scrollbar'>
          {Object.values(chats).map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => openChat(item.id)}
              className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all ${currentChatId === item.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className='h-10 w-10 rounded-2xl bg-[#1a1a1a] flex items-center justify-center border border-white/5 text-pink-500'>✦</div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-bold truncate'>{item.title || 'Gnosis Chat'}</p>
                <p className='text-xs text-white/40 truncate'>Recent interaction</p>
              </div>
              <span className='text-white/20'>›</span>
              <button 
      onClick={(e) => {
        e.stopPropagation();
        if(window.confirm("Delete this chat?")) {
            chat.handleDeleteChat(item.id);
        }
      }}
      className="font-bold  group-hover:opacity-100 p-2 hover:text-red-500 transition-all"
    >
<svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
    </button>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. Main Chat Area - Responsive Layout */}
      <section className='relative flex flex-1 flex-col bg-[#0a0a0a] rounded-none border-none overflow-hidden md:rounded-[2.5rem] md:border md:border-white/5'>
        
        {/* Header Area: Adds Toggle on Mobile */}
        <div className='absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-pink-600/10 via-transparent to-transparent pointer-events-none opacity-50' />

        <header className='relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/5 backdrop-blur-sm md:px-8 md:py-6'>
          <div className='flex items-center gap-3'>
            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-full text-white hover:bg-white/10 md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div className='h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5'>
               <div className='w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center text-[10px]'>✦</div>
            </div>
            <div>
              <h3 className='text-sm font-bold'>Gnosis Intelligence</h3>
              <p className='text-[10px] text-pink-500 uppercase tracking-widest'>Active Node</p>
            </div>
          </div>
          <div className='flex gap-2'>
             <div className='h-2 w-2 rounded-full bg-pink-500 animate-pulse'></div>
             <div className='h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-75'></div>
          </div>
        </header>

        {/* Messages: Optimized for all screens */}
        <div ref={scrollRef} className='relative z-10 flex-1 overflow-y-auto px-4 py-8 md:px-12 custom-scrollbar'>
          {!chats[currentChatId]?.messages.length && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
               <div className="liquid-blob mb-8 scale-75 md:scale-100"></div>
               <h1 className="text-3xl font-bold tracking-tight max-w-sm md:text-4xl">Create, explore, be inspired</h1>
               <p className='mt-3 text-sm text-white/40 md:text-base'>Gnosis Intelligence is ready for your command.</p>
            </div>
          )}

          <div className='space-y-6 max-w-3xl mx-auto'>
            {chats[currentChatId]?.messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] md:max-w-[85%] rounded-[2rem] px-5 py-3 shadow-2xl md:px-6 md:py-4 ${
                  m.role === 'user' 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-700 text-white rounded-tr-sm' 
                  : 'bg-[#161616] text-white/90 rounded-tl-sm border border-white/5'
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    p: ({children}) => <p className='text-sm md:text-[15px] leading-relaxed'>{children}</p>,
                    code: ({children}) => <code className='text-pink-400 bg-pink-400/10 px-1 rounded'>{children}</code>
                  }}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading !== false  && (
              <div className='flex flex-col items-start'>
                <div className='mt-2 flex gap-1.5 ml-4 bg-[#161616] px-4 py-2.5 rounded-full border border-white/5'>
                    <span className='w-2 h-2 bg-pink-500/60 rounded-full animate-bounce'></span>
                    <span className='w-2 h-2 bg-pink-500/60 rounded-full animate-bounce delay-100'></span>
                    <span className='w-2 h-2 bg-pink-500/60 rounded-full animate-bounce delay-200'></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar: Full width on mobile */}
        <footer className='relative z-10 p-4 md:p-6 md:px-12 md:pb-10'>
          <form onSubmit={handleSubmitMessage} className='relative flex items-center bg-[#1a1a1a] rounded-full border border-white/10 p-1.5 focus-within:border-white/20 transition-all'>
            <input
              type='text'
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder='Send message...'
              className='flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/20 md:text-base md:px-5'
            />
            <div className='flex gap-1 mr-1 md:gap-2 md:mr-2'>
                <button type="button" className="p-2 text-white/40 hover:text-white transition rounded-full hover:bg-white/5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 013 3v10a3 3 0 01-3 3 3 3 0 01-3-3V7a3 3 0 013-3z" /></svg>
                </button>
                <button
                  type='submit'
                  disabled={!chatInput.trim() || isLoading}
                  className='h-10 w-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-20'
                >
                  <svg className='h-5 w-5 fill-current rotate-90' viewBox='0 0 20 20'><path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' /></svg>
                </button>
            </div>
          </form>
        </footer>
      </section>

      {/* <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        
        .liquid-blob {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #ec4899, #8b5cf6, #d946ef);
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          filter: blur(40px);
          animation: liquid-morph 8s ease-in-out infinite alternate;
          opacity: 0.6;
        }

        @keyframes liquid-morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: scale(1) rotate(0deg); }
          100% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: scale(1.1) rotate(15deg); }
        }
      `}</style> */}
    </main>
  )
}

export default ChatUI;