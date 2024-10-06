/**
 * The Todo Models define the shape of data
 * used within the Todo list feature.
 *
 * @author Ajay Gandecha, Jade Keegan
 * @copyright 2024
 * @license MIT
 */

export interface ToDoListItem {
  id: number | null;
  title: string;
  completed: boolean;
}
