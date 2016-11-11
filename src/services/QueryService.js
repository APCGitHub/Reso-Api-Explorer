/**
 * Created by aclinton on 10/21/16.
 */
export default class QueryService {
    constructor() {
        this.exampleQueries = [{
            title: 'Equals Comparison',
            description: 'Get properties where the Listing Agent\'s last name (field ListAgentLastName) is \'Smith\' (case sensitive).',
            query: {
                select: 'ListingId, ListPrice, ListAgentFirstName, ListAgentLastName',
                filter: [{value: 'ListAgentLastName eq \'Smith\'', join: 'and'}],
                orderby: [],
                top: '',
                skip: ''
            }
        }, {
            title: 'Multiple Field Values',
            description: 'This query gets properties where the listing agent\'s last name is either \'Smith\' or \'Doe\'.',
            query: {
                select: 'ListingId, ListPrice, ListAgentFirstName',
                filter: [
                    {
                        value: 'ListAgentLastName eq \'Doe\'', join: 'or'
                    },
                    {
                        value: 'ListAgentLastName eq \'Smith\'', join: 'and'
                    }
                ],
                orderby: [],
                top: '',
                skip: ''
            }
        }, {
            title: 'Wildcard Search',
            description: 'You can do wildcard or case insensitive searches by using the special string functions with the $filter option.',
            query: {
                select: 'ListingId, ListPrice, ListAgentFirstName',
                filter: [{value: 'startswith(ListAgentFirstName, \'joh\')', join: 'and'}],
                orderby: [],
                top: '',
                skip: ''
            }
        }, {
            title: 'Numeric Range',
            description: 'This query selects properties with a listing price between $50K & $200K .',
            query: {
                select: 'ListingId, ListPrice',
                filter: [{value: 'ListPrice ge 50000', join: 'and'}, {value: 'ListPrice le 200000', join: 'and'}],
                orderby: [],
                top: '',
                skip: ''
            }
        }, {
            title: 'Date Filtering',
            description: 'This query gets properties listed in June 2016 by the ListingContractDate field.',
            query: {
                select: 'ListingId, ListPrice, ListingContractDate',
                filter: [
                    {value: 'year(ListingContractDate) eq 2016', join: 'and'},
                    {value: 'month(ListingContractDate) eq 6', join: 'and'}
                ],
                orderby: [],
                top: '',
                skip: ''
            }
        }, {
            title: 'Sorting',
            description: 'This query is sorted (asc) by the ListPrice field.',
            query: {
                select: 'ListingId, ListPrice, ListingContractDate',
                filter: [
                    {value: 'year(ListingContractDate) eq 2016', join: 'and'},
                    {value: 'month(ListingContractDate) eq 6', join: 'and'}
                ],
                orderby: [{value: 'ListPrice', direction: 'asc'}],
                top: '',
                skip: ''
            }
        }, {
            title: 'Pagination',
            description: 'This query gets the next set of results by passing a $skip parameter value of 11 with a $top value of 10.',
            query: {
                select: 'ListingId, ListPrice, ListingContractDate',
                filter: [
                    {value: 'year(ListingContractDate) eq 2016', join: 'and'},
                    {value: 'month(ListingContractDate) eq 6', join: 'and'}
                ],
                orderby: [{value: 'ListPrice', direction: 'asc'}],
                top: '10',
                skip: '11'
            }
        }];
    }

    /**
     * This method takes the query object and builds the ODATA url.
     * @param queryObject
     * @returns {string}
     */
    buildUrl(queryObject) {
        let s = '';
        let pieces = [0, 0, 0, 0, 0, 0]; //select, filter, shapes, orderby, top, skip

        //$select
        if(queryObject.select){
            pieces[0] = 1;
            s += '$select=' + queryObject.select;
        }

        //$filter
        if(queryObject.filter.length){
            pieces[1] = 1;

            if(pieces[0])
                s += '&';

            s += '$filter=';

            _.forEach(queryObject.filter, (filter, index) => {
                if(filter.value){
                    s += filter.value;

                    //only add the join if not the last one
                    if((index + 1) < queryObject.filter.length)
                        s += " " + filter.join + " ";
                }
            });
        }

        //$filter GEO AWESOMENESS
        if(queryObject.shapes.length){
            let prev_q = false;

            pieces[2] = 1;

            if(!pieces[0]){
                s += '$filter=';
            }

            if(pieces[1]){
                s += ' or ';
            }

            for(let i = 0, len = queryObject.shapes.length; i < len; i++){
                let shape = queryObject.shapes[i];
                let _s = '';

                if(shape.type === 'circle') {
                    _s = this.handleCircle(shape);
                } else if(shape.type === 'rectangle') {
                    _s = this.handleRectangle(shape);
                } else if(shape.type === 'polygon') {
                    _s = this.handlePolygon(shape);
                }

                if(_s){
                    s += _s;
                }
            }
        }

        //$orderby
        if(queryObject.orderby.length){
            pieces[3] = 1;

            if(pieces[0] || pieces[1] || pieces[2])
                s += '&';

            s += '$orderby=';

            _.forEach(queryObject.orderby, (orderby, index) => {
                if(orderby.value){
                    s += orderby.value + ' ' + orderby.direction;

                    if((index + 1) < queryObject.orderby.length)
                        s += ", ";
                }
            });
        }

        //$top
        if(queryObject.top){
            pieces[4] = 1;

            if(pieces[0] || pieces[1] || pieces[2] || pieces[3])
                s += '&';

            s += '$top=';

            s += queryObject.top;
        }

        //$skip
        if(queryObject.skip){
            pieces[5] = 1;

            if(pieces[0] || pieces[1] || pieces[2] || pieces[3] || pieces[4])
                s += '&';

            s += '$skip=';

            s += queryObject.skip;
        }

        return s;
    }

    /**
     * Turn a circle into an ODATA query string
     */
    handleCircle(circle) {
        let s = 'geo.distance(Location, POINT(';
        let lat = circle.center.lat(), lng = circle.center.lng();
        let radius = circle.getRadius();

        s += `${lng} ${lng})) le ${radius}`;

        return s;
    }

    /**
     * Turn a rectangle into an ODATA query string
     */
    handleRectangle(shape) {
        let s = '';

        return s;
    }

    /**
     * Turn a polygon into an ODATA query string
     */
    handlePolygon(shape) {
        let s = '';

        return s;
    }
}
