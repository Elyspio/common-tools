export class DataArray {
	
	data;
	limit;
	
	constructor(limit) {
		this.limit = limit;
		this.data = [];
	}
	
	push(data) {
		
		if (this.data.length >= this.limit) {
			this.data.shift();
		}
		this.data.push({
			...data,
			time: Date.now()
		});
		
		return this
		
	}
	
	getData = () => this.data;
	
	
	
}
