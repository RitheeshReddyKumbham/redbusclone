// src/app/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  isOpen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/chatbot';
  private chatSession = new BehaviorSubject<ChatSession>({
    id: '',
    messages: [],
    isOpen: false
  });

  constructor(private http: HttpClient) {
    this.initializeSession();
  }

  private initializeSession() {
    const savedSession = localStorage.getItem('chatSession');
    if (savedSession) {
      this.chatSession.next(JSON.parse(savedSession));
    } else {
      this.createNewSession();
    }
  }

  private createNewSession() {
    const session: ChatSession = {
      id: `session-${Date.now()}`,
      messages: [],
      isOpen: false
    };
    this.chatSession.next(session);
    this.saveSession(session);
  }

  private saveSession(session: ChatSession) {
    localStorage.setItem('chatSession', JSON.stringify(session));
  }

  getChatSession(): Observable<ChatSession> {
    return this.chatSession.asObservable();
  }

  toggleChat() {
    const currentSession = this.chatSession.value;
    currentSession.isOpen = !currentSession.isOpen;
    this.chatSession.next(currentSession);
    this.saveSession(currentSession);
  }

  sendMessage(content: string): Observable<ChatMessage> {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      type: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    const currentSession = this.chatSession.value;
    currentSession.messages = [...currentSession.messages, userMessage];
    this.chatSession.next(currentSession);

    return this.http.post<ChatMessage>(`${this.apiUrl}/message`, {
      sessionId: currentSession.id,
      message: content
    });
  }

  updateMessageStatus(messageId: string, status: 'sent' | 'error') {
    const currentSession = this.chatSession.value;
    const updatedMessages = currentSession.messages.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    );
    currentSession.messages = updatedMessages;
    this.chatSession.next(currentSession);
    this.saveSession(currentSession);
  }

  clearChat() {
    this.createNewSession();
  }
}
