import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { takeLast } from 'rxjs/operators';
import { Tasks } from 'src/app/Todo-List-App/models/todo-interface';
import { TodoService } from '../../services/todo.service';

import { FilteredTasks } from '../../models/todo-iterface2';




@Component({
    selector: '<todo-list></todo-list>',
    templateUrl: 'todo-list.component.html', 
    styleUrls: ['todo-list.component.css'],
    animations: [
        trigger('fade', [
         
            ])
        ]
    })
    
    export class TodoList {
        taskId: number;
        taskTitle: string;
        editing: boolean = false;
        description:String;
      
        tasks:Tasks[] = [];
        Filteredtasks: FilteredTasks[] = [];
        beforeEditing: string;
        today: number = Date.now();
        filter: string;
        
        
        constructor(private todoService: TodoService ){
            
        }
        
        ngOnInit(){
            this.beforeEditing = '';
            this.taskId;
            this.taskTitle = '';
            this.getTasks();
            this.todoService
            .getTodo()
            .subscribe(data => this.tasks = data);
            
        }
       getTasks(){
           if(localStorage.getItem('tasks') === null){
this.tasks =[];
           }else{
this.tasks= JSON.parse(localStorage.getItem('tasks'));
           }
       }
        addTask(){  
            if(this.taskTitle.trim().length === 0)
            return;
            
            this.todoService.addTask({id:this.taskId,
                title: this.taskTitle,
                completed: false,
                editing: false})
                .subscribe((data: Tasks) => {
                    console.log(data);
                    
                    
                });
                this.tasks.push({
                    id:this.taskId,
                title: this.taskTitle,
                completed: false,
                editing: false,
            })
            localStorage.setItem('tasks' , JSON.stringify(this.tasks));
           
            this.taskTitle ='';          
            ;
            this.ngOnInit();
           
           
           
    }

    search() {
        if(this.filter && this.filter.length > 0) {
           
            return this.tasks.filter(task => task.title.includes(this.filter));
        }
        
        return this.tasks
    }
    toggleEdit(event: Tasks){
        event.editing = !event.editing;
    }

    editTask(event: Tasks){
        this.beforeEditing = event.title;
        event.editing = !event.editing;
        this.todoService.editTodo(event)
            .subscribe(data => this.tasks = this.tasks.map((task: Tasks )=>{
                    if (task.title === event.title){
                      task = Object.assign({}, task, event);
                    }
                    return task;
                  }));
                  localStorage.setItem('tasks' , JSON.stringify(this.tasks));
    }


    doneEditing(task: Tasks):void{
        if(task.title.trim().length === 0){
            task.title = this.beforeEditing;
        }
        task.editing = false;
      
    }

    cancelEditing(task: Tasks){
        task.title = this.beforeEditing;
        task.editing = false;
        localStorage.setItem('tasks' , JSON.stringify(this.tasks));
    }

    remaining(): number{
        return this.tasks.filter(task => !task.completed).length;
    }
    done(): number{
        return this.tasks.filter(task => task.completed).length;
    }
    all(): number{
        return this.tasks.filter(task => Number(!task.completed) + Number(task.completed)).length;
    }
    atleastOneCompleted(): boolean{
        localStorage.setItem('tasks' , JSON.stringify(this.tasks));
        return this.tasks.filter(task => task.completed).length > 0;
        
    }
    
   
     deleteTodo (taskId){
        
        this.tasks.splice(taskId,1);
        localStorage.setItem('tasks' , JSON.stringify(this.tasks));
    }

  deleteAll(taskId){
    
        this.tasks = this.tasks.filter(task => task.id !== taskId);

        this.todoService.deleteTask(taskId)
            .subscribe(data => this.tasks.filter(task => {
                return task !== data;
            }))
    }

  

    selectAll(event):void{
            this.tasks.forEach(x => x.completed = event.target.checked)
            localStorage.setItem('tasks' , JSON.stringify(this.tasks));
    }
}