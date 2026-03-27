import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-mkurugenzi-conversation',
  standalone: true,
  imports: [
     CommonModule,
        ReactiveFormsModule,
       
         FormsModule,
         MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
  ],
  templateUrl: './mkurugenzi-conversation.component.html',
  styleUrl: './mkurugenzi-conversation.component.scss'
})
export class MkurugenziConversationComponent implements OnInit {
  conversations: any[] = [];
  message: string = '';
  parentId: number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private dialogRef: MatDialogRef<MkurugenziConversationComponent>
  ) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const url = `http://127.0.0.1:8000/api/patient-history-conversations/${this.data.patientHistoryId}/individual-chat`;
    this.http.get(url).subscribe((res: any) => {
      // Normalize response: ensure conversations is always an array
      if (!res.data) {
        this.conversations = [];
      } else if (Array.isArray(res.data)) {
        this.conversations = res.data;
      } else {
        this.conversations = [res.data];
      }
    });
  }

  // Set message to reply to a parent
  setReply(msg: any) {
    this.parentId = msg.conversation_id;
  }

  cancelReply() {
    this.parentId = null;
  }

  sendMessage() {
    if (!this.message.trim()) return;

    const payload: any = {
      patient_history_id: this.data.patientHistoryId,
      message: this.message,
    };

    if (this.parentId) {
      payload.parent_id = this.parentId;
    }

    // Example: sending as Mkurugenzi to DG (you may adjust receiver dynamically)
    payload.receiver = 'dg';

    this.http
      .post(`http://127.0.0.1:8000/api/patient-history-conversations`, payload)
      .subscribe(() => {
        this.message = '';
        this.parentId = null;
        this.loadMessages();
      });
  }
}