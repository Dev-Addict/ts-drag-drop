import Component from "./Component";
import DragTarget from "../interfaces/DragTarget";
import Project from "../models/Project";
import ProjectItem from "./ProjectItem";
import ProjectState from "../state/ProjectState";

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
    assignedProjects: Project[] = [];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);

        this.configure();
        this.renderContent();
    }

    private renderProjects() {
        const listElement = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;

        listElement.innerHTML = '';

        for (const project of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, project);
        }
    }

    renderContent() {
        this.element.querySelector('ul')!.id = `${this.type}-project-list`;

        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    configure(): void {
        this.element.addEventListener('dragover', this.dragOverHandler.bind(this));
        this.element.addEventListener('dragleave', this.dragLeaveHandler.bind(this));
        this.element.addEventListener('drop', this.dropHandler.bind(this));

        ProjectState.getInstance().addListener((projects: Project[]) => {
            this.assignedProjects = projects.filter(({status}) => status === this.type);
            this.renderProjects();
        });
    }

    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listElement = this.element.querySelector('ul')!;
            listElement.classList.add('droppable');
        }
    }

    dropHandler(event: DragEvent): void {
        const id = event.dataTransfer!.getData('text/plain');
        ProjectState.getInstance().setProjectStatus(id, this.type);
    }

    dragLeaveHandler(event: DragEvent): void {
        const listElement = this.element.querySelector('ul')!;
        listElement.classList.remove('droppable');
    }
}

export default ProjectList;