export namespace main {
	
	export class FileData {
	    text: string;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new FileData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.text = source["text"];
	        this.path = source["path"];
	    }
	}

}

