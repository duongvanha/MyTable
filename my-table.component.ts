import {Directive, Input, OnChanges, SimpleChanges, Component, forwardRef} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Directive({
  selector: 'table[Data]',
  exportAs: 'MyDataTable'
})
export class MyTable implements OnChanges {

  public data: any[] = [];
  public length: number = 0;
  @Input("Data") public inputData: any[] = [];
  @Input("ActivePage") public activePage = 1;
  @Input("RowsOnPage") public rowsOnPage = 5;
  @Input("SortBy") public sortBy: string = "";
  @Input("SortOrder") public sortOrder = "asc";
  @Input("StringSearch") public search = "";


  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.Change();
  }

  private Change() {
    this.data = this.inputData;
    this.DoSeach();
    this.DoFilter();
    this.DoPaginator();
  }

  setSort(sortBy: string, sortOrder: string) {
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.Change();
  }

  DoFilter(): void {
    if (this.inputData && this.sortBy && this.sortBy.length) {
      this.data = this.data.sort((a, b) => {
        var rowpre = (a[this.sortBy]) ? a[this.sortBy].toString().toUpperCase() : "";
        var rowNext = (b[this.sortBy]) ? b[this.sortBy].toString().toUpperCase() : "";
        if (this.sortOrder == "asc") {
          if (rowpre < rowNext) {
            return -1;
          }
          if (rowpre > rowNext) {
            return 1;
          }
        } else {
          if (rowpre > rowNext) {
            return -1;
          }
          if (rowpre < rowNext) {
            return 1;
          }
        }
        return 0;
      });
    }
  }

  DoPaginator() {
    if (this.data && this.activePage && this.rowsOnPage) {
      this.length = Math.ceil(this.data.length / this.rowsOnPage);
      this.data = this.data.slice((this.activePage - 1) * this.rowsOnPage, this.rowsOnPage * this.activePage);
    }
  }

  DoSeach() {
    var NameFilters = [];
    if (this.search && this.inputData && this.inputData[0]) {
      for (let variable in this.inputData[0]) {
        NameFilters.push(variable);
      }
      this.data = this.inputData.filter((row: any) => {
        for (let i = 0; i < NameFilters.length; i++) {
          if (row[NameFilters[i]] && row[NameFilters[i]].toString().toUpperCase().indexOf(this.search.toUpperCase()) > -1) return true;
        }
        return false;
      });
    }
  }
}

@Component({
  selector: 'TableSort',
  template: `
  <a style="cursor: pointer;display: block" (click)="sort()" >
  <ng-content></ng-content>
</a>
`
})
export class TableSort implements Component {
  @Input("by") sortBy: string;

  isSortedByMeAsc: boolean = false;

  public constructor(private mfTable: MyTable) {
  }

  sort() {
    if (this.isSortedByMeAsc) {
      this.mfTable.setSort(this.sortBy, "desc");
    } else {
      this.mfTable.setSort(this.sortBy, "asc");
    }
    this.isSortedByMeAsc = !this.isSortedByMeAsc;
  }
}

@Component({
  "selector": "Pagination",
  template: `
<div class="dataTables_paginate paging_simple_numbers" >
    <ul class="pagination">
      <li class="paginate_button" [ngClass]="{disabled: activatePage==1}" ><a href="#" (click)="setPage(activatePage-1)" >Trước</a></li>
      <li class="paginate_button" *ngFor="let item of Length" [ngClass]="{active: activatePage==item}" ><a (click)="setPage(item)" href="#" >{{item}}</a></li>
      <li class="paginate_button" [ngClass]="{disabled: activatePage==total}" ><a (click)="setPage(activatePage+1)"  href="#">Tiếp</a></li>
    </ul>
  </div>
`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Pagination),
    multi: true
  }]
})
export class Pagination implements ControlValueAccessor,OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.change();
  }

  private Length: number[] = [];
  private activatePage: number = 0;
  private OnChange: any;
  @Input("total") total: number = 0;

  get value() {
    return this.activatePage;
  }

  private change() {
    this.Length = [];
    if (this.activatePage < 3)
      for (let i = 1; i <= this.total && i <= 5; i++) {
        this.Length.push(i);
      }
    else
      for (let i = this.activatePage - 2; i <= this.total && i < this.activatePage + 3; i++) {
        this.Length.push(i);
      }
  }

  set value(val) {
    this.activatePage = val;
    this.OnChange(val);
  }

  setPage(page) {
    if (page > 0 && page <= this.total) {
      this.activatePage = page;
      this.change();
      this.OnChange(this.activatePage);
    }
    return false;
  }

  writeValue(obj: any): void {
    if (obj !== this.activatePage) {
      this.activatePage = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.OnChange = fn;
  }

  registerOnTouched(fn: any): void {
  }
}
