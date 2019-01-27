import {$http} from 'xhr-factory';

export const DebaterFactory = {

    getAll :function(){
        return $http.get('/api/debaters');
    },

    get:function(id){
        return $http.get('/api/debaters/'+id);
    }

};