class Project {
    public readonly id: string;

    constructor(public title: string, public description: string, private _people: number, public status: 'active' | 'finished' = 'active') {
        this.id = Date.now().toString(16);
    }

    get people(): string {
        return this._people <= 1 ? this._people + ' person' : this._people + ' persons';
    }
}

type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    public addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

class ProjectState extends State<Project>{
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance)
            return this.instance;
        this.instance = new ProjectState();
        return this.instance;
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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    protected constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
        this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)!;
        this.hostElement = <T>document.getElementById(hostElementId)!;

        const importedNode = document.importNode(this.templateElement.content, true);

        this.element = <U>importedNode.firstElementChild;
        if (newElementId)
            this.element.id = newElementId;

        this.attach(insertAtStart);
    }

    private attach(insertAtStart: boolean) {
        this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
    }

    abstract configure(): void;
    abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>{
    constructor(hostId: string, private project: Project) {
        super('single-project' ,hostId, false, project.id);

        this.configure();
        this.renderContent();
    }

    configure(): void {
    }

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.project.people.toString() + ' assigned.';
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement>{
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
        ProjectState.getInstance().addListener((projects: Project[]) => {
            this.assignedProjects = projects.filter(({status}) => status === this.type);
            this.renderProjects();
        });
    }
}

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

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');

console.log(projectInput, activeProjectList, finishedProjectList);