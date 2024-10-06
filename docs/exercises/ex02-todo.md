# EX02: Getting Started

> Written by Jade Keegan and Ajay Gandecha for the CSXL Web Application, with excerpts from the official [Angular dev tutorial](https://angular.dev/tutorials/learn-angular/1-components-in-angular).<br> _Last Updated: 09/13/2024_

Welcome to COMP 423 - Foundations of Software Engineering! The goal of this first assignment is to help you get acclimated to Angular and TypeScript as a framework, as well as the general structure of and best practices for the CSXL repository. To do this, we will be guiding you through the creation of a simple "To-Do List" component for the CSXL website.

Although the assignment itself is unique to our course, the content will loosely follow [Angular's official "Getting Started" tutorial](https://angular.dev/tutorials/learn-angular/1-components-in-angular) and draw from the [official Angular documentation](https://angular.dev/overview). Text used from this tutorial/docs will be indicated in blockquotes.

While our TAs are happy to assist as needed in Office Hours, we also highly recommend that you search the documentation links provided first! Being able to parse through and understand docs is an important skill to practice as a software engineer. We also recommend that you seek out documentation for other concepts we don't explicitly describe/link to. Angular's documentation is very well-written and quite thorough!

Now, let's get started!

## Set Up

Please be sure to follow these steps very carefully! It is important that you get this set up right to ensure you can complete the assignment.

1. Clone the assignment repository (link TBA) through Github.
2. Open the repository in VSCode.
3. In the `workspace/docs` folder, you will find a file called `get_started.md`. Please follow the instructions in this file to set up your Docker environment.
   * The most important step is to go into the existing `workspace/backend` folder and create the `.env` file. Otherwise, your Dev Container will not load.
   * Note that it may take a while initially to build the Dev Container since this is your first time setting up the container, so don't be worried if it takes several minutes!
4. Once your container builds, be sure to also run `honcho start` and open `localhost:1560` in your browser to view the application if you haven't already.

_Note_: If you completely close VSCode while working on the assignment over a few days, you may need to repeat the `npm install` step and backend reset.

## General Exercise Information

### Commit Expectations

We expect you to commit after completing "significant" pieces of functionality. For this assignment, we will explicitly describe when and what you need to commit so you can get a feel for standard commit practice. You may add extra commits if you wish to, but you must have the commits from the write up at minimum.

In the future, we won't expect specific commits as we will not tell you where to commit, but we will still ensure that good practices are followed.

If you need a refresher on how to commit code, read the basic steps below:

1. `git add .`
2. `git commit -m "Write commit message here"`

### GPT/AI Usage Policy

We highly discourage you from using ChatGPT or other AI assistants when working on this assignment. While it is okay to use AI for conceptual questions, we recommend that you practice your ability to find and understand documentation on your own - ChatGPT is sometimes inaccurate, and it often doesn't have knowledge of the design patterns we prefer you to use.

Aside from conceptual help, however, you should _not_ use code sourced from ChatGPT/AI, as this is an Academic Honor Violation. _All code written must be your original work._

## Step 1: Understanding the Existing To-Do Page Component

Open the `todo/todo-page/todo-page.component.ts` file. This is a _component_.

> Components are the foundational building blocks for any Angular application. Each component has three parts:
>
> - TypeScript class
> - HTML template
> - CSS styles

The TypeScript class contains functionality and dependencies for your file. In a very basic way, it's similar to the Java classes you created in COMP 301, which contained variables and methods to be used for your "features".

The HTML template contains the structure of the web page, while the CSS styles sheet contains the styling of the page.

### Component Decorator

In our file, after the import statements (which allow you to use functionality from other files in the directory), you will notice the following code:

```
@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.css'
})
```

> [This] marks a class as an Angular component and provides configuration metadata that determines how the component should be processed, instantiated, and used at runtime.

The `templateUrl` corresponds to the path to the HTML template file. The `styleUrl` contains the path(s) to the CSS stylesheets. Remember, if you do not link your HTML/CSS files through this decorator, they will not be attached to the component!

### Routing

Inside the component class, you will see the following route defined:

```
public static Route = {
  path: '',
  title: 'My To-Dos',
  component: TodoPageComponent
};
```

This route defines how you access the component in the web application. The `path` corresponds to the URL that attached to the base routes. The `component` corresponds to the component (along with the HTML/CSS attached with it) that you want to display when you navigate to this route. The `title` is not a necessary property on a route, but it allows you to give names that can appear in the application when you navigate to a certain component.

On your localhost navigate to the empty To-Do Page (which corresponds to the component you currently have opened) using the button on the side menu. You will notice that the URL is `/todo` rather than nothing, as the empty `path` in our defined route may suggest. This is because we have a "base" route defined in a separate file!

If you go to the `app-routing.module.ts` file and scroll down a bit, you will see the following code:

```
{
  path: 'todo',
  title: 'To-Do',
  loadChildren: () => import('./todo/todo.module').then((m) => m.TodoModule)
}
```

You will see here that this file loads the todo module and each of its children under the `path` "todo". It is necessary that routes are defined in this `app-routing` module, but Angular allows you to establish "child" routing modules to better abstract features from one another. More on this in future assignments once we add more components for this To-Do List feature!

### Form Control

The final bit of code we would like to explain is the Form Control.

```
newItemFormControl = new FormControl<string>('');
```

This Form Control property will be linked to the `mat-form-field` in the To-Do Page HTML file.

> Tracks the value and validation status of an individual form control.`FormControl` takes a single generic argument, which describes the type of its value.

### Constructor

Similar to Java, Angular classes also use a `constructor` that runs when the component is created.

```
constructor(protected todoService: TodoService) {}
```

The constructor for the To-Do Page doesn't contain any functionality inside it, but it _DOES_ inject the todoService for use throughout the component via "dependency injection". This is the preferred way to access methods from our service. Methods can be called from the service using dot notation: `this.todoService.method()`.

## Step 2: Understanding the To-Do Service

Before you begin writing code, it's important to understand the other half of Angular components as we write them: Services.

Services contain business logic that may be shared across many components through dependency injection.

To begin, open the the `todo.service.ts` file.

### Injectable Decorator

Similar to the component, our service contains a decorator as well.

```
@Injectable({
  providedIn: 'root'
})
```

> [This] marks a class as available to be provided and injected as a dependency.

### Writable Signal

As indicated in the TODO comment, we would like you to use a `WritableSignal`. Please refer back to the [documentation](https://angular.dev/guide/signals) and reading on writable signals if you are unsure how to set this up!

### Current Index

We will use the current index as a unique identifier for each to-do list item. This also simulates how databases often manage item entries (more on this in later exercises).

While most databases have an "auto-increment" functionality for numerical indices such that adding an item automatically increases the index, we don't have that on the frontend. So, be sure to increment this value so it can be used to access items in our list properly!

_Note:_ We cannot use the length of the list as an indicator of the max index, as we may remove items from the to-do list.

## Step 3: Model the Data

Before you begin implementing the To-Do list feature, it is important to model the data you will be working with using TypeScript interfaces. Refer back to the reading about interfaces if you feel uncertain about this concept!

Navigate to the `todo.model.ts` file. Complete the TODO in this file to implement the `ToDoListItem` interface.

If you want to read more about interfaces in Typescript, you can start with the official documentation [linked here](https://www.typescriptlang.org/docs/handbook/2/objects.html).

### _COMMIT!_

Add a commit message with the following text: "Implement ToDoListItem interface".

## Step 4: Implement Functionality to Add To-Do List Items

A good practice when it comes to implementing functionality for a feature is completing each piece "atomically" and testing after you complete each piece, rather than creating each file in isolation. For a feature such as a To-Do list, a natural division is to treat each basic CRUD (create/read/update/delete) as an individual task.

We will start with "create", or adding to the to-do list!

### Service Method

In the `todo.service.ts` file, first complete the TODO for the Writable Signal discussed in Step 3. 

Then, find the method titled `addItem`. Read the docstring/TODO comments and complete the method accordingly. Remember, the To-Do item you add to your list should be modeled after the `ToDoListItem`.

### Component Method

Go to the `todo-page.component.ts` file. Follow the TODO comments in the `addNewItem` method. Remember, the service method we created takes in the title of the To-Do item as a parameter, so you will need to retrieve that from the form control in order to pass it into service.

Refer back [Step 1](#step-1-understanding-the-existing-to-do-page-component) if you need a refresher on how the component works.

### HTML Template

At the bottom of the `todo-page.component.ts` file, you will see a `mat-form-field` with the label "New To-Do item" and a `button` with the text "Add To-Do". On that button, as the comment recommends, you must add `(click)` event handler to call the method to add a new item to your To-Do list.

#### Form Control Property Binding

When implementing the `mat-form-field` functionality, you must use "property binding", as the comment mentions.

Below is a brief description of this concept. For further information, feel free to read the [documentation linked here](https://angular.dev/guide/templates/property-binding).

> Property binding in Angular enables you to set values for properties of HTML elements, Angular components and more.
>
> Use property binding to dynamically set values for properties and attributes. You can do things such as toggle button features, set image paths programmatically, and share values between components.

#### Click Handling

If you would like more information about how the `(click)` event binding works, read the [documentation linked here](https://angular.dev/guide/templates/event-binding).

Finally, if you have never worked with HTML before, be sure to skim this [documentation](https://developer.mozilla.org/en-US/docs/Web/HTML).

### Test Your Code

Now, you can test the new functionality you just added! However, we currently only have one piece of the To-Do list application created, so we aren't able to see the To-Do list item when its added. So, how do we test?

Similar to other languages' `print` statements, TypeScript has `console.log` statements that are useful for debugging and low-level testing. Instead of viewing these in the terminal you view them on the `localhost` server. On the server, open the dev tools by right-clicking and inspecting. Click on the "Console" tab. This is where `console.log` statements will be printed out!

We recommend adding `console.log(this.todoList());` at the end of the `addItem` service method to test functionality. After you click your `add` button, check to make sure that the todoList is accurate and includes your new item and any other existing items.

If the list seems accurate after some testing, you can now be fairly certain that your add functionality works! Remember that this is low-level, manual testing, though. So, if you find issues testing other functions further down the road, don't completely disregard the possibility of the source being previous functionality!

### _COMMIT!_

Add a commit message with the following text: "Implement functionality to add to-do list items".

### Further Debugging Suggestions

If something isn't working as expected, check out the suggestions for "standard" debug statement locations below.

In the `addNewItem` method in the component file, you may add `console.log` statements in the following places listed below to debug:

- **Beginning of the Method:** `console.log('addNewItem Method Called);`
  - This will indicate that the method has been called. If this is logged, you know that your `(click)` handling is working as expected!
- **After Retrieving To-Do item Text:** `console.log('newItemTitle:', newItemTitle);`
  - This will log out the value of the `newItemTitle` variable you created. It can be used to confirm that you are retrieving the form control value correctly.
- **After Checking Conditions for Title:** `console.log('title condition passed')`
  - This will confirm that the title is valid and that the service method was called.
- **After Calling the Service:** `console.log('service method called')`
  - If this is logged, it confirms that the service method was fully executed.

You can add similar `console.log` statements in the `addItem` service method to check stages of execution and variable values if necessary.

## Step 5: Implement Functionality to Read/View To-Do List Items

Next, you should create a way to view existing To-Do list items. Unlike the add functionality, view does not explicitly require any service methods to be implemented due to our use of signals. Instead, simply go to the HTML file and complete the `mat-list`.

### @for and @empty Blocks

Inside the `mat-list`, we suggest you use `@for` and `@empty` to loop through the To-Do list to display each item. Check out the [documentation linked here](https://angular.dev/api/core/@for) if you would like to view examples of how to use these blocks.

### Material UI Components

Further, now that you are looking at more of the HTML template, you may notice that there are many elements with the `mat` prefix on them. These are Material UI components, which are special pre-built, pre-styled HTML elements that we can use in our HTML.

While some applications manually create each UI element using standard HTML, our repository prefers to _always_ use these existing Material UI components for consistency in styling. We have set up the file such that you do not need to build any HTML as we would like to focus on teaching you functionality. However, in the future using MatUI components will be a graded requirement, so be sure to look into the [documentation](https://material.angular.io/components/categories) surrounding them.

### _COMMIT!_

Add a commit message with the following text: "Implement functionality to view to-do list items".

## Step 6: Implement the Functionality to Update and Delete To-Do List Items

Finally, go through each file and follow the TODO comments to add the update and delete functionality. While you don't necessarily need to follow the exact order we used in Step 5, you should implement and test each fully before moving on to the next function. Be sure to **_COMMIT_** after you finish implementing each.

### _COMMIT!_

For update, add a commit message with the following text: "Implement functionality to update to-do list items".

For delete, add a commit message with the following text: "Implement functionality to delete to-do list items".

## Step 7: Style the Component

The last step is to style the To-Do page! If you run the localhost right now, you'll find that the page is functional, but quite poorly organized.

Basic styling to ensure that the page is somewhat user friendly is a requirement. UX is an important aspect of web development that is sometimes forgotten in favor of pure functionality!

For this first assignment, we won't be too strict about styling - just format the page so it makes _sense_. However, we highly recommend that you put some effort into styling if you have time, especially if you have little experience with CSS, as it will be considered more heavily in the future.

We recommend running simple Google searches for specific styling needs (CSS can be quite expansive!), but [here](https://developer.mozilla.org/en-US/docs/Web/CSS) is some documentation that may be useful as a starting point.

### _COMMIT!_

This commit isn't necessary if you decided to do your basic styling after you finished each part of the HTML template.

Otherwise, add the following commit message: "Style to-do list component".

## Step 8: View Your Work!

Congratulations!! You just created your first Angular feature in the CSXL repository! Play around with the feature and admire your work. :D

While you should have also been testing each method/button sa you created them, this is also a good opportunity to check for any bugs. It's always a good idea to manually test your feature once you complete it to ensure everything works.

## Submission

Once your code is fully tested, push your code up to your Github repository using `git push`. Then, go to Gradescope and complete the exercise submission there!

_Note:_ Be sure to record your demo video before you close out your container to avoid having to rebuild! :)
