/**
 * The To-Do Service abstracts business logic from the components.
 *
 * @author Ajay Gandecha, Jade Keegan
 * @copyright 2024
 * @license MIT
 */

import { Injectable, WritableSignal, signal } from '@angular/core';

import { ToDoListItem } from './todo.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  /** Encapsulates a reactive list of to-do items. */
  todoList: WritableSignal<ToDoListItem[]> = signal([]);

  constructor(protected http: HttpClient) {}

  /**
   * Retrieves all of the todo items from the database.
   */
  getItems() {
    this.http.get<ToDoListItem[]>(`/api/todo`).subscribe({
      next: (items) => this.todoList.set(items),
      error: (err) => console.log(err)
    });
  }
  /**
   * Adds a new item to the to-do list.
   * @param item: Item to add to the to-do list.
   */
  addItem(title: string) {
    // Create the new item object and store it in a variable.
    const newItem: ToDoListItem = {
      id: null, // Note: This can be left as null - the backend will take care of this for us.
      title: title,
      completed: false
    };

    // TODO: Using the `http` HttpClient, call the appropriate
    // API to add a todo item for the user.
    //
    // This API call should return an `Observable` object.
    // Subscribe to the observable, and with the observable's
    // result, modify the exising `todoList` `WritableSignal`
    // object to include the newly added item. You may refer
    // to your ex02 solution to see how you modified the data
    // of the signal.
    //
    // Feel free to use the completed `getItems()` method as
    // a guide.
    console.log(this.todoList());
    this.http.post<ToDoListItem>('/api/todo', newItem).subscribe({
      next: (item) => {
        const updatedList = [...this.todoList(), item];
        this.todoList.set(updatedList);
      },
      error: (err) => console.log(err)
    });
    console.log(this.todoList());
  }

  /**
   * Updates an item by check marking it.
   * @param item: Item to toggle the checkmark status for.
   */
  toggleItemCheckmark(item: ToDoListItem) {
    // TODO: Using the `http` HttpClient, call the appropriate
    // API to toggle the checkmark of an item for the user.
    //
    // This API call should return an `Observable` object.
    // Subscribe to the observable, and with the observable's
    // result, modify the exising `todoList` `WritableSignal`
    // object to include the newly modified item. You may refer
    // to your ex02 solution to see how you modified the data
    // of the signal.
    //
    // Feel free to use the completed `getItems()` method as
    // a guide.
    console.log(item.completed);
    item.completed = !item.completed;
    this.http.put<ToDoListItem[]>('/api/todo/${item.id}', item).subscribe({
      next: (uItems) => this.todoList.set(uItems),
      error: (err) => console.log(err)
    });
    console.log(item.completed);
  }

  /**
   * Deletes an item from the to-do list.
   * @param item:  Item to delete.
   */
  deleteItem(item: ToDoListItem) {
    // TODO: Using the `http` HttpClient, call the appropriate
    // API to toggle the delete an item item for the user. Note that
    // the delete API accepts the item ID.
    //
    // This API call should return an `Observable` object.
    // Subscribe to the observable, using the `item` parameter,
    // modify the `todoList` `WritableSignal` to exclude this item.
    // You may refer  to your ex02 solution to see how you modified
    // the data of the signal.
    //
    // Feel free to use the completed `getItems()` method as
    // a guide.
    console.log(this.todoList);
    this.http.delete<ToDoListItem[]>('/api/todo' + item.id).subscribe({
      next: (items) => this.todoList.set(items),
      error: (err) => console.log(err)
    });
    console.log(this.todoList);
  }
}
