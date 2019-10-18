import { Component, OnInit, Input, Inject } from "@angular/core";
import { Calendar } from "../calendar.model";
import { CalendarService } from "../calendar.service";
import { AuthService } from "src/app/auth/auth.service";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl } from "@angular/forms";
import { ShareCalendarComponent } from "../../share-calendar/share-calendar.component";

@Component({
  selector: "app-calendar-item",
  templateUrl: "./calendar-item.component.html",
  styleUrls: ["./calendar-item.component.css"]
})
export class CalendarItemComponent implements OnInit {
  @Input() index: number; //index of calendar in list
  @Input() calendar: Calendar; //calendar object to show
  checked = true;
  username;

  constructor(
    private calService: CalendarService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log(this.calendar);
    this.username = this.authService.username;
  }

  toggleCal() {
    this.calService.toggleCalendar(this.calendar);
  }

  deleteCal() {
    this.dialog.open(DeleteConfirm, {
      width: "250px"
    });
  }

  renameCal() {
    this.dialog.open(CalRename, {
      width: "500px",
      data: this.calendar
    });
  }

  shareCal() {
    this.dialog.open(ShareCalendarComponent, {
      width: "500px",
      data: this.calendar
    });
  }
}

@Component({
  selector: "app-cal-rename",
  templateUrl: "cal-rename.html",
  styleUrls: ["calendar-item.component.css"]
})
export class CalRename implements OnInit {
  nameForm: FormGroup;
  cal: Calendar;
  constructor(
    private ref: MatDialogRef<CalRename>,
    @Inject(MAT_DIALOG_DATA) public data: Calendar
  ) {}
  ngOnInit() {
    this.nameForm = new FormGroup({
      name: new FormControl()
    });
    this.cal = this.data;
  }
  onSubmit() {
    const obj = {
      name: this.nameForm.value["name"]
    };
    console.log(obj);
  }

  close() {
    this.ref.close();
  }
}

@Component({
  selector: "app-delete-confirm",
  templateUrl: "delete-confirm.html",
  styleUrls: ["calendar-item.component.css"]
})
export class DeleteConfirm {
  constructor(private ref: MatDialogRef<DeleteConfirm>) {}

  close() {
    this.ref.close();
  }

  ngOnInit() {}
}
