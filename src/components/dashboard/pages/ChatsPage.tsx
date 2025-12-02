import React, { useState } from 'react';
import { Search, Send, Paperclip, Image, MoreVertical } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { sampleChats, sampleMessages } from '../../../lib/sampleData';

interface Chat {
  id: string;
  last_message: string;
  last_message_at: string;
  unread_count_doctor: number;
  patients: {
    full_name: string;
    avatar_url?: string;
  };
}

interface Message {
  id: string;
  content: string;
  sender_type: string;
  attachment_url?: string;
  created_at: string;
}

export const ChatsPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(sampleChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(sampleChats[0] || null);
  const [messages, setMessages] = useState<Message[]>(sampleMessages[sampleChats[0]?.id as keyof typeof sampleMessages] || []);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages(sampleMessages[chat.id as keyof typeof sampleMessages] || []);

    const updatedChats = chats.map(c =>
      c.id === chat.id ? { ...c, unread_count_doctor: 0 } : c
    );
    setChats(updatedChats);
  };

  const sendMessage = () => {
    if (!selectedChat || !newMessage.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      sender_type: 'doctor',
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    const updatedChats = chats.map(c =>
      c.id === selectedChat.id
        ? { ...c, last_message: newMessage.trim(), last_message_at: new Date().toISOString() }
        : c
    );
    setChats(updatedChats);
  };

  const filteredChats = chats.filter(chat =>
    chat.patients.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">Chats</h1>
        <p className="text-gray-600">Communicate with your patients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        <Card className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No conversations yet</div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.id === chat.id ? 'bg-[#E7F8EF]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[#6CCF93] flex items-center justify-center text-white font-semibold">
                        {chat.patients.full_name[0]}
                      </div>
                      {chat.unread_count_doctor > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#E53935] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {chat.unread_count_doctor}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-[#1F2933] truncate">
                          {chat.patients.full_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(chat.last_message_at)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.last_message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2 flex flex-col h-full">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6CCF93] flex items-center justify-center text-white font-semibold">
                    {selectedChat.patients.full_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1F2933]">{selectedChat.patients.full_name}</p>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_type === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender_type === 'doctor'
                          ? 'bg-[#6CCF93] text-white'
                          : 'bg-gray-100 text-[#1F2933]'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.attachment_url && (
                        <div className="mt-2 p-2 bg-white/20 rounded">
                          <p className="text-xs">Attachment</p>
                        </div>
                      )}
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(message.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Image className="w-5 h-5" />
                  </Button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
