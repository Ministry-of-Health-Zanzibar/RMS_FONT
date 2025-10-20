import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { HDividerComponent, } from '@elementar/components';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authentication/auth.service';
import { GlobalConstants } from '@shared/global-constants';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { InactivityService } from '../../services/accountants/inactivity.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatIconButton,
    MatSuffix,
    HDividerComponent,
    ReactiveFormsModule,
    MatError,
    MatTooltip

  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {

  loginForm:any = FormGroup;
  loading = false;
  passwordVisible: boolean = false;

  constructor(private formBuilder:FormBuilder,
    private route:Router,
    private authService:AuthService,
    private inactivityService: InactivityService
  ){}

    ngOnInit(): void {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      this.loginFormData();
    }

  public loginFormData(){
    this.loginForm = this.formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  // Function to toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
//   loginSubmit() {
//   if (this.loginForm.invalid) {
//     Swal.fire({
//       title: 'Error',
//       text: 'Please fill in both email and password.',
//       icon: 'error',
//       confirmButtonText: 'OK',
//     });
//     return;
//   }

//   // 🔄 Show loading before API call
//   Swal.fire({
//     title: 'Signing in...',
//     text: 'Please wait while we check your credentials.',
//     allowOutsideClick: false,
//     didOpen: () => {
//       Swal.showLoading();
//     }
//   });

//   this.authService.loginAuthenticate(this.loginForm.value).subscribe(
//     (response) => {
//       Swal.close(); // ✅ close loading

//       if (response && response.data && response.data.statusCode === 200) {
//         // success
//         localStorage.setItem("token", `Bearer ${response.data.token}`);
//         this.authService.setPermissions(response.data.permissions);
//         localStorage.setItem("user_id", response.data.user_id);
//         localStorage.setItem("full_name", response.data.full_name);
//         localStorage.setItem("email", response.data.email);
//         localStorage.setItem("roles", response.data.roles[0]?.name || 'Default Role');
//         localStorage.setItem("isLogin","true");

//         Swal.fire({
//           icon: "success",
//           title: "Login Successfully",
//           toast: true,
//           position: "top-end",
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         this.route.navigateByUrl("pages");
//       }
//       else if (response && (response.statusCode === 401 || response.data?.statusCode === 401)) {
//         Swal.fire({
//           icon: "error",
//           title: "Invalid Credentials",
//           text: "The email or password you entered is incorrect.",
//           confirmButtonText: "Try Again",
//         });
//       }
//       else {
//         Swal.fire({
//           icon: "error",
//           title: "Login Failed",
//           text: response?.message || "Something went wrong. Please try again.",
//           confirmButtonText: "OK",
//         });
//       }
//     },
//     (error) => {
//       Swal.close(); // ✅ close loading if error
//       Swal.fire({
//         title: 'Warning!',
//         text: GlobalConstants.genericErrorConnectFail,
//         icon: 'warning',
//         confirmButtonText: 'OK',
//       });
//     }
//   );
// }



  loginSubmit(){
    // this.matxLoader.open();
    this.authService.loginAuthenticate(this.loginForm.value).subscribe((response) => {
      // this.matxLoader.close();
        if (response && response.error) {
          console.log('Server returned an error:', response.error);
        } else {
          if(response.statusCode != 401 && response.data.statusCode == 200){
            localStorage.setItem("token", `Bearer ${response.data.token}`);
            if(response.data.login_status === '1'){

              this.authService.setPermissions(response.data.permissions);
              localStorage.setItem("user_id", response.data.user_id);
              localStorage.setItem("full_name", response.data.full_name);
              localStorage.setItem("email", response.data.email);

              // localStorage.setItem("roles", response.data.roles.name);
              localStorage.setItem("roles", response.data.roles[0]?.name || 'Default Role');


              localStorage.setItem("isLogin","true");
              // this.inactivityService.initListener();
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Login Successifully"
              });
              this.route.navigateByUrl("pages")
            }
            else{
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "warning",
                title: "Please change the password first"
              });
              this.route.navigateByUrl("auth/set-new-password")
            }

          }else{
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "error",
              title: response.message
            });
            this.route.navigateByUrl("/")
          }
        }
      },(error) => {
        Swal.fire({
          title: 'Warning!',
          text: GlobalConstants.genericErrorConnectFail,
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    );

  }

}
