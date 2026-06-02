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
import { ConversationService } from '../../../services/conversation.service';

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

  sendingMessage: boolean = false;
sendingReply: boolean = false;
  conversations: any[] = [];
  message: string = '';
  receiver: string = '';
  activeReplyId: number | null = null;
replyMessage: string = '';

role: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private conversationService: ConversationService
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
  this.conversationService
    .getConversations(this.data.patientHistoryId)
    .subscribe((res: any) => {
      this.conversations = res.data || [];
      // console.log('CONVERSATIONS:', this.conversations);
    });
}
sendMessage() {
  if (!this.message.trim()) return;

  const payload: any = {
    patient_history_id: this.data.patientHistoryId,
    message: this.message,
    receiver: this.receiver
  };

  this.sendingMessage = true; // ✅ start loader

  this.conversationService.sendMessage(payload)
    .subscribe({
      next: () => {
        this.message = '';
        this.loadMessages();
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.sendingMessage = false; // ✅ stop loader
      }
    });
}


  cancelReply() {
  this.activeReplyId = null;
  this.replyMessage = '';
}

sendReply(msg: any) {
  if (!this.replyMessage.trim()) return;

  const payload = {
    patient_history_id: this.data.patientHistoryId,
    message: this.replyMessage,
    parent_id: msg.conversation_id
  };

  this.sendingReply = true; // ✅ start loader

  this.conversationService.sendMessage(payload)
    .subscribe({
      next: () => {
        this.replyMessage = '';
        this.activeReplyId = null;
        this.loadMessages();
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.sendingReply = false; // ✅ stop loader
      }
    });
}

}