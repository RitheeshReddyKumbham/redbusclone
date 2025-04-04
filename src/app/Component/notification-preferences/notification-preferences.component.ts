// src/app/Component/notification-preferences/notification-preferences.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationPreference,NotificationService } from '../../notification.services';

@Component({
  selector: 'app-notification-preferences',
  templateUrl: './notification-preferences.component.html',
  styleUrls: ['./notification-preferences.component.css']
})
export class NotificationPreferencesComponent implements OnInit {
  preferencesForm: FormGroup;
  userId: string = 'current-user-id'; // Replace with actual user ID from auth service

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.preferencesForm = this.fb.group({
      email: [true],
      sms: [true],
      push: [true]
    });
  }

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    this.notificationService.getPreferences(this.userId)
      .subscribe({
        next: (prefs: NotificationPreference) => {
          this.preferencesForm.patchValue(prefs);
        },
        error: (error:any[]) => {
          console.error('Error loading preferences:', error);
        }
      });
  }

  savePreferences(): void {
    const preferences: NotificationPreference = this.preferencesForm.value;
    this.notificationService.updatePreferences(this.userId, preferences)
      .subscribe({
        next: () => {
          console.log('Preferences updated successfully');
        },
        error: (error:any[]) => {
          console.error('Error updating preferences:', error);
        }
      });
  }
}
