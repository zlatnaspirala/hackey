/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserAgentOptions, Web } from "sip.js";
import { SimpleUserDelegate } from "sip.js/lib/platform/web/simple-user/simple-user-delegate";
import { getButton, getE, getVideo } from "./scripts/demo-utils";

const domainOnSip = "sipjs.onsip.com";
export let webSocketServer="wss://edge.sip.onsip.com";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const domainLinphone = 'sip.linphone.org';
const webSocketServerLinphone="wss://sip.linphone.org";

const iamUser = "nidza";
webSocketServer = webSocketServerLinphone;

console.info('Hackey running...', Web);

const delegate: SimpleUserDelegate={
  onCallReceived: async () => {
    console.log('Incoming Call!');
    await simpleUser2.answer();
  }
};

const userAgentOptions = {
  sessionDescriptionHandlerFactoryOptions: {
    peerConnectionConfiguration: {
      iceServers: [{
        urls: "stun:stun.l.google.com:19302"
      }, {
        username: "nidza",
        credential: "SZdhTYn@5Bx87Pi"
      }]
    },
  }
};

// Options for SimpleUser
const options: Web.SimpleUserOptions={
  userAgentOptions: userAgentOptions,
  aor: `sip:${iamUser}@${domainLinphone}`,
  media: {
    constraints: { audio: false, video: true },
    local: {
      video: getVideo("videoLocalAlice")
    },
    remote: {
      video: getVideo("videoRemoteAlice")
    }
  }
};

const options2: Web.SimpleUserOptions={
  aor: `sip:zlatnaspirala@${domainLinphone}`,
  media: {
    constraints: { audio: false, video: true },
    local: {
      video: getVideo("videoLocalBob")
    },
    remote: {
      video: getVideo("videoRemoteBob")
    }
  },
  delegate: delegate
};


// Construct a SimpleUser instance
const simpleUser=new Web.SimpleUser(webSocketServer, options);
const simpleUser2=new Web.SimpleUser(webSocketServer, options2);

simpleUser.connect()
  .then(() => {

    console.info("status: sip server connected.");
    (getE('callIdList') as HTMLInputElement).disabled=false;
    (getButton('connectUser')).disabled=true;
    (getButton('registerUser')).disabled=false;

    simpleUser.register().then(() => {

      console.info("status: registered.");
      getButton('registerUser').disabled=true;
      getButton('callBtn').disabled=false;
      getButton('callBtn').classList.add('cooliano');
      getButton('callBtn').addEventListener('click', (e) => {

        console.log(">>>>"+(getE('callIdList') as HTMLSelectElement).selectedOptions[0].innerText)
        console.log(">>>>"+(getE('callIdList') as HTMLSelectElement).selectedIndex)
        const emailLocal=(getE('callIdList') as HTMLSelectElement).selectedOptions[0].innerText;

        const curAddress=`sip:${emailLocal}`;
        // const curAddress = `sip:bob@${domain}`;
        simpleUser.call(curAddress, undefined, {
          requestDelegate: {
            onAccept: (e) => {
              console.info(`status: ${(e as any).message.from.uri.normal.user} INVITE accepted from ${(e as any).message.to.uri.normal.user}`);
              getButton('hangupBtn').disabled=false;
              (getButton('hangupBtn')).addEventListener('click', () => {
                //

                simpleUser.hangup().then(() => {
                  console.log("just test hangup")
                })
              })
            },
            onReject: (response) => {
              console.info(`status: INVITE rejected`);
              let message=`Session invitation to  rejected.\n`;
              message+=`Reason: ${response.message.reasonPhrase}\n`;
              alert(message);
            }
          },
          withoutSdp: false
        })
          .catch((error: Error) => {
            console.error(`error: failed to begin session`, error);
            alert(` Failed to begin session.\n`+error);
          });
      })

    }).catch((error: Error) => {
      console.error("error in registration:", error);
    });

  }).catch((error: Error) => {
    console.error("error in connection:", error);
  });

simpleUser2.connect()
  .then(() => {
    simpleUser2.register().then(() => {
      console.log("Nice reg bob");
    }).catch((error: Error) => {
      console.log("Error in registration:", error);
    });
  }).catch((error: Error) => {
    console.log("Error:", error);
  });
