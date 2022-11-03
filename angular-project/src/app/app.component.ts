import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AppComponent {

  @ViewChild('outerSort', { static: true })
  sort: MatSort = new MatSort;
  @ViewChildren('innerSort')
  innerSort!: QueryList<MatSort>;
  @ViewChildren('innerTables')
  innerTables!: QueryList<MatTable<Descendedent>>;

  dataSource!: MatTableDataSource<User>;
  usersData: User[] = [];
  columnsToDisplay = COLUMNS_SCHEMA.map((column) => column.key);
  innerDisplayedColumns = COLUMNS_SCHEMA.map((column) => column.key).flat();
  // innerDisplayedColumns = USERS.map(_column => COLUMNS_SCHEMA.map(descendedent => ({_column.key}))).flat();
  columnsSchema: any = COLUMNS_SCHEMA;
  expandedElement!: User | null;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  addRow() {
    const newRow = {
      id: Date.now(),
      name: '',
      description: '',
      dateOfProject: "",
      maxDuration: 0,
      bdStart: '09:00',
      workingMinutes: 0,
      isEdit: true,
    };
    this.usersData = [newRow, ...this.usersData];
  }
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit() {
    USERS.forEach(user => {
      if (user.descendedents && Array.isArray(user.descendedents) && user.descendedents.length) {
        this.usersData = [...this.usersData, {...user, descendedents: new MatTableDataSource(user.descendedents)}];
      } else {
        this.usersData = [...this.usersData, user];
      }
    });
    this.dataSource = new MatTableDataSource(this.usersData);
    this.dataSource.sort = this.sort;
  }

  toggleRow(element: User) {
    element.descendedents && (element.descendedents as MatTableDataSource<Descendedent>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Descendedent>).sort = this.innerSort.toArray()[index]);
  }
}

export interface User {
  name: string;
  description: string;
  dateOfProject: string;
  maxDuration: number;
  bdStart: string;
  workingMinutes: number,
  descendedents?: Descendedent[] | MatTableDataSource<Descendedent>;
}

export interface Descendedent {
  name: string;
  description: string;
  dateOfProject: string;
  maxDuration: number;
  bdStart: string;
  workingMinutes: number,
}

export interface UserDataSource {
  name: string;
  description: string;
  dateOfProject: string;
  maxDuration: number;
  bdStart: string;
  workingMinutes: number,
  descendedents?: MatTableDataSource<Descendedent>;
}

const USERS: User[] = [
  {
    name: "Sample",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    dateOfProject: "'00-00-0000','00-00-0000'",
    maxDuration: 0,
    bdStart: "09:00",
    workingMinutes: 0,
    descendedents: [
      {
        name: "Test",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        dateOfProject: "'00-00-0000','00-00-0000'",
        maxDuration: 0,
        bdStart: "09:00",
        workingMinutes: 0,
      },
      {
        name: "My Dog",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        dateOfProject: "'00-00-0000','00-00-0000'",
        maxDuration: 0,
        bdStart: "09:00",
        workingMinutes: 0,
      }
    ]
  },
  {
    name: "My Cat",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    dateOfProject: "'00-00-0000','00-00-0000'",
    maxDuration: 0,
    bdStart: "09:00",
    workingMinutes: 0,
  },
  {
    name: "Woof-woof",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    dateOfProject: "'00-00-0000','00-00-0000'",
    maxDuration: 0,
    bdStart: "09:00",
    workingMinutes: 0,
    descendedents: [
      {
        name: "Jesse Pinkman",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        dateOfProject: "'00-00-0000','00-00-0000'",
        maxDuration: 0,
        bdStart: "09:00",
        workingMinutes: 0,
      },
      {
        name: "JSON",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        dateOfProject: "'00-00-0000','00-00-0000'",
        maxDuration: 0,
        bdStart: "09:00",
        workingMinutes: 0,
      }
    ]
  },
];

const COLUMNS_SCHEMA = [
  {
    key: 'name',
    type: 'text',
    label: 'Projektname',
  },
  {
    key: 'description',
    type: 'textarea',
    label: 'Projektbeschreibung',
  },
  {
    key: 'dateOfProject',
    type: 'date',
    label: 'Projektstart und Projektende',
  },
  {
    key: 'maxDuration',
    type: 'number',
    label: 'Maximale Projektdauer (in Min):',
  },
  {
    key: 'bdStart',
    type: 'time',
    label: 'Täglicher Arbeitsstart:',
  },
  {
    key: 'workingMinutes',
    type: 'number',
    label: 'Tägliche Arbeitszeit (in Min):',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  }
]

