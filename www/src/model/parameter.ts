import { Identifiable } from './identifiable';

export abstract class Parameter implements Identifiable {

    public id: string;

    public label: string;

}
