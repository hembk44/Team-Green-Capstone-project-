import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Router } from "@angular/router";
import { Appointment } from "../appointment-model/appointment.model";
import { DateRange } from "../appointment-model/date-range.model";
import { TimeInterval } from "../appointment-model/time-interval.model";
// import { AppointmentService } from "../appointment-service/appointment.service";
import { DataStorageService } from "../../shared/data-storage.service";
import { ApiResponse } from "src/app/auth/api.response";

// export interface DialogData {
//   animal: string;
//   name: string;
// }

@Component({
  selector: "app-appointment-create",
  templateUrl: "./appointment-create.component.html",
  styleUrls: ["./appointment-create.component.css"]
})
export class AppointmentCreateComponent implements OnInit {
  appointmentForm: FormGroup;
  email = new FormControl("", [Validators.required, Validators.email]);
  appointmentData: Appointment;
  dateRangeArray: DateRange[] = [];

  // appointmentDate: Date;
  // startTime: string;
  // endTime: string;
  // timeInterval: number;
  // animal: string;
  // name: string;
  // bird: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private dataStorage: DataStorageService
  ) {}

  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      email: this.email
    });
  }

  getErrorMessage() {
    return this.email.hasError("required")
      ? "You must enter a value"
      : this.email.hasError("email")
      ? "Not a valid email"
      : "";
  }

  openDateRangeDialog(): void {
    const dialogRef = this.dialog.open(DialogDateTimeIntervalDialog, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.dateRangeArray = result;
      // this.appointmentDate = result.date;
      // console.log(this.appointmentDate);
      // this.startTime = result.startTime;
      // this.endTime = result.endTime;
      // this.timeInterval = result.timeInterval;
    });
  }

  onSubmit() {
    const appointmentFormValues = this.appointmentForm.value;
    const obj = {
      name: appointmentFormValues.title,
      description: appointmentFormValues.description,
      recepients: [appointmentFormValues.email],
      dates: this.dateRangeArray
    };

    // this.appointmentData = new Appointment(
    //   appointmentFormValues.title,
    //   appointmentFormValues.description,
    //   [appointmentFormValues.email],
    //   this.dateRangeArray
    // );
    this.dataStorage.storeAppointment(obj).subscribe(result => {
      if (result) {
        this.dataStorage.fetchAppointment();
      }
    });

    // this.appointmentService.addAppointment(this.appointmentData);
    // console.log(this.appointmentService.getAppointments);
    // console.log(this.appointmentData);
  }
}

@Component({
  selector: "dialog-date-timeInterval-dialog",
  templateUrl: "date-timeInterval-dialog.html"
})
export class DialogDateTimeIntervalDialog implements OnInit {
  // DateRangeFormData: FormGroup;
  date = new FormControl("");
  dateRangeData: DateRange;
  dateRangeDataArray: DateRange[] = [];
  timeIntervalDataArray: TimeInterval[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogDateTimeIntervalDialog>,
    public dialog: MatDialog // , // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    // this.DateRangeFormData = this.formBuilder.group({
    //   date: ["", Validators.required]
    // });
  }

  openTimeIntervalDialog(): void {
    const dialogRef = this.dialog.open(DialogTimeIntervalDialog, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.timeIntervalDataArray = result;
    });
  }
  addDate() {
    this.dateRangeData = new DateRange(
      this.date.value,
      this.timeIntervalDataArray
    );
    this.dateRangeDataArray.push(this.dateRangeData);
    this.date.setValue("");
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  saveDialogData() {
    // console.log(this.date);
    // this.dateRangeData = new DateRange(
    //   this.date.value,
    //   this.timeIntervalDataArray
    // );
    // console.log(this.dateRangeData);
    this.addDate();
    console.log("Date Array: " + this.dateRangeDataArray);
    this.dialogRef.close(this.dateRangeDataArray);
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };
}

@Component({
  selector: "dialog-time-interval-dialog",
  templateUrl: "time-interval-dialog.html"
})
export class DialogTimeIntervalDialog implements OnInit {
  TimeIntervalFormData: FormGroup;
  timeIntervalData: TimeInterval;
  timeIntervalDataArray: TimeInterval[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogTimeIntervalDialog> // , // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.TimeIntervalFormData = this.formBuilder.group({
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
      timeInterval: ["", Validators.required]
    });
  }
  addTimeInterval() {
    const timeIntervalDataValues = this.TimeIntervalFormData.value;
    this.timeIntervalData = new TimeInterval(
      timeIntervalDataValues.startTime,
      timeIntervalDataValues.endTime,
      timeIntervalDataValues.timeInterval
    );
    this.timeIntervalDataArray.push(this.timeIntervalData);
    this.TimeIntervalFormData.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  saveDialogData() {
    this.addTimeInterval();
    console.log("Time Interval Array: " + this.timeIntervalDataArray);
    this.dialogRef.close(this.timeIntervalDataArray);
    this.timeIntervalDataArray = [];
  }
}
