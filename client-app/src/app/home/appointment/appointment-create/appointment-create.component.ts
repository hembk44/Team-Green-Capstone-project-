import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  ValidationErrors
} from "@angular/forms";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from "@angular/material/autocomplete";
import { Router, Params, ActivatedRoute } from "@angular/router";
import { Appointment } from "../models-appointments/appointment.model";
import { DateRange } from "../models-appointments/date-range.model";
import { DataStorageService, Emails } from "../../shared/data-storage.service";

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { GroupSelection } from "../../shared/group-selection";
import { NgxMaterialTimepickerTheme } from "ngx-material-timepicker";
import { DataStorageAppointmentService } from "../shared-appointment/data-storage-appointment.service";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppointmentSnackbarComponent } from "../shared-appointment/appointment-snackbar/appointment-snackbar.component";

@Component({
  selector: "app-appointment-create",
  templateUrl: "./appointment-create.component.html",
  styleUrls: ["./appointment-create.component.css"]
})
export class AppointmentCreateComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  id: number;
  editMode: boolean = false;
  appointments: any;
  detailResponse: any;
  timeslots: any[] = [];
  eachTimeSlot: any;
  appointmentName: string;
  appointmentDesc: string;
  appointmentLocation: string;
  currentRole: string;
  appointmentType: string;
  pendingUsers: any[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  appointmentForm: FormGroup;
  email = new FormControl("", [Validators.required, Validators.email]);
  filteredUserList: Observable<string[]>;
  appointmentData: Appointment;
  dateRangeArray: DateRange[] = [];
  emails: string[] = [];
  userList: string[] = [];
  idOfAppointmentCreated: number;

  @ViewChild("userInput", { static: false }) userInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  //theme for time picker
  timeTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: "darkgrey",
      buttonColor: "white"
    },
    dial: {
      dialBackgroundColor: "rgb(185, 163, 90)"
    },
    clockFace: {
      clockHandColor: "#800029"
    }
  };

  get date() {
    return this.formBuilder.group({
      date: ["", Validators.required],
      time: this.formBuilder.array([this.time])
    });
  }

  get time() {
    return this.formBuilder.group({
      start: ["", Validators.required],
      end: ["", Validators.required],
      interval: [
        "",
        [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]
      ]
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,

    private dataStorage: DataStorageService,
    private dataStorageAppointment: DataStorageAppointmentService,
    private _snackBar: MatSnackBar
  ) {
    this.userList = [];
    this.dataStorage.getEmails();
    this.dataStorage.emails.subscribe((result: Emails[]) => {
      if (result.length > 0) {
        result.forEach(o => {
          if (!this.userList.includes(o.email)) {
            this.userList.push(o.email);
          }
        });
      }
    });

    this.filteredUserList = this.email.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this.filter(user) : this.userList.slice()
      )
    );
  }

  filter(value: string): string[] {
    const filterValue = value.toLocaleLowerCase();

    return this.userList.filter(user =>
      user.toLocaleLowerCase().includes(filterValue)
    );
  }

  ngOnInit() {
    let title = "";
    let description = "";
    let location = "";
    let email = this.email;
    let dateRange = new FormArray([this.date]);

    this.appointmentForm = new FormGroup({
      title: new FormControl(title, [Validators.required]),
      description: new FormControl(description),
      location: new FormControl(location),
      email: email,
      dateRange: dateRange
    });
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      console.log(this.id);
      this.editMode = params["id"] != null;
      console.log(this.editMode);
      this.initForm();
    });
    // let dateRange = new FormArray([this.date]);
    // this.appointmentForm = this.formBuilder.group({
    //   title: ["", Validators.required],
    //   description: ["", Validators.required],
    //   location: [""],
    //   email: this.email,
    //   dateRange: dateRange
    // });

    // let dateRange = new FormArray([this.date]);
    // this.appointmentForm = this.formBuilder.group({
    //   title: ["", Validators.required],
    //   description: ["", Validators.required],
    //   location: [""],
    //   email: this.email,
    //   dateRange: dateRange
    // });
    // this.initForm();
  }

  private initForm() {
    if (this.editMode) {
      this.dataStorageAppointment
        .displayAppointmentDetails(this.id)
        .subscribe(result => {
          // console.log(result);
          this.detailResponse = result.result;
          // console.log(this.detailResponse);
          this.pendingUsers = this.detailResponse.pendingUsers;

          console.log(this.pendingUsers);
          for (let user of this.pendingUsers) {
            this.emails.push(user.email);
          }
          this.appointments = this.detailResponse.response;
          for (let i of this.appointments) {
            this.timeslots.push(i.response);
            this.appointmentLocation = i.location;
          }
          // console.log(this.pendingUsers);
          // console.log(this.appointments);
          // console.log(this.timeslots);
          for (let timeslot of this.timeslots) {
            this.appointmentName = timeslot[0].appointmentName;
            this.appointmentDesc = timeslot[0].appointmentDescription;
          }

          // let title = this.appointmentName;
          // let description = this.appointmentDesc;
          // let location = this.appointmentLocation;
          // let email = this.email;
          let dateRange = new FormArray([this.date]);
          this.appointmentForm = new FormGroup({
            title: new FormControl(this.appointmentName),
            description: new FormControl(this.appointmentDesc),
            location: new FormControl(this.appointmentLocation),
            email: this.email,
            dateRange: dateRange
          });
        });
    }
    // else {
    // let title = "";
    // let description = "";
    // let location = "";
    // let email = this.email;
    // let dateRange = new FormArray([this.date]);
    // this.appointmentForm = new FormGroup({
    //   title: new FormControl(title, [Validators.required]),
    //   description: new FormControl(description),
    //   location: new FormControl(location),
    //   email: email,
    //   dateRange: dateRange
    // });

    // this.emails = this.pendingUsers;

    // let dateRange = new FormArray([this.date]);
    // this.appointmentForm = this.formBuilder.group({
    //   title: [this.appointmentName],
    //   description: [this.appointmentDesc],
    //   location: [this.appointmentLocation],
    //   email: this.email,
    //   dateRange: dateRange
    // });

    // }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.emails.includes(event.option.value)) {
      this.emails.push(event.option.value);
      this.userInput.nativeElement.value = "";
      this.email.setValue(null);
    }
  }

  cancel() {
    this.router.navigate(["/home/appointment/sent"]);
  }

  addDate() {
    (<FormArray>this.appointmentForm.get("dateRange")).push(this.date);
  }

  deleteDate(index: number) {
    (<FormArray>this.appointmentForm.get("dateRange")).removeAt(index);
  }

  addTime(date) {
    date.get("time").push(this.time);
  }

  deleteTime(date, time) {
    date.get("time").removeAt(time);
  }

  // addEmails() {
  //   this.emails.push(this.appointmentForm.value.email);
  //   console.log(this.emails);
  //   this.email.reset();
  // }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add emails
      if (value.trim()) {
        // this.emails.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = "";
      }
      this.email.setValue(null);
    }
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  getErrorMessage() {
    return this.email.hasError("required")
      ? "You must enter a valid email address"
      : this.email.hasError("email")
      ? "Not a valid email"
      : "";
  }
  onSubmit() {
    const appointmentFormValues = this.appointmentForm.value;
    console.log(appointmentFormValues);
    if (this.editMode) {
      this.appointmentName = appointmentFormValues.title;
      this.appointmentDesc = appointmentFormValues.description;
      this.appointmentLocation = appointmentFormValues.location;

      const updatedAppointmentObject = {
        name: this.appointmentName,
        description: this.appointmentDesc,
        recepients: this.emails,
        location: this.appointmentLocation
      };
      console.log(updatedAppointmentObject);

      this.dataStorageAppointment
        .updateAppointment(updatedAppointmentObject, this.id)
        .subscribe(result => {
          console.log(result);
          if (result.status == 400) {
            this._snackBar.openFromComponent(AppointmentSnackbarComponent, {
              duration: 5000,
              panelClass: ["delete"],
              data: result.message
            });
            // this.router.navigate(["home/appointment/sent"]);
          }
          if (result.status == 200) {
            this._snackBar.openFromComponent(AppointmentSnackbarComponent, {
              duration: 5000,
              panelClass: ["standard"],
              data: result.message
            });
            this.router.navigate(["home/appointment/sent"]);
          }
        });
    } else {
      console.log(appointmentFormValues.dateRange);
      for (let date of appointmentFormValues.dateRange) {
        for (let time of date.time) {
          if (time.start.substring(1, 2) === ":") {
            time.start = "0".concat(time.start);
          }
          if (time.end.substring(1, 2) === ":") {
            time.end = "0".concat(time.end);
          }
          this.dateRangeArray.push({
            date: date.date.toLocaleDateString(),
            apptimes: [
              {
                startTime: time.start,
                endTime: time.end,
                interv: time.interval
              }
            ]
          });
        }
      }

      this.appointmentName = appointmentFormValues.title;
      this.appointmentDesc = appointmentFormValues.description;
      this.appointmentLocation = appointmentFormValues.location;
      const obj = {
        name: this.appointmentName,
        description: this.appointmentDesc,
        recepients: this.emails,
        location: this.appointmentLocation,
        appdates: this.dateRangeArray
      };

      this.dataStorageAppointment.storeAppointment(obj).subscribe(result => {
        if (result) {
          console.log(result);
          if (result.status == 201) {
            console.log(result.result.id);
            this.idOfAppointmentCreated = result.result.id;
            console.log(this.idOfAppointmentCreated);

            this.dataStorageAppointment
              .sendApptToCal(this.idOfAppointmentCreated)
              .subscribe((result: any) => {
                console.log(result);
                if (result.status == 201) {
                  this._snackBar.openFromComponent(
                    AppointmentSnackbarComponent,
                    {
                      duration: 5000,
                      panelClass: ["standard"],
                      data:
                        "Appointment has been successfully created and sent to calendar!"
                    }
                  );
                  this.router.navigate(["home/appointment/sent"]);
                }
              });
          }
          if (result.status === 403) {
            this._snackBar.openFromComponent(AppointmentSnackbarComponent, {
              duration: 5000,
              panelClass: ["delete"],
              data: result.message
            });
          }
        }
      });
      this.dateRangeArray = [];
    }
  }

  getFormValidationErrors() {
    Object.keys(this.appointmentForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.appointmentForm.get(key)
        .errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          return (
            "Key control: " +
            key +
            ", keyError: " +
            keyError +
            ", err value: " +
            controlErrors[keyError]
          );
        });
      }
    });
  }

  groupSelect() {
    const dialogRef = this.dialog.open(GroupSelection, {
      width: "600px"
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.emails = this.emails.concat(result);
      // for (let email of result) {
      //   if (!this.emails.includes(email)) {
      //     this.emails.push(email);
      //   }
      // }
    });
  }
}
