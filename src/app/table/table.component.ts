import {Component, OnInit, ViewChild} from '@angular/core';
import {ToDo} from '../models/to-do';
import {ToDoService} from '../services/to-do.service';
import {MatTableDataSource} from '@angular/material/table';
import {User} from '../models/user';
import {UserService} from '../services/user.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from './dialog/dialog.component';
import {MatSort} from '@angular/material/sort';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [ToDoService]
})

export class TableComponent implements OnInit {

  toDos: ToDo[];
  users: User[];
  displayedColumns: string[] = ['#', 'title', 'assignee', 'completed', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor (
    private toDoService: ToDoService,
    private userService: UserService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getTodos();
  }

  getTodos() {
    this.spinner.show();
    this.toDoService.getToDos().subscribe(data => {
      this.spinner.hide();
      this.toDos = data;
      this.getUsers();
      this.dataSource = new MatTableDataSource(this.toDos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getUsers() {
    this.spinner.show();
    this.userService.getUsers().subscribe(data => {
      this.spinner.hide();
      this.users = data;
      this.getAssigned();
    });
  }

  delete(id) {
    this.spinner.show();
    this.toDoService.deleteToDo(id).subscribe(data => {
      this.spinner.hide();
      const position = this.toDos.findIndex(toDo => toDo.id == id);
      const deletingTitle = this.toDos[position].title;
      this.toDos.splice(position, 1);
      this.openSnackBar(deletingTitle + ' Deleted');
      this.dataSource = new MatTableDataSource(this.toDos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.spinner.hide();
      this.openSnackBar("Error");
    });
  }

  openDialog(element: ToDo) {
    const editedToDo: ToDo = {
      ...element
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '280px',
      data: {todo: editedToDo}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && (editedToDo.completed != element.completed || editedToDo.title != element.title)) {
        this.spinner.show();
        this.toDoService.editTodo(editedToDo).subscribe(response => {
          this.spinner.hide();
          element.title = response.title;
          element.completed = response.completed;
          this.openSnackBar("Editing Success");
        }, error => {
          this.spinner.hide();
          this.openSnackBar("Error Editing");
        });
      }
    });
  }

  getAssigned() {
    this.toDos.filter(todo => {
      todo.user = this.users.find(user => user.id == todo.userId);
    });
  }

  openSnackBar(title: string) {
    this.snackBar.open(title, '', {
      duration: 2000,
    });
  }
}
