import { Component, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { AsyncPipe } from '@angular/common';
import { EmrAvatarModule } from '@elementar/components';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-toolbar',
  standalone: true,
  imports: [
    MatDivider,
    AsyncPipe,
    EmrAvatarModule,
    MatBadge,
    MatIcon,
    MatIconButton,
    MatTooltip
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit{

  constructor(private route:Router,){}

  fullName:any;

  ngOnInit(): void {
    this.fullName = localStorage.getItem('full_name');
  }

  logoutHead(){
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout in this system",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      allowOutsideClick: () => !Swal.isVisible()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Congratulation!!!!",
          text: "You have a succeessfully to logout",
          icon: "success",
          allowOutsideClick: () => !Swal.isVisible()
        }).then(() => {
          localStorage.clear();
          this.route.navigate(['/']);
        });
      }
    });
  }

}
