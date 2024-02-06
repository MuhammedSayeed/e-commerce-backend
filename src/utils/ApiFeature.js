export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
    paginate() {
        let page = parseInt(this.queryString.page);
        const isValidNumber = Number.isInteger(page) && page > 0;
        if (!isValidNumber) page = 1;
        let limit = 5;
        let skip = (page - 1) * limit;
        this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }
    filter() {
        let filterObj = { ...this.queryString };
        let excludedQueries = ['sort', 'page', 'fields', 'keyword'];
        excludedQueries.forEach(q => delete filterObj[q]);
        filterObj = JSON.stringify(filterObj);
        filterObj = filterObj.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`);
        filterObj = JSON.parse(filterObj);
        this.mongooseQuery.find(filterObj);
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            let sortedBy = this.queryString.sort.replace(',', ' ');
            this.mongooseQuery.sort(sortedBy);
        }
        return this;
    }
    search() {
        if (this.queryString.keyword) {
            this.mongooseQuery.find({
                $or:
                    [
                        { title: { $regex: this.queryString.keyword, $options: 'i' } },
                        { description: { $regex: this.queryString.keyword, $options: 'i' } }
                    ]
            })
        }
        return this;
    }
    fields() {
        if(this.queryString.fields) {
            let fields = this.queryString.fields.replace(',' , ' ');
            this.mongooseQuery.select(fields);
        }
        return this;
    }
}