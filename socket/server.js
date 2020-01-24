const io = require('socket.io')();
var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
let request = require('request');

let passwords = [];



var C = xbee_api.constants;

let countEnter = 0;
let truePass = false;

let combinationEnteredString = "";

var blueButtonEnabled = { DIO0: 0, DIO1: 1, DIO2: 1 };
var whiteButtonEnabled = { DIO0: 1, DIO1: 0, DIO2: 1 };

var code_admin = 1212;
var code_user = 3434;

var enableGreenLight = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.AT_COMMAND
  command: "D2",
  commandParameter: [0x05],
};

var disableGreenLight = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.AT_COMMAND
  command: "D2",
  commandParameter: [0x00],
};

var disableRedLight = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.AT_COMMAND
  command: "D3",
  commandParameter: [0x00],
};

var enableRedLight = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.AT_COMMAND
  command: "D3",
  commandParameter: [0x05],
};

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

let serialport = new SerialPort("/dev/tty.SLAB_USBtoUART", {
//let serialport = new SerialPort("COM3",{
//let serialport = new SerialPort("COM5",{
  baudRate: 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

//xbeeAPI.builder.write(enableRedLight);
//xbeeAPI.builder.write(disableGreenLight);

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);
serialport.on("open", function () {
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "NI",
    commandParameter: [],
  };

  xbeeAPI.builder.write(frame_obj);

  //console.log(xbeeAPI.newStream());
  console.log(xbeeAPI)

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
  xbeeAPI.builder.write(frame_obj);

});

// All frames parsed by the XBee will be emitted here
xbeeAPI.parser.on("data", function (frame) {
  //on new device is joined, register it


  RecoverPassword(function(data){
    passwords=data;
    console.log(passwords);
  });

  if(frame.digitalSamples !== undefined)
  {

    if(frame.digitalSamples['DIO0'] == 0){
      combinationEnteredString += "B";
    }

    if(frame.digitalSamples['DIO1'] == 0){
      combinationEnteredString += "J";
    }

    for(let i = 0; i < passwords.length; i++){
      let password =  passwords[i];
      console.log(password);

      if(!truePass && combinationEnteredString.match(password)){
        truePass = true;

        xbeeAPI.builder.write(enableGreenLight);
        xbeeAPI.builder.write(disableRedLight);

        console.log(combinationEnteredString + " : Combinaison correct !");

        setTimeout(function(){
          xbeeAPI.builder.write(disableGreenLight);
          xbeeAPI.builder.write(enableRedLight);
          combinationEnteredString = "";
          truePass = false;
        },3000);
      }
      else{
        console.log(combinationEnteredString);
      }
    }

    // Si la combinaison entré est la bonne, on allume la led verte pendant 10sec


  }

  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);

    browserClient && browserClient.emit('pad-event', {
      device: frame.remote64,
      data: dataReceived
    });
  }

  if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {

  } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {


  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {

  } else {
    let dataReceived = String.fromCharCode.apply(null, frame.commandData)
  }

});

let browserClient;
io.on('connection', (client) => {
  console.log(client.client.id);
  browserClient = client;

  client.on('subscribeToPad', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
  });

  client.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


/*
const port = 8000;
io.listen(port);
*/




function RecoverPassword(callback){
  var options = {
    url: 'https://localhost:8443/access_passes',
    strictSSL: false,
    secureProtocol: 'TLSv1_method'
  }

  request.get(options, function(error, response, body) {
    if (!error) {
      let jsonData = JSON.parse(body);
      let passwordArray = [];
      for(let i = 0; i< jsonData["hydra:member"].length; i++){
        passwordArray.push(jsonData["hydra:member"][i]["pass"]);
      }
      callback(passwordArray);
    }
    else {
      console.log(error);
    }
  });
}
