import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-conversation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
   
     FormsModule,
     MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIcon
  ],
  templateUrl: './conversation-modal.component.html',
  styleUrl: './conversation-modal.component.scss'
})
export class ConversationModalComponent implements OnInit {
  conversations: any[] = [];
  message: string = '';
  receiver: string = '';
  activeReplyId: number | null = null;
replyMessage: string = '';

role: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  ngOnInit() {
     this.role = localStorage.getItem('roles') || '';
    this.loadMessages();
  }

  isDG(): boolean {
  return this.role === 'ROLE DIRECTOR GENERAL';
}

isMkurugenzi(): boolean {
  return this.role === 'ROLE MKURUGENZI TIBA';
}

isBoard(): boolean {
  return this.role === 'ROLE MEDICAL BOARD MEMBER';
}

isHospital(): boolean {
  return this.role === 'ROLE HOSPITAL USER';
}
  openReplyBox(msg: any) {
  this.activeReplyId = msg.conversation_id;
  this.replyMessage = '';
}
canStartConversation(): boolean {
  return !this.isHospital();
}

getReceivers(): string[] {
  if (this.isDG()) {
    return ['mkurugenzi', 'board', 'hospital'];
  }

  if (this.isMkurugenzi()) {
    return ['board', 'hospital'];
  }

  if (this.isBoard()) {
    return ['hospital'];
  }

  return []; // hospital → no options
}

  loadMessages() {
  this.http.get(`http://127.0.0.1:8000/api/patient-history-conversations?patient_history_id=${this.data.patientHistoryId}`)
    .subscribe((res: any) => {
      this.conversations = res.data || [];
      console.log("CONVERSATIONS:", this.conversations);
    });
}
sendMessage() {
  if (!this.message.trim()) return;

  const payload: any = {
    patient_history_id: this.data.patientHistoryId,
    message: this.message,
    receiver: this.receiver // only for NEW messages
  };

  this.http.post('http://127.0.0.1:8000/api/patient-history-conversations', payload)
    .subscribe(() => {
      this.message = '';
      this.loadMessages();
    });
}

  // sendMessage() {
  //   const payload = {
  //     patient_history_id: this.data.patientHistoryId,
  //     message: this.message,
  //     receiver: this.receiver
  //   };

  //   this.http.post(`http://127.0.0.1:8000/api/patient-history-conversations`, payload)
  //     .subscribe(() => {
  //       this.message = '';
  //       this.loadMessages();
  //     });
  // }
  cancelReply() {
  this.activeReplyId = null;
  this.replyMessage = '';
}

sendReply(msg: any) {
  if (!this.replyMessage.trim()) return;

  const payload = {
    patient_history_id: this.data.patientHistoryId,
    message: this.replyMessage,
    parent_id: msg.conversation_id   // ✅ THIS triggers reply logic in backend
  };

  this.http.post('http://127.0.0.1:8000/api/patient-history-conversations', payload)
    .subscribe(() => {
      this.replyMessage = '';
      this.activeReplyId = null;
      this.loadMessages(); // reload chat
    });
}


}