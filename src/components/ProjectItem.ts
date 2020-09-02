import Component from "./Component";
import Draggable from "../interfaces/Draggable";
import Project from "../models/Project";

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
    constructor(hostId: string, private project: Project) {
        super('single-project' ,hostId, false, project.id);

        this.configure();
        this.renderContent();
    }

    configure(): void {
        this.element.addEventListener('dragstart', this.dragStartHandler.bind(this));
        this.element.addEventListener('dragend', this.dragEndHandler.bind(this));
    }

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.project.people.toString() + ' assigned.';
        this.element.querySelector('p')!.textContent = this.project.description;
    }

    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(event: DragEvent): void {
    }
}

export default ProjectItem;