function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    fetch('http://127.0.0.1:8090/admin/requests')
        .then( res => res.json() )
        .then( data => {
            let payload = token.split('.')[1];
            let jsonpayload = JSON.parse(atob(payload));
            let currUser = jsonpayload.user;
            const lst = document.getElementById('reqLstWait');
            const lst1 = document.getElementById('reqLstSolved');
            
            lst.innerHTML += `<tr><th> ID </th> <th> Title </th> <th> Body </th> <th> User </th> <th> Date </th> <th> Status </th> <th> Action </th> </tr>`;
            lst1.innerHTML += `<tr><th> ID </th> <th> Title </th> <th> Body </th> <th> User </th> <th> Date </th> <th> Status </th> <th> Action </th> </tr>`;
            data.forEach( el => {
                if(el.status === 'waiting'){
                    lst.innerHTML += `<tr> <td> ${el.id} </td> <td> ${el.title} </td> <td> <button data-id="${el.id}" class="btn btn-primary update" onclick="readDes(this)">
                    Show Description </button> </td> <td> ${el.user.name} </td> <td> ${el.date} </td> <td> ${el.status} </td>
                    <td>
                    <button data-id="${el.id}" class="btn btn-primary update" onclick="updateReq(this)">
                    Choose to update
                    </button>
                    </td>
                     </tr>`;
                }
                else if(el.status != 'waiting'){
                    lst1.innerHTML += `<tr class = "req2"> <td> ${el.id} </td> <td> ${el.title} </td> <td> <button data-id="${el.id}" class="btn btn-primary update" onclick="readDes(this)">
                    Show Description </button> </td> <td> ${el.user.name} </td> <td> ${el.date} </td> <td> ${el.status} </td>
                    <td>
                    <button data-id="${el.id}" class="btn btn-primary update" onclick="updateSolved(this)">
                    Choose to update
                    </button>
                    <button data-id="${el.id}" class="btn btn-primary btn-dark delete" onclick="deleteReq(this)">
                        Delete
                    </button>
                    </td>
                    </tr>`;
                }
                
            });
            /// <a href="/admin/updateUser/${el.id}" class="btn btn-primary update" id = "updateUser">
        });

    document.getElementById('update').addEventListener('click', e => {
        e.preventDefault();
       
        if(document.getElementById('reqDes').innerText === ''){
            alert("No request chosen for update!")
        }
        else{
            let id;
            id = document.getElementById('reqDes').innerText.split(',')[0];
            console.log("nesto" + id);
            var i;
            let status = 'waiting';
            var radios = document.getElementsByName('status');
            for (i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    status = radios[i].value;
                    break;
                }
            }
            
            const newInfo = {
                status: status,
            };
        
         
            fetch('http://127.0.0.1:8090/admin/requests/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newInfo)
            })
                
                fetch('http://127.0.0.1:8090/admin/requests/' + id)
                .then(res => res.json())
                .then(data => {
                        const table = document.getElementById('reqLstWait');
                        let row, colId;
                        let payload = token.split('.')[1];
                        let res = JSON.parse(atob(payload));
                        console.log(res);
                        console.log(id);
                        
                        /// send notification
                        const notify = {
                            title: 'Autogenerated message',
                            body: 'Request with id = ' + id + ' and title: data.title updated! New status: ' + status.toUpperCase(),
                            auto: true,
                            userId: data.userId,
                            type: 'auto',
                            sender: res.user
                        };
                        fetch('http://127.0.0.1:8090/admin/messages', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(notify)
                        })
                        ///
                        for (let i = 1, row; row = table.rows[i]; i++) {
                            colId = row.cells[0].innerText;
                            if(colId === id){
                                document.getElementById('reqLstWait').deleteRow(i);
                            }
                        }
                        fetch('http://127.0.0.1:8090/admin/users/' + data.userId)
                        .then(res => res.json()
                        .then(user => {
                            const lst = document.getElementById('reqLstSolved');
                            lst.innerHTML += `<tr> <td> ${id} </td> <td> ${data.title} </td> <td> <button data-id="${id}" class="btn btn-primary update" onclick="readDes(this)">
                            Show Description </button> </td> <td> ${user.name} </td> <td> ${data.date} </td> <td> ${status} </td>
                            <td>
                            <button data-id="${id}" class="btn btn-primary update" onclick="updateSolved(this)">
                            Choose to update
                            </button>
                            <button data-id="${id}" class="btn btn-primary btn-dark delete" onclick="deleteReq(this)">
                            Delete
                            </button>
                            </td>
                            </tr>`;
                    
                        clean1();
                        }))
                
                });
        }
    });


    document.getElementById('update2').addEventListener('click', e => {
        e.preventDefault();

        if(document.getElementById('reqDes2').innerText === ''){
            alert("No request chosen for update!")
        }
        else{
            let id;
            id = document.getElementById('reqDes2').innerText.split(',')[0];
            
            var i;
            for(i = 0; i<id.length; i++)
                console.log(id[i]);

            let status;
            var radios = document.getElementsByName('status2');
            for (i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    status = radios[i].value;
                    break;
                }
            }
            
            const newInfo = {
                status: status,
            };
        if(status != 'waiting' && status != 'finished'){
            alert("Status for chosen requests unchanged!");
        }
        else{
            fetch('http://127.0.0.1:8090/admin/requests/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newInfo)
            })
            fetch('http://127.0.0.1:8090/admin/requests/' + id)
            .then(res => res.json())
            .then( data => {
                    var table = document.getElementById('reqLstSolved');
                    let row, colId;
                    console.log(id);
                    let payload = token.split('.')[1];
                    let res = JSON.parse(atob(payload));
                    console.log(res);
                    /// add notification
                    const notify = {
                        title: 'Autogenerated message',
                        body: 'Request with id = ' + id + ' and title: data.title updated! New status: ' + status.toUpperCase(),
                        auto: true,
                        userId: data.userId,
                        type: 'auto',
                        sender: res.user
                    };
                    fetch('http://127.0.0.1:8090/admin/messages', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(notify)
                    })
                    ///

                    for (i = 1, row; row = table.rows[i]; i++) {
                        colId = row.cells[0].innerText;
                        console.log(colId);
                        if(colId === id){
                            document.getElementById('reqLstSolved').deleteRow(i);
                        }
                    }
                    fetch('http://127.0.0.1:8090/admin/users/' + data.userId)
                    .then(res => res.json())
                    .then(user => {
                        if(status == 'waiting'){
                            const lst = document.getElementById('reqLstWait');
                                lst.innerHTML += `<tr> <td class='bg'> ${id} </td> <td> ${data.title} </td> <td> <button data-id="${id}" class="btn btn-primary update" onclick="readDes(this)">
                                Show Description </button> </td> <td> ${user.name} </td> <td> ${data.date} </td> <td> ${status} </td>
                                <td>
                                <button data-id="${id}" class="btn btn-primary update" onclick="updateReq(this)">
                                Choose to update
                                </button>
                                </td> </tr>`;
                        }
                        else{
                            const lst1 = document.getElementById('reqLstSolved');
                            lst1.innerHTML += `<tr> <td class='bg'> ${id} </td> <td> ${data.title} </td> <td> <button data-id="${id}" class="btn btn-primary update" onclick="readDes(this)">
                            Show Description </button> </td> <td> ${user.name} </td> <td> ${data.date} </td> <td> ${status} </td>
                            <td>
                            <button data-id="${id}" class="btn btn-primary update" onclick="updateSolved(this)">
                            Choose to update
                            </button>
                            <button data-id="${id}" class="btn btn-primary btn-dark delete" onclick="deleteReq(this)">
                            Delete
                            </button>
                            </td> 
                            </tr>`;
                        }
                        clean2();
                });
        });
      }
    }
    });

    document.getElementById('cancel').addEventListener('click', e => {
        console.log("uso");
        clean1();
    });

    document.getElementById('cancel2').addEventListener('click', e => {
        console.log("uso");
        clean2();
    });
}

function readDes(obj){
    let id;
    id = obj.getAttribute('data-id');
    fetch('http://127.0.0.1:8090/admin/requests/' + id, {
            method: 'GET'
    })
    .then( res => res.json() )
        .then( data => {
            console.log(data);
            /// document.getElementById('reqTitle').remove();
           alert(data.body);
    });
}

function updateReq(obj) {

    let id;
    id = obj.getAttribute('data-id');
    fetch('http://127.0.0.1:8090/admin/requests/' + id, {
            method: 'GET'
    })
    .then( res => res.json() )
        .then( data => {
            console.log(data);
           
            document.getElementById('reqTitle').innerHTML = 'Choosen:';
            document.getElementById('reqDes').innerHTML = data.id + ', title: ' + data.title;
    });
}

function updateSolved(obj) {

    let id;
    id = obj.getAttribute('data-id');
    fetch('http://127.0.0.1:8090/admin/requests/' + id, {
            method: 'GET'
    })
    .then( res => res.json() )
        .then( data => {
            console.log(data);
        
            document.getElementById('reqTitle2').innerHTML = 'Choosen:';
            document.getElementById('reqDes2').innerHTML = data.id + ', title' + data.title;
    });
     
}

function deleteReq(obj){
    let result = confirm("Want to delete?");
    let id;
    if (result) {
         id = obj.getAttribute('data-id');

        fetch('http://127.0.0.1:8090/admin/requests/' + id)
        .then(res => res.json())
        .then(data => {
            if(data.status === 'accepted'){
                alert("Cannot delete accepted request until it's finished!");
                return;
            }
            else{
                fetch('http://127.0.0.1:8090/admin/requests/' + id, {
                method: 'DELETE'
                })

                var table = document.getElementById('reqLstSolved');
                let i, row, colId;
                console.log(id);
                for (i = 1, row; row = table.rows[i]; i++) {
                    colId = row.cells[0].innerText;
                    if(colId === id){
                        document.getElementById('reqLstSolved').deleteRow(i);
                    }
                 }  
            }
            })
    }
}

function clean1(){

    document.getElementById('reqTitle').innerHTML = 'No request choosen for update!';
    document.getElementById('reqDes').innerHTML = '';
    var radios = document.getElementsByName('status');
    for (i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            radios[i].checked = false;
            break;
        }
    }
}

function clean2(){
    document.getElementById('reqTitle2').innerHTML = 'No request choosen for update!';
    document.getElementById('reqDes2').innerHTML = '';
    var radios = document.getElementsByName('status2');
    for (i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            radios[i].checked = false;
            break;
        }
    }
}

function getCurrUser(){
    let token = document.cookie.split(';')[0].split('=')[1];
    console.log(token);
    let payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}

function bannedView(){
    var blurDiv = document.createElement("div");
    blurDiv.id = "blurDiv";
    blurDiv.style.cssText = "position:absolute; top:0; right:0; width:" + screen.width + "px; height:" + screen.height + "px; background-color: #000000; opacity:0.5; filter:alpha(opacity=50)";
 
    document.getElementsByTagName("body")[0].appendChild(blurDiv);
}