import { Pipe, PipeTransform } from "@angular/core";
import { Group } from "../models-group/group";

@Pipe({
  name: "groupFilter"
})
export class GroupFilterPipe implements PipeTransform {
  transform(items: Group[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(group => {
      if (group.name.toLowerCase().includes(searchText)) {
        return group.name.toLowerCase().includes(searchText);
      } else if (group.description.toLowerCase().includes(searchText)) {
        return group.description.toLowerCase().includes(searchText);
      }
    });
  }
}
