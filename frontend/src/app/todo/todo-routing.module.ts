/**
 * The Todo Routing Module holds all of the routes that are children
 * to the path /todo/...
 *
 * @author Ajay Gandecha, Jade Keegan
 * @copyright 2024
 * @license MIT
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoPageComponent } from './todo-page/todo-page.component';

const routes: Routes = [TodoPageComponent.Route];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule {}
