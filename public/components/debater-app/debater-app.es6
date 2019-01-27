import {Component, View, bootstrap, For} from 'angular2/angular2';
import {DebaterFactory} from 'todos-factory';

// Annotation section
@Component({
    selector: 'debater-app'
})

@View({
    templateUrl: 'components/debater-app/debater-app.html',
    directives : [For]
})

// Component controller
class DebaterAppComponent {

    debater;

    constructor(id) {
        DebaterFactory.get(id).then((data) =>{
            this.debater = this.debater;
        });
    }

    addDebater($event, todoText) {
        if($event.which === 13) {
            var _todo = {
                text : todoText.value,
                isCompleted : false
            };

            DebaterFactory.save(_todo).then((data)=>{
                // keep things in sync
                this.todos.push(data);
                todoText.value = '';
            })
        }
    }

    updateDebaterText($event, todo){
        if($event.which === 13){
            todo.text = $event.target.value;
            var _todo = {
                _id : todo._id,
                text : todo.text ,
                isCompleted : todo.isCompleted
            };

            DebaterFactory.update(_todo).then((data)=>{
                // console.log(data); -> {ok: true, n: 1, updatedExisting: true}
                // wait for the response before resetting the state
                this.setEditState(todo, false);
            });
        }
    }

    updateStatus(todo){
        var _todo = {
            _id : todo._id,
            text : todo.text ,
            isCompleted : !todo.isCompleted
        };

        DebaterFactory.update(_todo).then((data)=>{
            // console.log(data); -> {ok: true, n: 1, updatedExisting: true}
            // wait for the response before updating the UI
            todo.isCompleted = !todo.isCompleted;
        });

    }

    deleteDebater(todo){
        var todos = this.todos;

        DebaterFactory.delete(todo._id).then((data)=>{
            if(data.n == 1){
                // save a n/w call by updating the local array
                // instead of making a GET call again to refresh the data
                for (var i = 0; i < todos.length; i++) {
                    if(todos[i]._id == todo._id){
                        todos.splice(i, 1);
                    }
                };

            }
        });
    }

    setEditState(todo, state){
        if(state){
            todo.isEditMode = state;
        }else{
            // don't store unwanted presentation logic in DB :/
            delete todo.isEditMode;
        }
    }
}

bootstrap(DebaterAppComponent);