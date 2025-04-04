// src/app/components/chatbot/chatbot.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatbotService,ChatMessage, ChatSession  } from '../../service/chatbot.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessages') private messagesContainer!: ElementRef;
  
  chatForm: FormGroup;
  chatSession?: ChatSession;
  private sessionSubscription?: Subscription;
  isTyping = false;

  constructor(
    private fb: FormBuilder,
    private chatbotService: ChatbotService
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.sessionSubscription = this.chatbotService.getChatSession()
      .subscribe(session => {
        this.chatSession = session;
        setTimeout(() => this.scrollToBottom(), 100);
      });
  }

  ngOnDestroy() {
    this.sessionSubscription?.unsubscribe();
  }

  toggleChat() {
    this.chatbotService.toggleChat();
  }

  sendMessage() {
    if (this.chatForm.valid) {
      const message = this.chatForm.get('message')?.value;
      this.isTyping = true;
      
      this.chatbotService.sendMessage(message).subscribe(
        response => {
          this.handleBotResponse(response);
          this.chatForm.reset();
          this.isTyping = false;
        },
        error => {
          console.error('Error sending message:', error);
          this.isTyping = false;
        }
      );
    }
  }

  private handleBotResponse(response: ChatMessage) {
    const currentSession = this.chatSession;
    if (currentSession) {
      currentSession.messages = [...currentSession.messages, response];
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  clearChat() {
    this.chatbotService.clearChat();
  }
}
