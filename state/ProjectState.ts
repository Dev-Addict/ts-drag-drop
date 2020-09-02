import State from "./State";
import Project from "../models/Project";

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

    setProjectStatus(id: string, status: 'active' | 'finished') {
        const project = this.projects.find(project => project.id === id);

        if (project && project.status !== status) {
            project.status = status;
            for (const listener of this.listeners)
                listener(this.projects.slice());
        }
    }
}

export default ProjectState;