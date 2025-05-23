import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ButtonCreateComponent } from '../../components/button-create/button-create.component';
import { DailyTaskComponent } from '../../components/daily-task/daily-task.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { ToggleButtonComponent } from '../../components/toggle-button/toggle-button.component';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'app-home',
    imports: [
        HeaderComponent,
        DailyTaskComponent,
        ButtonCreateComponent,
        CommonModule,
        TaskCardComponent,
        ToggleButtonComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    allTasks: Task[] = [];
    todayTasks: Task[] = [];
    tomorrowTasks: Task[] = [];
    showAllTasks: boolean = false;
    showAllTodayTasks: boolean = false;
    showAllTomorrowTasks: boolean = false;
    headerTitle: string = '';

    constructor(
        private router: Router,
        private taskService: TaskService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.loadTodayTasks();
        this.loadTomorrowTasks();
        this.listAllTasks();
    }

    private updateHeaderTitle(): void {
        const allIncompleteTasks = [
            ...this.todayTasks,
            ...this.tomorrowTasks,
            ...this.allTasks
        ].filter((task, index, self) =>
            index === self.findIndex(t => t.id === task.id) &&
            !task.completed
        ).length;

        this.headerTitle = 'You have got ' + allIncompleteTasks + (allIncompleteTasks === 1 ? ' task ' : ' tasks ') + 'today to complete';
    }

    navigate() {
        this.router.navigate(['task']);
    }

    navigateToTask(taskId: string) {
        this.router.navigate(['task', taskId]);
    }

    updateTaskStatus(taskId: string, completed: boolean): void {
        this.taskService.updateTaskStatus(taskId, completed).subscribe({
            next: () => {
                this.updateTaskInLists(taskId, completed);
            },
            error: () => {
                this.toastr.error('Failed to update task status. Please try again.');
                this.updateTaskInLists(taskId, !completed);
            }
        });
    }

    loadTodayTasks() {
        this.taskService.listTodayTasks(0, 10).subscribe({
            next: (page)=> {
                this.todayTasks = page.content;
                this.updateHeaderTitle();
            },
            error: () => {
                this.toastr.error("Failed to load today tasks. try again later");
            }
        });
    }

    loadTomorrowTasks() {
        this.taskService.listTomorrowTasks(0, 10).subscribe({
            next: (page)=> {
                this.tomorrowTasks = page.content;
                this.updateHeaderTitle();
            },
            error: () => {
                this.toastr.error("Failed to load tomorrow tasks. try again later");
            }
        });
    }

    listAllTasks() {
        this.taskService.list(0, 15).subscribe({
            next: (page)=> {
                this.allTasks = page.content;
                this.updateHeaderTitle();
            },
            error: () => {
                this.toastr.error("Failed to load all tasks. try again later");
            }
        });
    }

    private updateTaskInLists(taskId: string, completed: boolean): void {
        const updateList = (list: Task[]): Task[] => {
            return list.map(task => {
                if (task.id === taskId) {
                    return { ...task, completed };
                }
                return task;
            });
        };

        this.todayTasks = updateList(this.todayTasks);
        this.tomorrowTasks = updateList(this.tomorrowTasks);
        this.allTasks = updateList(this.allTasks);
        this.updateHeaderTitle();
    }

    toggleShowAllTasksToday(isExpanded: boolean): void {
        this.showAllTodayTasks = isExpanded;
    }

    toggleShowAllTomorrowTasks(isExpanded: boolean): void {
        this.showAllTomorrowTasks = isExpanded;
    }

    toggleListAllTasks(isExpanded: boolean): void {
        this.showAllTasks = isExpanded;
    }
}
