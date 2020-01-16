const io = require('socket.io')();
var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;

let combinationEnteredString = "";

var blueButtonEnabled = { DIO0: 0, DIO1: 1, DIO2: 1 };
var whiteButtonEnabled = { DIO0: 1, DIO1: 0, DIO2: 1 };

var code_admin = 1212;
var code_user = 3434;

var enableGreenLight = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.AT_COMMAND
  //id: 0x52, // optional, nextFrameId() is called per default
  command: "D2",
  commandParameter: [0x05],
};

var disableGreenLight = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.AT_COMMAND
  //id: 0x52, // optional, nextFrameId() is called per default
  command: "D2",
  commandParameter: [0x00],
};

var disableRedLight = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.AT_COMMAND
  //id: 0x52, // optional, nextFrameId() is called per default
  command: "D3",
  commandParameter: [0x00],
};

var enableRedLight = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.AT_COMMAND
  //id: 0x52, // optional, nextFrameId() is called per default
  command: "D3",
  commandParameter: [0x05],
};

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

let serialport = new SerialPort("/dev/tty.SLAB_USBtoUART", {
  baudRate: 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

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

  if(frame.digitalSamples !== undefined)
  {

    if(frame.digitalSamples['DIO0'] == 0){
      combinationEnteredString += "B";
    }

    if(frame.digitalSamples['DIO1'] == 0){
      combinationEnteredString += "J";
    }

    // Si la combinaison entré est la bonne, on allume la led verte pendant 10sec
    if(combinationEnteredString.match('BJJBBJ')){
      console.log(combinationEnteredString + "Bonne combi");
      xbeeAPI.builder.write(enableGreenLight);
      xbeeAPI.builder.write(disableRedLight);

      sleep(10000).then(() => {
        xbeeAPI.builder.write(disableGreenLight);
        xbeeAPI.builder.write(enableRedLight);
      })
      return;

    } else {
      console.log(combinationEnteredString + "faux");
    }
  }

    //jsonFrameDigi = JSON.stringify(frame.digitalSamples['DIO0']);


  //combinationEnteredString += jsonFrameDigi;

  /*
  if(jsonFrameDigi == JSON.stringify(blueButtonEnabled))
    console.log("bleu bleu bleu");

  if(jsonFrameDigi == JSON.stringify(whiteButtonEnabled))
    xbeeAPI.builder.write()
  */

  //on packet received, dispatch event
  //let dataReceived = String.fromCharCode.apply(null, frame.data);
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
    //console.log(frame);
    // let dataReceived = String.fromCharCode.apply(null, frame.nodeIdentifier);
    // console.log(">> ZIGBEE_RECEIVE_PACKET >", frame);


  } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
    //console.log(frame);


  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {

  } else {
    //console.debug(frame);
    let dataReceived = String.fromCharCode.apply(null, frame.commandData)
    //console.log(dataReceived);
  }

});
let browserClient;
io.on('connection', (client) => {
  console.log(client.client.id);
  browserClient = client;

  client.on('subscribeToPad', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    // setInterval(() => {
    //   client.emit('pad-event', {
    //     device: "test device",
    //     data: Math.round(Math.random()) * 2 - 1
    //   })
    //   ;
    // }, Math.random() * 1000);
  });

  client.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//
// serial_xbee.on("data", function(data) {
//     console.log(data.type);
//   // console.log('xbee data received:', data.type);
//   // client.emit('timer', "pouet");
// //
// });

// shepherd.on('ready', function () {
//   console.log('Server is ready.');
//
//   // allow devices to join the network within 60 secs
//   shepherd.permitJoin(60, function (err) {
//     if (err)
//       console.log(err);
//   });
// });
//
// shepherd.start(function (err) {                // start the server
//   if (err)
//     console.log(err);
// });
