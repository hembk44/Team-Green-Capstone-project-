import { MatDialogRef, MatDialog } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    selector: "group-selection",
    templateUrl: "group-selection.html",
    styleUrls: ["./group-selection.css"]
})
export class GroupSelection{
    constructor(
        private ref: MatDialogRef<GroupSelection>,
        private dialog: MatDialog,
    ){}
}