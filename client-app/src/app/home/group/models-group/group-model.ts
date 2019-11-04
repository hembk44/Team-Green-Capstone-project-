export class GroupModel {
  public id: number;
  public name: string;
  public description: string;
  public recepients: string[];

  constructor(id: number, name: string, desc: string, email: string[]) {
    this.id = id;
    this.name = name;
    this.description = desc;
    this.recepients = email;
  }
}
