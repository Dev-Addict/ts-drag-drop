class Project {
    public readonly id: string;

    constructor(public title: string, public description: string, public people: number, public status: 'active' | 'finished' = 'active') {
        this.id = Date.now().toString(16);
    }
}

type Listener = (items: Project[]) => void;

class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    constructor() {
    }

    static getInstance() {
        if (this.instance)
            return this.instance;
        this.instance = new ProjectState();
        return this.instance;
    }

    public addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn);
    }

    public addProject(title: string, description: string, people: number) {
        const project = new Project(
            title,
            description,
            people
        );

        this.projects.push(project);

        for (const listener of this.listeners)
            listener(this.projects.slice());
    }
}

class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[] = [];

    constructor(private type: 'active' | 'finished') {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedNode = document.importNode(this.templateElement.content, true);

        this.element = <HTMLElement>importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;

        ProjectState.getInstance().addListener((projects: Project[]) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });

        this.attach();

        this.renderContent();
    }

    private renderProjects() {
        const listElement = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;

        listElement.innerHTML = '';

        for (const project of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = project.title;

            listElement.appendChild(listItem);
        }
    }

    private renderContent() {
        this.element.querySelector('ul')!.id = `${this.type}-project-list`;

        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedNode = document.importNode(this.templateElement.content, true);

        this.element = <HTMLFormElement>importedNode.firstElementChild;
        this.element.id = 'user-input';

        this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title');
        this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description');
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people');

        this.configure();
        this.attach();
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

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');

console.log(projectInput, activeProjectList, finishedProjectList);