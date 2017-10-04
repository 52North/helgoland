export abstract class PermalinkService<T> {

    constructor() { }

    public createPermalink = () => {
        return this.generatePermalink();
    }

    public abstract validatePeramlink(): T;

    protected abstract generatePermalink(): string;

    protected createBaseUrl() {
        const url = window.location.href;
        if (url.indexOf('?') !== -1) {
            return url.substring(0, url.indexOf('?'));
        } else {
            return url;
        }
    }
}
