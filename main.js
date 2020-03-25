const socket = io('https://stream261199.herokuapp.com/');

$('#div-chat').hide();

// let customConfig;

// $.ajax({
//   url: "https://service.xirsys.com/ice",
//   data: {
//     ident: "Quangdat",
//     secret: "e7b2f4ca-6e46-11ea-ac6c-0242ac110004",
//     domain: "quangdat.github.io",
//     application: "default",
//     room: "default",
//     secure: 1
//   },
//   success: function (data, status) {
//     // data.d is where the iceServers object lives
//     customConfig = data.d;
//     console.log(customConfig);
//   },
//   async: false
// });

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dangky').hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));


function openStream(){
    const config = { audio: true, video: true};

    return navigator.mediaDevices.getUserMedia(config); //Tra ve 1 promise
}

function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
// .then(stream => playStream('localStream', stream));

var peer = new Peer({key: 'lwjd5qra8257b9'});

//var peer = new Peer({key: 'peerjs', host: 'hostname', secure: true, port: 443, config: customConfig })

peer.on('open', id =>{
    $('#my-peer').append(id);
    $('#btnSignUp').click(()=>{
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });

} )

//Caller
$('#btnCall').click(()=>{
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
})

//Callee
peer.on('call', call =>{
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
    })
})


$('#ulUser').on('click', 'li', function(){
    var id = $(this).attr('id')
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
})


