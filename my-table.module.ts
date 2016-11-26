import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MyTable, TableSort, Pagination} from "./my-table.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MyTable,
    TableSort,
    Pagination
  ],
  exports: [
    MyTable,
    TableSort,
    Pagination
  ]
})
export class MyTableModule {
}
