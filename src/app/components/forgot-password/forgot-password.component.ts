import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  passResetForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.passResetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
  });
  }

  // convenience getter for easy access to form fields
  get f() { return this.passResetForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.passResetForm.invalid) {
          return;
      }

      this.loading = true;
      this.authService.forgot_password(this.passResetForm.value)
          .subscribe(
              data => {
                  this.alertService.success('Registration successful', true);
                  this.router.navigate(['/login']);
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
  }

}
