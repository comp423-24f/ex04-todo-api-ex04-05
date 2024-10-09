/**
 * The Todo Page Component displays the user's todo list, and allows
 * users to create and delete to-do list items.
 *
 * @author Ajay Gandecha, Jade Keegan
 * @copyright 2024
 * @license MIT
 */

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TodoService } from '../todo.service';
import { ToDoListItem } from '../todo.model';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.css'
})
export class TodoPageComponent {
  /** Route information to be used in To-Do Routing Module */
  public static Route = {
    path: '',
    title: 'My To-Dos',
    component: TodoPageComponent
  };

  /**
   * Encapsulates the form control for creating a new to-do list item.
   *
   * Form controls are TypeScript objects that bind to Angular form fields.
   * This enables us to access what the user types into a form field from
   * the TypeScript file.
   */
  newItemFormControl = new FormControl<string>('');

  /**
   * Constructor that runs when the component is created.
   * The constructor also defines fields provided via
   * dependency injection.
   */
  constructor(protected todoService: TodoService) {
    // TODO: Make sure that the service's todo item list is up to date.
    todoService.getItems();
  }

  /** Adds a new item to the to-do list based on the string typed in. */
  addNewItem() {
    // Retrieve the text inputted into the form control.
    const newItemTitle = this.newItemFormControl.value;
    // Use the service to create a new to-do list item, if the title
    // is not null and if it is not empty.
    if (newItemTitle && newItemTitle.length > 0) {
      // console.log('made it to add new item in component.');
      this.todoService.addItem(newItemTitle);
      console.log(this.todoService.todoList());
    }
  }

  /**
   * Toggles the checkmark for the inputted item.
   * @param item: Item to toggle the checkmark for.
   */
  checkmarkPressed(item: ToDoListItem) {
    // Call the appropriate service method to checkmark the item.
    this.todoService.toggleItemCheckmark(item);
  }

  /**
   * Deletes an item from the todo list.
   * @param item: Item to delete.
   */
  deleteItem(item: ToDoListItem) {
    // Call the appropriate service method to delete the item.
    this.todoService.deleteItem(item);
  }
}
