import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataStorageService } from "../../shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: 'app-upload-courses',
  templateUrl: './upload-courses.component.html',
  styleUrls: ['./upload-courses.component.css']
})
export class UploadCoursesComponent implements OnInit {

  uploadForm: FormGroup;
  validFileExtensions: string[] = ["xlsx", "csv"];
  invalidExtension: string;
  isInvalid: boolean = false;

  selectedFiles: FileList;
  currentFileUpload: File;

  currentRole: string;

  majors: string[] = [
    "Accounting",
    "Agribusiness",
    "Art",
    "Atmospheric Science",
    "Biology",
    "Business",
    "Communication",
    "Computer Information Systems",
    "Computer Science",
    "Construction Management",
    "Counseling",
    "Criminal Justice",
    "Dental Hygiene",
    "Education: Curriculum and Instruction",
    "Educational Leadership",
    "English",
    "Finance",
    "General Studies",
    "Gerontology",
    "Health Studies",
    "History",
    "Kinesiology",
    "Management",
    "Marketing",
    "Marriage & Family Therapy",
    "Mathematics",
    "Medical Laboratory Science",
    "Music",
    "Nursing",
    "Occupational Therapy",
    "Pharmacy",
    "Political Science",
    "Psychology",
    "Radiologic Technology",
    "Risk Management & Insurance",
    "Social Work",
    "Speech-Language Pathology",
    "Toxicology",
    "Unmanned Aircraft Systems Management",
    "World Langauges: French",
    "World Langauges: Spanish"
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dataStorage: DataStorageService,
    private role: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentRole = this.role.user;
    console.log(this.role.user);
    this.uploadForm = this.formBuilder.group({
      uploadFile: [undefined, [Validators.required]],
      major: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.isInvalid) {
      this.invalidExtension = "not supported file type!!!";
    } else {
      console.log("submitted");
      this.currentFileUpload = this.selectedFiles.item(0);
      console.log(this.currentFileUpload);

      // this.dataStorage
      //   .addCourses(this.currentFileUpload)
      //   .subscribe(result => {
      //     console.log(result);
      //     if (result.status === 201) {
      //       let snackBarRef = this._snackBar.open(
      //         "All users are successfully registered!!!",
      //         "close",
      //         { duration: 10000, panelClass: ["standard"] }
      //       );
      //       snackBarRef
      //         .onAction()
      //         .subscribe(() => this.router.navigate(["/home/admin"]));
      //       // this.groupDetailDataShare.passSharedMessage(result.message);
      //       // this._snackBar.openFromComponent(SnackBarGroup, {
      //       //   duration: 5000
      //       // });
      //     }
      //   });
      this.router.navigate(["/home/admin"]);
    }
  }

  upload(event: any) {
    this.selectedFiles = event.target.files;
    this.isInvalid = false;
    //check file is valid
    if (!this.validateFile(this.selectedFiles[0].name)) {
      this.isInvalid = true;
      // console.log('Selected file format is not supported');
      // this.invalidExtension = "not supported file type!!!";
      console.log(this.invalidExtension);
      // return this.invalidExtension;
      // return this.isInvalid;
    }
  }

  validateFile(name: String) {
    var fileExt = name.substring(name.lastIndexOf(".") + 1);
    console.log("Input files extension: " + fileExt);
    for (let ext of this.validFileExtensions) {
      if (fileExt.toLowerCase() == ext) {
        return true;
      }
    }
    return false;
  }

}
