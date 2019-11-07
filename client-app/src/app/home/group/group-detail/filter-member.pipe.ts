import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterMember"
})
export class FilterMemberPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(group => {
      if (group.name.toLowerCase().includes(searchText)) {
        return group.name.toLowerCase().includes(searchText);
      } else if (group.email.toLowerCase().includes(searchText)) {
        return group.email.toLowerCase().includes(searchText);
      }
    });
  }
}
