import { UserAgentOptions, Web } from "sip.js";
import { SimpleUserDelegate } from "sip.js/lib/platform/web/simple-user/simple-user-delegate";
import { getButton, getE, getVideo } from "./scripts/demo-utils";

const domain = "sipjs.onsip.com";
export const webSocketServer = "wss://edge.sip.onsip.com";

console.log('TS RUN', Web);

const delegate: SimpleUserDelegate = {
  onCallReceived: async () => {
    console.log('Incoming Call!');
    await simpleUser2.answer();
  }
};

// Options for SimpleUser
const options: Web.SimpleUserOptions = {
  aor: `sip:alice@${domain}`,
  media: {
    constraints: { audio: false, video: true },
    local: {
      video:  getVideo("videoLocalAlice") 
    },
    remote: {
      video:  getVideo("videoRemoteAlice") 
    }
  }
};

const options2: Web.SimpleUserOptions = {
  aor: `sip:bob@${domain}`,
  media: {
    constraints: { audio: false, video: true },
    local: {
      video:  getVideo("videoLocalBob") 
    },
    remote: {
      video:  getVideo("videoRemoteBob") 
    }
  },
  delegate: delegate
};


// Construct a SimpleUser instance
const simpleUser = new Web.SimpleUser(webSocketServer, options);
const simpleUser2 = new Web.SimpleUser(webSocketServer, options2);




simpleUser.connect()
  .then(() => {
    // simpleUser.call("sip:bob@example.com")
    console.log("connected");
    (getE('sip-address') as HTMLInputElement).disabled = false;
    (getButton('connectUser')).disabled = true;
    (getButton('registerUser')).disabled = false;

    simpleUser.register().then(() => {
      console.log("Nice reg");
      (getButton('registerUser')).disabled = true;
      (getButton('callBtn')).disabled = false;
      
      (getButton('callBtn')).addEventListener('click', ()=>{
        simpleUser.call(`sip:bob@${domain}`, undefined, {
          // An example of how to get access to a SIP response message for custom handling
          requestDelegate: {
            onReject: (response) => {
              console.warn(` INVITE rejected`);
              let message = `Session invitation to  rejected.\n`;
              message += `Reason: ${response.message.reasonPhrase}\n`;
              alert(message);
            }
          },
          withoutSdp: false
        })
        .catch((error: Error) => {
          console.error(`[ failed to begin session`);
          console.error(error);
          alert(` Failed to begin session.\n` + error);
        });
      })

    }).catch((error: Error) => {
      console.log("Error in registration:", error);
    });

  }).catch((error: Error) => {
    console.log("Error in connection:", error);
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
