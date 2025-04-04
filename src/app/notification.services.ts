// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationPreference {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface Notification {
  userId: string;
  type: 'BOOKING' | 'CANCELLATION' | 'REMINDER' | 'PROMOTIONAL';
  message: string;
  channels: string[];
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'your-api-endpoint'; // Replace with your backend API

  constructor(private http: HttpClient) {}

  // Send notification across multiple channels
  sendNotification(notification: Notification): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/send`, notification);
  }

  // Update user notification preferences
  updatePreferences(userId: string, preferences: NotificationPreference): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/preferences/${userId}`, preferences);
  }

  // Get user notification preferences
  getPreferences(userId: string): Observable<NotificationPreference> {
    return this.http.get<NotificationPreference>(`${this.apiUrl}/notifications/preferences/${userId}`);
  }

  // Get user notification history
  getNotificationHistory(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications/history/${userId}`);
  }
}
