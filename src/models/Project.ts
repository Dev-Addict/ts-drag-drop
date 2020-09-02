class Project {
    public readonly id: string;

    constructor(public title: string, public description: string, private _people: number, public status: 'active' | 'finished' = 'active') {
        this.id = Date.now().toString(16);
    }

    get people(): string {
        return this._people <= 1 ? this._people + ' person' : this._people + ' persons';
    }
}

export default Project;