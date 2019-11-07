export class Group {
  public id: number;
  public name: string;
  public description: string;
  public recepients: string[];
  public groupType: string;
  public semesterTerm: string;
  public semesterYear: number;

  constructor(
    id: number,
    name: string,
    desc: string,
    emails: string[],
    groupType: string,
    semesterTerm: string,
    semesterYear: number
  ) {
    this.id = id;
    this.name = name;
    this.description = desc;
    this.recepients = emails;
    this.groupType = groupType;
    this.semesterTerm = semesterTerm;
    this.semesterYear = semesterYear;
  }
}
