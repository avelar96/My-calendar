let important=true;
let form=false;
let task=true;
let serverUrl="https://fsdiapi.azurewebsites.net/";
function toggleImportant(){
    console.log("clicked");
    if(important){
    $("#iImportant").removeClass("fas").addClass("far");
    important=false;
    }else{
        $("#iImportant").removeClass("far").add("far").addClass("fas");
        important=true;
    }
}
function toggleForm(){
    if(form){
        $("form").slideUp(1500);
        $("#btnAdd").text("Add task");
        form=false;
    }else{
        $("form").slideDown(1500);
        $("#btnAdd").text("Hide the form");
        form=true;
    }
}
function toggleTask(){
    $('.taskInfo').toggle();
}
function save(){
    console.log("Saving task");
    //get the values from the inputs
    let title=$("#txtTitle").val();
    let date=$("#selDate").val();
    let location=$("#txtLocation").val();
    let priority =$("#selPriority").val();
    let color=$("#selColor").val();
    let collaborator=$("#txtCollaborator").val();
    let description = $("#txtDescription").val();
    //create a new Task object
    let task = new Task(title,important,date,location,priority,color,collaborator,description);

    $.ajax({
        type:"POST",
        url:serverUrl+"api/tasks",
        data:JSON.stringify(task),
        contentType:"application/json",
        success:function(res){
            console.log("server says",res);
            alert("The task was registered successfully!");
            let t=JSON.parse(res);
            displayTask(task);
        },
        error:function(error){
            console.log("Error saving task",error);
        }
    });
    clearForm();
}
function displayTask(task){
    //display obj information
    var syntax;
    if(!task.important){
        syntax=` <div class="task">
        <div class="title">
            <h6>${task.title}</h6>
            <button class="miniTask" onclick="toggleTask();"><i class="fas fa-window-minimize"></i></button>
        </div>
        <div class="taskInfo">
            <label><i class="fas fa-thumbtack"></i>${task.location}</label>
            <lable><i class="fas fa-users"></i>${task.collaborator}</label>
            <label><i class="fas fa-pencil-alt"></i>${task.description}</label>
            <label><i class="fas fa-exclamation"></i>${task.priority}</label>
        </div>
    </div>`;
    }else{
        syntax=` <div class="task important">
        <div class="title">
            <h6>${task.title}</h6>
            <button class="miniTask" onclick="toggleTask();"><i class="fas fa-window-minimize"></i></button>
            
            <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="taskInfo">
            <label><i class="fas fa-thumbtack"></i>${task.location}</label>
            <lable><i class="fas fa-users"></i>${task.collaborator}</label>
            <label><i class="fas fa-pencil-alt"></i>${task.description}</label>
            <label><i class="fas fa-exclamation"></i>${task.priority}</label>
        </div>
    </div>`;
    }
    $(".pending-tasks").append(syntax);
}
function getTask(){
    $.ajax({
        type:"GET",
        url:serverUrl+"api/tasks",
        success:function(res){
            let t=JSON.parse(res);
            for(let i=0;i<t.length;i++){
                if(t[i].name==="Martin"){
                    console.log(t[i]);
                    displayTask(t[i]);
                }
            }
            console.log("Server says:"+t);
        },
        error:function(err){
            console.log("Error getting tasks:",err);
        }
    });
}
function clearForm(){
    $("#txtTitle").val('');
    $("#selDate").val('');
    $("#txtLocation").val('');
    $("#selPriority").val('');
    $("#selColor").val('');
    $("#txtCollaborator").val('');
    $("#txtDescription").val('');
}
function clearTaskAll(){
    console.log("Button pressed");
    $.ajax({
        type:'DELETE',
        url:serverUrl + "api/tasks/clear/Martin",
        success:function(res){
            let t= JSON.parse(res);
            console.log("All the task have been clear",t);
            location.reload(true);
        },
        error:function(err){
            console.log("Something went wrong",err);
        }
    });
}
function init(){
    console.log("Calendar System");
    $("form").hide();
    getTask();
    //hook event
    $("#btnAdd").click(toggleForm);
    $("#iImportant").click(toggleImportant);
    $("#btnSave").click(save);
    $("#btnClear").click(clearTaskAll);
}

window.onload=init;