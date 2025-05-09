import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

@Component({
    selector: 'app-task-card',
    imports: [
        CommonModule
    ],
    templateUrl: './task-card.component.html',
    styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
    @Input() id: string = '';
    @Input() userId: string = '';
    @Input() title: string = '';
    @Input() description: string = '';
    @Input() date: Date = new Date();
    @Input() priority: TaskPriority = 'LOW';
    @Input() isCompleted: boolean = false;
    @Output() statusChange = new EventEmitter<{id: string, completed: boolean}>();
    @Output() navigateToTask = new EventEmitter<string>();

    getPriorityColor(): string {
        switch (this.priority) {
            case 'LOW':
                return 'bg-pinklight';
            case 'MEDIUM':
                return 'bg-ocean';
            case 'HIGH':
                return 'bg-beige';
            default:
                return 'bg-pinklight';
        }
    }

    onClick(event: Event) {
        event.stopPropagation();
        this.isCompleted = !this.isCompleted;
        this.statusChange.emit({ id: this.id, completed: this.isCompleted });
    }

    onNavigate() {
        this.navigateToTask.emit(this.id);
    }
}
