import Component from "./Component";
import ProjectState from "../state/ProjectState";

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');

        this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title');
        this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description');
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people');

        this.configure();
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    private getUserInput(): [string, string, number] | void {
        const title = this.titleInputElement.value.trim();
        const description = this.descriptionInputElement.value.trim();
        const people = +this.peopleInputElement.value.trim();

        if (!title || !description) {
            alert('Invalid inputs.');
            return;
        }

        this.clearInputs.bind(this)();

        return [title, description, people];
    }

    private submitHandler(event: Event) {
        event.preventDefault();

        const userInput = this.getUserInput.bind(this)();

        if (!userInput)
            return;

        const [title, description, people] = userInput;

        ProjectState.getInstance().addProject(title, description, people);
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }

    renderContent(): void {
    }
}

export default ProjectInput;