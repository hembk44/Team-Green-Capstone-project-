import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { TokenStorageService } from "../auth/token-storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DataStorageService } from "../home/shared/data-storage.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  resetToken: string;

  // constructor(private route: ActivatedRoute) {
  //   console.log('Called Constructor');
  //   this.route.queryParams.subscribe(params => {
  //       this.param1 = params['param1'];
  //       this.param2 = params['param2'];
  //   });
  // }
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService
  ) {
    this.route.queryParams.subscribe(params => {
      this.resetToken = params["resetToken"];
      console.log(this.resetToken);
    });
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      newPassword: ["", Validators.required],
      confirmNewPassword: ["", Validators.required]
    });
  }

  onSubmit() {
    const formValues = this.forgotPasswordForm.value;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const changePasswordObject = {
      password: formValues.newPassword,
      resetToken: this.resetToken
    };
    console.log(changePasswordObject);
    this.dataStorageService
      .submitPassword(changePasswordObject)
      .subscribe(r => console.log(r));
  }
}
