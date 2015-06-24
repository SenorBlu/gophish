// Save attempts to POST to /groups/
function save(){
    var targets = []
    $.each($("#targetsTable").DataTable().rows().data(), function(i, target){
        targets.push({
            first_name : target[0],
            last_name: target[1],
            email: target[2],
            position: target[3]
        })
    })
    var group = {
        name: $("#name").val(),
        targets: targets
    }
    console.log(group)
    // Submit the group
    api.groups.post(group)
    .success(function(data){
        successFlash("Group added successfully!")
        load()
        dismiss()
    })
    .error(function(data){
        $("#modal\\.flashes").empty().append("<div style=\"text-align:center\" class=\"alert alert-danger\">\
            <i class=\"fa fa-exclamation-circle\"></i> " + data.responseJSON.message + "</div>")
    })
}

function dismiss(){
    $("#modal\\.flashes").empty()
    $("#modal").modal('hide')
}

function edit(group){
    if (group == "new") {
        group = {}
    }
    targets = $("#targetsTable").dataTable()
    // Handle Addition
    $("#targetForm").submit(function(){
        targets.DataTable()
        .row.add([
            $("#firstName").val(),
            $("#lastName").val(),
            $("#email").val(),
            $("#position").val(),
            '<span style="cursor:pointer;"><i class="fa fa-trash-o"></i></span>'
        ])
        .draw()
        $("#targetForm>div>input").val('')
        $("#firstName").focus()
        return false
    })
    // Handle Deletion
    $("#targetsTable").on("click", "span>i.fa-trash-o", function(){
        targets.DataTable()
        .row( $(this).parents('tr') )
        .remove()
        .draw();
    })
}

function load(){
    api.groups.get()
    .success(function(groups){
        if (groups.length > 0){
            $("#emptyMessage").hide()
            $("#groupTable").show()
            groupTable = $("#groupTable").DataTable();
            $.each(groups, function(i, group){
                groupTable.row.add([
                    group.name,
                    group.targets.join(),
                    group.modified_date
                ]).draw()
            })
        }
    })
    .error(function(){
        errorFlash("Error fetching groups")
    })
}

$(document).ready(function(){
    load()
    $("#fileUpload").hover(function(){$("#fileUpload").tooltip('toggle')})
})
